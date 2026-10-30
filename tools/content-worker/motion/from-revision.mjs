// Converte uma revisão do Content Studio em roteiro do motor de motion.
// Se o brief já traz cenas estruturadas (brief.motion), usa direto; senão monta cenas a partir dos slides
// ("Título. fala"), com a fala inteira virando narração e cada cena começando na primeira frase do seu slide.
const STYLES=['pulse','warm','garage'];

export function splitSlide(text){
  const s=String(text).trim(),m=s.match(/^(.{3,90}?[.!?:])\s+(.+)$/s);
  return m?{title:m[1].replace(/[.:]$/,''),speech:m[2].trim()}:{title:s.slice(0,90),speech:s};
}

export function seedFrom(id){let h=0;for(const c of String(id))h=(h*31+c.charCodeAt(0))>>>0;return h%100000;}

export function motionItem(revision,format,{id='post',seed}={}){
  const brief=revision.brief||{},s=seed??seedFrom(revision.id||id);
  if(brief.motion?.scenes?.length)return {...brief.motion,id,format,seed:brief.motion.seed??s,music:{style:STYLES[s%STYLES.length],...brief.motion.music}};
  const slides=(revision.slides||[]).map(splitSlide);
  if(slides.length<2)throw Error('slides_insuficientes');
  const narration=slides.map(x=>x.speech).join(' ');
  const scenes=slides.map((x,i)=>{
    const cue=i===0?undefined:x.speech.split(/\s+/).slice(0,3).join(' ');
    if(i===0)return {kind:'hook',eyebrow:brief.series||'EDevsHub',title:x.title};
    if(i===slides.length-1)return {kind:'cta',cue,eyebrow:'Sua vez',title:x.title,options:[],save:'Salva pra ver depois'};
    return {kind:'statement',cue,title:x.title,sub:x.speech.length<=110?x.speech:undefined};
  });
  return {id,format,seed:s,narration,scenes,music:{style:STYLES[s%STYLES.length]},source:(revision.source_refs||[])[0]?'fonte: '+new URL(revision.source_refs[0]).hostname:undefined};
}
