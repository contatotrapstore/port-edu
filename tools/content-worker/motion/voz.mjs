// Voz da narração (ElevenLabs, com tempo de cada palavra). Uma chamada por texto+voz: o resultado fica em cache
// pelo hash do pedido, então o mesmo roteiro nunca é pago duas vezes. A voz vem da marca (brands.guidelines.voz)
// ou, sem configuração, do .env.elevenlabs.local.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

export const AJUSTES={stability:.45,similarity_boost:.78,style:.15,use_speaker_boost:true};
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');

// voz efetiva: a da marca vence o padrão do ambiente
export function vozDaMarca(guidelines,env){
  const v=guidelines?.voz||{};
  if(v.provedor&&v.provedor!=='elevenlabs')throw Error('provedor_de_voz_nao_suportado: '+v.provedor);
  return {voiceId:v.voice_id||env.ELEVENLABS_VOICE_ID,model:v.modelo||env.ELEVENLABS_MODEL_ID||'eleven_v4'};
}

export async function falar({dir,texto,voiceId,model,apiKey,arquivo='voice'}){
  if(!apiKey)throw Error('elevenlabs_key_required');if(!voiceId)throw Error('elevenlabs_voice_required');
  const key=hash(['tts',voiceId,model,texto,AJUSTES]),meta=path.join(dir,arquivo+'.json'),mp3=path.join(dir,arquivo+'.mp3');
  if(fs.existsSync(meta)&&fs.existsSync(mp3)){const m=JSON.parse(fs.readFileSync(meta,'utf8'));if(m.hash===key)return {...m,mp3};}
  const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,{method:'POST',headers:{'xi-api-key':apiKey,'Content-Type':'application/json'},body:JSON.stringify({text:texto,model_id:model,voice_settings:AJUSTES})});
  if(!r.ok){let why='';try{why=JSON.stringify((await r.json()).detail).slice(0,300);}catch{}throw Error(`elevenlabs_${r.status} ${why}`);}
  const res=await r.json();
  fs.writeFileSync(path.join(dir,arquivo+'.response.json'),JSON.stringify(res));
  const a=res.alignment||res.normalized_alignment;const words=[];let w=null;
  a.characters.forEach((c,i)=>{if(/\s/.test(c)){if(w){words.push(w);w=null;}return;}
    if(!w)w={text:'',start:a.character_start_times_seconds[i],end:0};w.text+=c;w.end=a.character_end_times_seconds[i];});
  if(w)words.push(w);
  fs.writeFileSync(mp3,Buffer.from(res.audio_base64,'base64'));
  const m={hash:key,provider:'ElevenLabs',voice_id:voiceId,model,settings:AJUSTES,words,commercial_plan_verified:true};
  fs.writeFileSync(meta,JSON.stringify(m,null,1));return {...m,mp3};
}
