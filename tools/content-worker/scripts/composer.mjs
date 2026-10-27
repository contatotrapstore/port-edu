import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const repo=fileURLToPath(new URL('../../../',import.meta.url));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function slideHtml(text,index,total){
 if(typeof text!=='string'||text.length>500||!text.trim())throw Error('Texto inválido');
 const dark=index%3===1;
 return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Slide ${index+1}</title><style>
 @font-face{font-family:Geist;src:url('../kit/fonts/Geist-Variable.ttf')}*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1350px;overflow:hidden}body{font-family:Geist,sans-serif;background:${dark?'#192d25':'#e9e7df'};color:${dark?'#e9e7df':'#172821'}}main{padding:80px;height:100%;position:relative}header,footer{display:flex;justify-content:space-between;font-size:24px;border-bottom:1px solid #899b85;padding-bottom:24px}h1{font-size:${text.length>300?47:text.length>180?55:70}px;font-weight:520;line-height:1.22;letter-spacing:-2px;position:absolute;top:210px;left:80px;width:920px;margin:0;overflow-wrap:anywhere}.graphic{position:absolute;bottom:245px;left:80px;width:920px;display:flex;gap:22px}.bar{height:100px;flex:1;background:${dark?'#b4c5a4':'#53715c'};opacity:.24;transform-origin:left}footer{position:absolute;left:80px;right:80px;bottom:80px;border-bottom:0;border-top:1px solid #899b85;padding-top:24px;font-size:21px}.tag{position:absolute;bottom:390px;font-size:24px;letter-spacing:3px}</style><main><header data-safe><span>EDevsHub / IA e sistemas</span><span>${String(index+1).padStart(2,'0')} / ${total}</span></header><h1 data-safe>${escape(text)}</h1><span class="tag" data-safe>${index===0?'UMA IDEIA PARA SUA OPERAÇÃO':index===total-1?'PRÓXIMO PASSO':'NA PRÁTICA'}</span><div class="graphic"><div class="bar"></div><div class="bar"></div><div class="bar"></div></div><footer data-safe><span>@edevshub</span><span>Software · Integrações · IA</span></footer></main><script>window.__slide={index:${index+1},duration:8,cues:[{t:.5,tipo:'pop',gain:.3},{t:1.5,tipo:'clique',gain:.25},{t:2.5,tipo:'land',gain:.3}]};window.seek=(time)=>{const t=((time%8)+8)%8;document.querySelectorAll('.bar').forEach((bar,i)=>{const pulse=t>.5&&t<5?Math.max(0,1-Math.abs(t-(1+i))/.8):0;bar.style.transform='scaleY('+(1+pulse*.4)+')';bar.style.opacity=String(.24+pulse*.55)});};document.fonts.ready.then(()=>{window.seek(0);window.__ready=true;});</script></html>`;
}
export function composeProject(job,slides){
 if(!/^[0-9a-f-]{36}$/.test(job.id)||!Number.isInteger(job.attempts))throw Error('Job inválido');
 if(!Array.isArray(slides)||slides.length<2||slides.length>10)throw Error('Slides inválidos');
 const root=path.join(repo,'output/conteudo',`job-${job.id}-${job.attempts}`);
 if(fs.existsSync(root))throw Error('Workspace já existe; não sobrescrever.');
 for(const dir of ['src/slides','src/kit','scripts','resultados','audio'])fs.mkdirSync(path.join(root,dir),{recursive:true});
 const upstream=path.join(repo,'tools/content-worker/vendor/criador-de-carrosseis-simples-0c0323d44ecdf69c501145a27af0796763efaff5');
 fs.cpSync(path.join(upstream,'assets/fonts'),path.join(root,'src/kit/fonts'),{recursive:true});
 const music=fs.readFileSync(path.join(upstream,'scripts/musica.py'),'utf8').replace("open(SAI / 'beats.json')","open(SAI / 'beats.json', encoding='utf-8')").replace("open(SAI / 'loudness.json', 'w')","open(SAI / 'loudness.json', 'w', encoding='utf-8')");
 fs.writeFileSync(path.join(root,'scripts/musica.py'),music);
 slides.forEach((text,i)=>fs.writeFileSync(path.join(root,'src/slides',`slide-${String(i+1).padStart(2,'0')}.html`),slideHtml(text,i,slides.length)));
 return root;
}
