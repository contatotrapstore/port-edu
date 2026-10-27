export type DraftInput={topic:string;brief:string;caption:string;slides:string[];sources:string[]};
export function parseDraft(form:FormData):DraftInput{
  const text=(key:string,max:number)=>{const v=form.get(key);if(typeof v!=='string'||v.length>max)throw Error('Campo inválido: '+key);return v.trim();};
  const topic=text('topic',160),brief=text('brief',5000),caption=text('caption',2200);
  const slides=text('slides',12000).split('\n').map(s=>s.trim()).filter(Boolean);
  const sources=text('sources',5000).split('\n').map(s=>s.trim()).filter(Boolean);
  if(topic.length<5||brief.length<10||slides.length<2||slides.length>10||slides.some(s=>s.length>500))throw Error('Informe tema, briefing e de 2 a 10 slides (até 500 caracteres cada).');
  if(sources.some(s=>{try{return new URL(s).protocol!=='https:';}catch{return true;}}))throw Error('As fontes precisam ser links HTTPS válidos.');
  return {topic,brief,caption,slides,sources};
}
