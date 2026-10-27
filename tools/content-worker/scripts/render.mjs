// Renderer próprio. Executa somente HTML local confiável; nunca recebe HTML arbitrário via API.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright';
import { projectPath, parseArgs, safeFile } from './paths.mjs';

const options = parseArgs(process.argv.slice(2));
const repo = fileURLToPath(new URL('../../../', import.meta.url));
const root = projectPath(path.join(repo,'output','conteudo'), options.project);
const slides = fs.readdirSync(path.join(root,'src','slides')).filter(f=>/^slide-\d{2}\.html$/.test(f)).sort();
if (!slides.length || slides.length>10) throw new Error('Esperado de 1 a 10 slides.');
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.ttf':'font/ttf','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4'};
const server = http.createServer((req,res)=>{
  try { const file=safeFile(root,req.url); res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}); fs.createReadStream(file).pipe(res); }
  catch { res.writeHead(404);res.end(); }
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
let browser;
try {
  browser=await chromium.launch({headless:true,args:['--force-color-profile=srgb','--disable-lcd-text','--font-render-hinting=none']});
  const origin=`http://127.0.0.1:${server.address().port}`;
  const beats={bpm:120,batida_s:.5,compasso_s:2,sampleRate:48000,slides:[],compassos_total:0};
  const qa=[];
  for (const file of slides) {
    const id=file.slice(6,8);
    const page=await browser.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',route=>route.request().url().startsWith(origin+'/') ? route.continue() : route.abort());
    await page.goto(`${origin}/src/slides/${file}`);
    await page.waitForFunction(()=>window.__ready===true,{},{timeout:30000});
    const meta=await page.evaluate(()=>window.__slide);
    if (![4,6,8].includes(meta.duration)) throw new Error('Duração inválida');
    const shot=async t=>{await page.evaluate(t=>window.seek(t),t);return page.screenshot({animations:'disabled'});};
    const out=path.join(root,'resultados');fs.mkdirSync(path.join(out,'estatico'),{recursive:true});
    if (options.mode==='stills') fs.writeFileSync(path.join(out,'estatico',`slide-${id}.png`),await shot(0));
    if (options.mode==='cues') {
      const bars=meta.duration/2;
      beats.slides.push({slide:Number(id),duracao_s:meta.duration,compassos:bars,compassos_da_musica:[beats.compassos_total+1,beats.compassos_total+bars],batidas:Array.from({length:meta.duration*2},(_,i)=>i/2),eventos:meta.cues||[]});
      beats.compassos_total+=bars;
    }
    if (options.mode==='qa') {
      const first=await shot(0), last=await shot(meta.duration-1/30), middle=await shot(2), again=await shot(0);
      const overflow=await page.evaluate(()=>[...document.querySelectorAll('[data-safe]')].filter(e=>{const r=e.getBoundingClientRect();return r.left<60||r.right>1020||r.top<50||r.bottom>1290;}).map(e=>e.textContent));
      const result={slide:id,loop:first.equals(last),deterministic:first.equals(again),animated:!middle.equals(first),overflow,errors};qa.push(result);
      if (!result.loop||!result.deterministic||!result.animated||overflow.length||errors.length) throw new Error(JSON.stringify(result));
    }
    if (options.mode==='video') {
      const wav=path.join(root,'audio',`slide-${id}.wav`);
      if (!fs.existsSync(wav)) throw new Error('Falta áudio: gere a trilha antes de renderizar.');
      const temp=path.join(out,`slide-${id}.partial.mp4`);
      const ff=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','png','-i','-','-i',wav,'-map','0:v','-map','1:a','-vf','scale=out_color_matrix=bt709:out_range=tv,format=yuv420p','-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-color_range','tv','-c:a','aac','-b:a','192k','-ar','48000','-t',String(meta.duration),'-movflags','+faststart',temp],{windowsHide:true});
      let stderr='';ff.stderr.on('data',d=>{stderr=(stderr+d).slice(-4000);});
      let failure;const finished=once(ff,'close').then(([code])=>{if(code!==0)failure=new Error(stderr||'FFmpeg falhou');},e=>{failure=e;});
      ff.stdin.on('error',e=>{failure=e;});
      const timeout=setTimeout(()=>{failure=new Error('Render excedeu 10 minutos');ff.kill();},600000);
      try {
        for (let frame=0;frame<meta.duration*30;frame++) {
          if(failure)throw failure;
          const buffer=await shot(frame/30);
          if(!ff.stdin.write(buffer)) await Promise.race([once(ff.stdin,'drain'),finished]);
        }
        ff.stdin.end();await finished;if(failure)throw failure;
        fs.renameSync(temp,path.join(out,`slide-${id}.mp4`));
      } finally {clearTimeout(timeout);if(ff.exitCode===null)ff.kill();}
    }
    if(errors.length)throw new Error(errors.join('\n'));
    await page.close();console.log(`OK ${options.mode} slide ${id}`);
  }
  if(options.mode==='cues'){fs.mkdirSync(path.join(root,'audio'),{recursive:true});fs.writeFileSync(path.join(root,'audio','beats.json'),JSON.stringify(beats,null,2));}
  if(options.mode==='qa')fs.writeFileSync(path.join(root,'resultados','qa.json'),JSON.stringify(qa,null,2));
} finally {await browser?.close();server.close();}
