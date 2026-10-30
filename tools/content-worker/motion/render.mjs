// Renderiza composições do motor (stage.html + timeline.json) quadro a quadro com Playwright e codifica com FFmpeg.
// Só serve arquivos locais do motor e da pasta do projeto; qualquer outra requisição é bloqueada.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {once} from 'node:events';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const MOTION=path.dirname(fileURLToPath(import.meta.url));
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.ttf':'font/ttf','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
// Áreas que o Instagram não cobre: topo do Reel (título/câmera), base (legenda/perfil) e coluna de botões à direita
const SAFE={reel:{l:48,r:1032,t:140,b:1470},carousel:{l:40,r:1040,t:40,b:1310}};

function inside(root,rel){const file=path.resolve(root,'.'+decodeURIComponent(rel));if(!file.startsWith(path.resolve(root)+path.sep))throw Error('fora');return file;}

export async function openStudio(project){
  const server=http.createServer((req,res)=>{
    try{const u=new URL(req.url,'http://x');let file;
      if(u.pathname.startsWith('/motion/'))file=inside(MOTION,u.pathname.slice(7));
      else if(u.pathname.startsWith('/p/'))file=inside(project,u.pathname.slice(2));
      else throw Error('fora');
      res.writeHead(200,{'Content-Type':MIME[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).on('error',()=>res.end()).pipe(res);
    }catch{res.writeHead(404);res.end();}
  });
  await new Promise((ok,err)=>{server.once('error',err);server.listen(0,'127.0.0.1',ok);});
  const origin=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({headless:true,args:['--force-color-profile=srgb','--disable-lcd-text','--font-render-hinting=none']});
  async function page(timeline,slide){
    const meta=JSON.parse(fs.readFileSync(path.join(project,timeline),'utf8'));
    const p=await browser.newPage({viewport:{width:1080,height:meta.height},deviceScaleFactor:1});
    const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    await p.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.abort());
    await p.goto(`${origin}/motion/stage.html?data=/p/${timeline.replace(/\\/g,'/')}${slide?'&slide='+slide:''}`);
    await p.waitForFunction(()=>window.__ready===true||window.__error,null,{timeout:30000});
    const fail=await p.evaluate(()=>window.__error);if(fail)throw Error(fail);
    const comp=await p.evaluate(()=>window.__comp);
    const shot=async t=>{await p.evaluate(t=>window.seek(t),t);return p.screenshot({type:'png',animations:'disabled',caret:'initial'});};
    return {p,comp,meta,errors,shot,
      cues:()=>p.evaluate(()=>window.__cues),
      // confere se algum elemento visível da cena saiu da área segura ou estourou o próprio texto
      safety:async t=>{await p.evaluate(t=>window.seek(t),t);return p.evaluate(({b})=>{const out=[];const sc=document.querySelector('.scene.on');if(!sc)return out;
        for(const e of sc.querySelectorAll('h1,p,.chip,.card,.browser,.term,.opt,.item,.dst,.big')){const r=e.getBoundingClientRect(),cs=getComputedStyle(e);if(!r.width||cs.opacity==='0')continue;
          if(r.left<b.l-1||r.right>b.r+1||r.top<b.t-1||r.bottom>b.b+1)out.push((e.className||e.tagName)+': '+(e.textContent||'').trim().slice(0,40)+` [${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}]`);
          if(e.scrollWidth>e.clientWidth+2&&!e.matches('.browser,.term'))out.push('estouro: '+(e.textContent||'').trim().slice(0,40));}
        return out;},{b:SAFE[meta.format]});}};
  }
  async function video({timeline,slide,wav,out}){
    const v=await page(timeline,slide);const {duration,fps}=v.comp,frames=Math.round(duration*fps);
    const temp=out.replace(/\.mp4$/,'.partial.mp4');
    const ff=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-c:v','png','-i','-','-i',wav,
      '-map','0:v','-map','1:a','-vf','scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv',
      '-c:v','libx264','-preset','slow','-tune','animation','-crf','16','-profile:v','high','-level','4.1','-g',String(fps*2),
      '-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-color_range','tv',
      '-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-t',String(duration),'-movflags','+faststart',temp],{windowsHide:true});
    let err='';ff.stderr.on('data',d=>{err=(err+d).slice(-3000);});let failure;
    const done=once(ff,'close').then(([c])=>{if(c!==0)failure=Error(err||'ffmpeg falhou');});ff.stdin.on('error',e=>{failure=e;});
    try{for(let f=0;f<frames;f++){if(failure)throw failure;const buf=await v.shot(f/fps);if(!ff.stdin.write(buf))await Promise.race([once(ff.stdin,'drain'),done]);}
      ff.stdin.end();await done;if(failure)throw failure;fs.renameSync(temp,out);}
    finally{if(ff.exitCode===null)ff.kill();await v.p.close();}
    if(v.errors.length)throw Error(v.errors.join('\n'));
    return {frames,duration};
  }
  return {page,video,close:async()=>{await browser.close();server.close();}};
}
