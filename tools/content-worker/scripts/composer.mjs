import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const repo=fileURLToPath(new URL('../../../',import.meta.url));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function storyboard(slides){
 const seed=[...slides.join('')].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,7);
 const direction=['editorial','blueprint','console'][seed%3];
 const middle=['terminal','cards','flow','focus'];
 return slides.map((text,index)=>{
  const layout=index===0?'cover':index===slides.length-1?'closing':middle[(index-1+seed%2)%middle.length];
  const types={cover:['whoosh','impacto'],terminal:['tecla','tecla','clique'],cards:['pop','land'],flow:['clique','whoosh','land'],focus:['tchac','pop'],closing:['whoosh','clique']};
  return {layout,direction,cues:types[layout].map((tipo,i)=>({t:1+i*.5,tipo,gain:.28,o_que:layout==='terminal'?'digitação':layout==='cards'?'cartão pousa':'elemento atravessa'}))};
 });
}
export function slideHtml(text,index,total,plan=storyboard(Array.from({length:total},()=>text))[index]){
 if(typeof text!=='string'||text.length>500||!text.trim())throw Error('Texto inválido');
 const dark=plan.direction==='console'||(plan.direction==='blueprint'&&index%2===0);
 const ink=dark?'#edf0e6':'#172b25',bg=dark?'#132721':plan.direction==='blueprint'?'#dce7e2':'#eeeae0',accent=dark?'#c4df88':'#37684e';
 const parts=text.split(/(?<=[.!?])\s+/u);
 const title=parts[0].trim(),body=parts.slice(1).join(' ').trim();
 const e=escape;
 const cursor='<svg class="cursor moving" width="72" height="86" viewBox="0 0 72 86"><path d="M8 6 L10 66 L28 51 L43 78 L55 71 L40 44 L63 42 Z" fill="'+accent+'" stroke="'+ink+'" stroke-width="3"/></svg>';
 const layouts={
  cover:`<div class="eyebrow" data-safe>IA APLICADA / IDEIAS PARA NEGÓCIOS</div><h1 data-safe>${e(title)}</h1><p class="body" data-safe>${e(body)}</p><div class="orbit moving"><span>IA</span><i></i><b>+</b></div>${cursor}`,
  terminal:`<div class="eyebrow" data-safe>DO CONCEITO À OPERAÇÃO</div><h1 class="compact" data-safe>${e(title)}</h1><div class="window moving" data-safe><div class="chrome"><i></i><i></i><i></i><span>NOTA DE IMPLEMENTAÇÃO</span></div><p>${e(body||title)}</p><div class="typing"><span>→</span><span> entender · validar · executar</span><b>▌</b></div></div>${cursor}`,
  cards:`<div class="eyebrow" data-safe>UMA DECISÃO, DOIS PONTOS DE ATENÇÃO</div><div class="cards"><article class="moving" data-safe><small>01 / CONTEXTO</small><h2>${e(title)}</h2></article><article class="moving" data-safe><small>02 / NA PRÁTICA</small><p>${e(body||'Leve esta pergunta para o seu processo antes de automatizar.')}</p><span class="bigarrow">↗</span></article></div>`,
  flow:`<div class="eyebrow" data-safe>DESENHE O CAMINHO</div><h1 class="compact" data-safe>${e(title)}</h1><p class="body" data-safe>${e(body)}</p><div class="flow" data-safe><div class="moving">ENTRADA<span>Dados</span></div><b>→</b><div class="moving">REGRA<span>Validação</span></div><b>→</b><div class="moving">SAÍDA<span>Ação</span></div></div><p class="schematic" data-safe>Esquema ilustrativo de uma automação</p>`,
  focus:`<div class="focus-mark moving">“</div><div class="eyebrow" data-safe>GUARDE ESTA IDEIA</div><h1 data-safe>${e(title)}</h1><p class="body" data-safe>${e(body)}</p><div class="underline moving"></div>`,
  closing:`<div class="eyebrow" data-safe>DA IDEIA AO PRÓXIMO PASSO</div><h1 data-safe>${e(title)}</h1><p class="body" data-safe>${e(body)}</p><div class="cta moving" data-safe><span>Vamos conversar sobre sua operação</span><b>↗</b></div>${cursor}`
 };
 if(!layouts[plan.layout])throw Error('Layout inválido');
 return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Slide ${index+1}</title><style>
 @font-face{font-family:Geist;src:url('../kit/fonts/Geist-Variable.ttf')}*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1350px;overflow:hidden}body{font-family:Geist,sans-serif;background:${bg};color:${ink}}main{padding:80px;height:100%;position:relative;background-image:${plan.direction==='blueprint'?'linear-gradient(#78948718 1px,transparent 1px),linear-gradient(90deg,#78948718 1px,transparent 1px)':'none'};background-size:54px 54px}header,footer{display:flex;justify-content:space-between;font-size:22px;border-bottom:1px solid #789487;padding-bottom:24px}footer{position:absolute;left:80px;right:80px;bottom:80px;border-bottom:0;border-top:1px solid #789487;padding-top:24px;font-size:20px}.eyebrow{font-size:21px;letter-spacing:3px;margin-top:64px;color:${accent}}h1{font-size:${title.length>200?48:title.length>115?61:82}px;font-weight:550;line-height:1.08;letter-spacing:-3px;margin:36px 0 0;max-width:920px;overflow-wrap:anywhere}h1.compact{font-size:${title.length>160?46:62}px;letter-spacing:-2px}.body{font-size:${body.length>200?31:36}px;line-height:1.4;margin-top:30px;max-width:870px}.orbit{position:absolute;left:130px;bottom:250px;width:290px;height:290px;border:1px solid ${accent};border-radius:50%;display:grid;place-items:center}.orbit span{font-size:80px}.orbit i{position:absolute;inset:35px;border:1px solid ${accent};border-radius:50%}.orbit b{position:absolute;right:0;top:25px;background:${accent};color:${bg};width:60px;height:60px;border-radius:50%;text-align:center;font-size:44px}.cursor{position:absolute;right:150px;bottom:240px}.window{margin-top:50px;border:1px solid #789487;border-radius:20px;background:${dark?'#0b1915':'#faf8f0'};padding:30px}.chrome{display:flex;gap:8px;align-items:center}.chrome i{width:12px;height:12px;background:${accent};border-radius:50%}.chrome span{font-size:16px;margin-left:20px;letter-spacing:2px}.window p{font-size:${body.length>250?30:39}px;line-height:1.4;min-height:170px}.typing{border-top:1px solid #789487;padding-top:24px;font-size:25px;color:${accent};font-family:monospace}div.cards{margin-top:38px;display:grid;gap:26px}.cards article{border:1px solid #789487;border-radius:20px;padding:36px;position:relative;min-height:285px}.cards article:nth-child(2){background:${accent};color:${bg}}.cards small{font-size:19px;letter-spacing:2px}.cards h2,.cards p{font-size:${text.length>320?35:43}px;line-height:1.18;max-width:780px;font-weight:500;margin:25px 0 5px}.bigarrow{position:absolute;right:30px;bottom:18px;font-size:60px}div.flow{display:flex;align-items:center;gap:18px;margin-top:75px}.flow div{padding:28px 20px;border:1px solid #789487;border-radius:18px;flex:1;font-size:18px;letter-spacing:2px}.flow span{display:block;font-size:28px;letter-spacing:-1px;margin-top:20px}.flow b{font-size:36px}.schematic{font-size:20px;opacity:.65;margin-top:24px}.focus-mark{position:absolute;bottom:140px;right:85px;font-size:400px;line-height:1;opacity:.14}.underline{height:12px;width:240px;background:${accent};margin-top:55px;transform-origin:left}.cta{margin-top:70px;background:${accent};color:${bg};padding:35px;border-radius:60px;display:flex;justify-content:space-between;align-items:center;font-size:28px}.cta b{font-size:42px}
 </style><main class="${plan.layout}"><header data-safe><span>edevshub / ${plan.direction==='console'?'SYSTEM NOTES':'CONTENT STUDIO'}</span><span>${String(index+1).padStart(2,'0')} / ${total}</span></header>${layouts[plan.layout]}<footer data-safe><span>@edevshub</span><span>Software · Integrações · IA</span></footer></main><script>
 window.__slide={index:${index+1},duration:8,cues:${JSON.stringify(plan.cues)}};
 window.seek=(time)=>{const t=((time%8)+8)%8;const active=t>.15&&t<6.8;document.querySelectorAll('.moving').forEach((el,i)=>{const pulse=active?Math.max(0,1-Math.abs(t-(1+i*.5))/1.2):0;el.style.transform=el.classList.contains('cursor')?'translate('+(-pulse*70)+'px,'+(-pulse*45)+'px)':el.classList.contains('underline')?'scaleX('+(1+pulse*1.6)+')':'translateY('+(-pulse*16)+'px)';el.style.filter='brightness('+(1+pulse*.13)+')';});const caret=document.querySelector('.typing b');if(caret){caret.style.opacity=active&&Math.floor(t*2)%2?'0':'1';const words=document.querySelector('.typing span:nth-child(2)');const line=' entender · validar · executar';words.textContent=active&&t<3?line.slice(0,Math.max(1,Math.floor((t-.5)*line.length/2))):line;}};document.fonts.ready.then(()=>{window.seek(0);window.__ready=true;});</script></html>`;
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
 const plan=storyboard(slides);
 fs.writeFileSync(path.join(root,'storyboard.json'),JSON.stringify(plan,null,2));
 slides.forEach((text,i)=>fs.writeFileSync(path.join(root,'src/slides',`slide-${String(i+1).padStart(2,'0')}.html`),slideHtml(text,i,slides.length,plan[i])));
 return root;
}
