// Converte uma revisão do Content Studio em roteiro do motor de motion.
// Se o brief já traz cenas estruturadas (brief.motion), usa direto; senão monta cenas a partir dos slides
// ("Título. fala"), com a fala inteira virando narração e cada cena começando na primeira frase do seu slide.
const STYLES=['pulse','warm','garage'];

export function splitSlide(text){
  const s=String(text).trim(),m=s.match(/^(.{3,90}?[.!?:])\s+(.+)$/s);
  return m?{title:m[1].replace(/[.:]$/,''),speech:m[2].trim()}:{title:s.slice(0,90),speech:s};
}

export function seedFrom(id){let h=0;for(const c of String(id))h=(h*31+c.charCodeAt(0))>>>0;return h%100000;}

// tema da marca para o motor (cores viram variáveis CSS; mark é o SVG do logo)
export function themeOf(brand){
  const g=brand?.guidelines||{},v=g.visual||{};
  if(!brand||brand.handle==='edevshub')return undefined;
  return {name:g.name||brand.handle,handle:g.instagram_username||brand.handle,colors:v.colors||{},mark:v.mark||undefined,font:v.font||undefined};
}

export function motionItem(revision,format,{id='post',seed}={}){
  const brief=revision.brief||{},s=seed??seedFrom(revision.id||id);
  if(brief.motion?.scenes?.length)return {...brief.motion,id,format,seed:brief.motion.seed??s,music:{style:STYLES[s%STYLES.length],...brief.motion.music}};
  const slides=(revision.slides||[]).map(splitSlide);
  if(slides.length<2)throw Error('slides_insuficientes');
  if(format==='carousel'){
    // carrossel: capa, um slide por ideia e o último com o convite; sem narração
    // corta por frase (nunca no meio): capa até ~150 caracteres, miolo até ~230, convite final até ~220
    const frases=(t,max)=>{let out='';for(const f of t.match(/[^.!?]+[.!?]*/g)||[t]){if((out+f).trim().length>max)break;out+=f;}return out.trim()||t.slice(0,max-1)+'…';};
    const out=slides.map((x,i)=>i===0?{kind:'cover',eyebrow:brief.series||'',title:x.title,sub:frases(x.speech,150)}
      :i===slides.length-1?{kind:'cta',eyebrow:'Sua vez',title:x.title,options:[],text:frases(x.speech,220),save:'Salva e segue pra mais'}
      :{kind:'statement',title:x.title,sub:frases(x.speech,230)});
    return {id,format,seed:s,slideSeconds:6,slides:out,music:{style:['lofi','garage','warm'][s%3]}};
  }
  const narration=slides.map(x=>x.speech).join(' ');
  const scenes=slides.map((x,i)=>{
    const cue=i===0?undefined:x.speech.split(/\s+/).slice(0,3).join(' ');
    if(i===0)return {kind:'hook',eyebrow:brief.series||'EDevsHub',title:x.title};
    if(i===slides.length-1)return {kind:'cta',cue,eyebrow:'Sua vez',title:x.title,options:[],save:'Salva pra ver depois'};
    return {kind:'statement',cue,title:x.title,sub:x.speech.length<=110?x.speech:undefined};
  });
  return {id,format,seed:s,narration,scenes,music:{style:STYLES[s%STYLES.length]},source:(revision.source_refs||[])[0]?'fonte: '+new URL(revision.source_refs[0]).hostname:undefined};
}
