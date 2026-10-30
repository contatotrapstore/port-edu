// Produz Reels e carrosséis com o motor de motion: voz (ElevenLabs, com tempo por palavra), cenas sincronizadas
// à fala, trilha exclusiva por post (Eleven Music), efeitos variados, loudness único, render e QA.
// Uso: node motion/produce.mjs --project <pasta> [--only id] [--stills] [--env arquivo] [--python exe] [--sfx pasta]
// Chamadas pagas (voz e música) ficam em cache pelo hash do pedido e nunca são repetidas automaticamente.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {parseEnv} from 'node:util';
import {fileURLToPath} from 'node:url';
import {openStudio} from './render.mjs';

const MOTION=path.dirname(fileURLToPath(import.meta.url)),REPO=path.resolve(MOTION,'../../..');
const arg=(k,d)=>{const i=process.argv.indexOf('--'+k);return i>0?process.argv[i+1]:d;};
const project=path.resolve(arg('project')),only=arg('only'),stills=process.argv.includes('--stills'),force=process.argv.includes('--force');
// mixagem e vídeo ficam em cache pelo hash do que os produziu (o render é a etapa lenta); --force refaz tudo
const ENGINE=['engine.js','engine.css','render.mjs','stage.html'].map(f=>fs.readFileSync(path.join(MOTION,f),'utf8'));
function mixCached(specFile,spec){const res=specFile.replace(/spec\.json$/,'result.json'),key=createHash('sha256').update(JSON.stringify(spec)+fs.readFileSync(path.join(MOTION,'mix.py'),'utf8')).digest('hex');
  if(!force&&fs.existsSync(spec.out)&&fs.existsSync(res)){const r=JSON.parse(fs.readFileSync(res,'utf8'));if(r.key===key)return r;}
  fs.writeFileSync(specFile,JSON.stringify(spec,null,1));const r={key,...py('mix.py',specFile)};fs.writeFileSync(res,JSON.stringify(r));return r;}
async function videoCached(studio,args,timelineFile){const mark=args.out+'.key',key=createHash('sha256').update(JSON.stringify([fs.readFileSync(path.join(project,timelineFile),'utf8'),args.slide||0,fs.readFileSync(args.wav).length,ENGINE])).digest('hex');
  if(!force&&fs.existsSync(args.out)&&fs.existsSync(mark)&&fs.readFileSync(mark,'utf8')===key)return;await studio.video(args);fs.writeFileSync(mark,key);}
const env={...process.env,...(fs.existsSync(arg('env',path.join(REPO,'.env.elevenlabs.local')))?parseEnv(fs.readFileSync(arg('env',path.join(REPO,'.env.elevenlabs.local')),'utf8')):{})};
const PY=arg('python',path.join(REPO,'tools/content-worker/.venv/Scripts/python.exe'));
const SFX=arg('sfx',path.join(REPO,'output/conteudo/audio-library-2026-10-28'));
const FPS=30,VOICE_AT=.12,QA_REEL='vertical-layout-audio-passed';
const content=JSON.parse(fs.readFileSync(path.join(project,'content.json'),'utf8'));
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const ceilFrames=s=>Math.ceil(s*FPS)/FPS;

async function eleven(endpoint,body,binary){
  if(!env.ELEVENLABS_API_KEY)throw Error('elevenlabs_key_required');
  const r=await fetch('https://api.elevenlabs.io'+endpoint,{method:'POST',headers:{'xi-api-key':env.ELEVENLABS_API_KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!r.ok){let why='';try{why=JSON.stringify((await r.json()).detail).slice(0,300);}catch{}throw Error(`elevenlabs_${r.status} ${why}`);}
  return binary?Buffer.from(await r.arrayBuffer()):r.json();
}

// Voz: um pedido por roteiro, guardado com o alinhamento para nunca pagar duas vezes pelo mesmo texto
async function voice(dir,text){
  const voiceId=env.ELEVENLABS_VOICE_ID,model=env.ELEVENLABS_MODEL_ID||'eleven_v4',settings={stability:.45,similarity_boost:.78,style:.15,use_speaker_boost:true};
  const key=hash(['tts',voiceId,model,text,settings]),meta=path.join(dir,'voice.json'),mp3=path.join(dir,'voice.mp3');
  if(fs.existsSync(meta)&&fs.existsSync(mp3)){const m=JSON.parse(fs.readFileSync(meta,'utf8'));if(m.hash===key)return m;}
  const res=await eleven(`/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,{text,model_id:model,voice_settings:settings});
  fs.writeFileSync(path.join(dir,'voice.response.json'),JSON.stringify(res));
  const a=res.alignment||res.normalized_alignment;const words=[];let w=null;
  a.characters.forEach((c,i)=>{if(/\s/.test(c)){if(w){words.push(w);w=null;}return;}
    if(!w)w={text:'',start:a.character_start_times_seconds[i],end:0};w.text+=c;w.end=a.character_end_times_seconds[i];});
  if(w)words.push(w);
  fs.writeFileSync(mp3,Buffer.from(res.audio_base64,'base64'));
  const m={hash:key,provider:'ElevenLabs',voice_id:voiceId,model,settings,words,commercial_plan_verified:true};
  fs.writeFileSync(meta,JSON.stringify(m,null,1));return m;
}

// Trilha exclusiva do post (instrumental). Primeiro tenta o Eleven Music (termos do plano: uso comercial online liberado,
// exceto cinema/TV/rádio/jogos); se a chave não tiver a permissão music_generation, sintetiza uma trilha original.
let elevenMusic=env.MUSIC_PROVIDER!=='synth';
async function music(dir,item,seconds){
  const meta=path.join(dir,'music.json');
  if(elevenMusic&&item.music.prompt){
    const body={prompt:item.music.prompt,music_length_ms:Math.max(3000,Math.round(seconds*1000)),model_id:'music_v1',force_instrumental:true};
    const key=hash(['music',body]),mp3=path.join(dir,'music.mp3');
    if(fs.existsSync(meta)&&fs.existsSync(mp3)&&JSON.parse(fs.readFileSync(meta,'utf8')).hash===key)return {file:mp3,provider:'Eleven Music'};
    try{
      const buf=await eleven('/v1/music?output_format=mp3_44100_128',body,true);
      if(buf.length<20000)throw Error('music_too_small');
      fs.writeFileSync(mp3,buf);fs.writeFileSync(meta,JSON.stringify({hash:key,provider:'Eleven Music',...body},null,1));return {file:mp3,provider:'Eleven Music'};
    }catch(e){if(!/missing_permissions|music_generation/.test(e.message))throw e;elevenMusic=false;console.log('Eleven Music sem permissão na chave: usando trilha sintetizada');}
  }
  const spec={style:item.music.style||'pulse',seconds,seed:item.seed||1,out:path.join(dir,'music.wav')};
  const key=hash(['synth',spec,fs.readFileSync(path.join(MOTION,'music.py'),'utf8')]);
  if(fs.existsSync(meta)&&fs.existsSync(spec.out)&&JSON.parse(fs.readFileSync(meta,'utf8')).hash===key)return {file:spec.out,provider:'EDevsHub synth'};
  fs.writeFileSync(path.join(dir,'music.spec.json'),JSON.stringify(spec));
  const info=py('music.py',path.join(dir,'music.spec.json'));
  fs.writeFileSync(meta,JSON.stringify({hash:key,provider:'EDevsHub synth',...info},null,1));return {file:spec.out,provider:'EDevsHub synth'};
}

const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
// procura o marcador a partir da cena anterior (frases curtas podem se repetir no roteiro)
function cueIndex(words,phrase,from=0){
  const want=phrase.split(/\s+/).map(norm).filter(Boolean),have=words.map(w=>norm(w.text));
  for(let i=from;i<have.length;i++)if(want.every((x,k)=>have[i+k]===x))return i;
  throw Error('fala_sem_marcador: '+phrase);
}

function py(script,specFile){const r=spawnSync(PY,[path.join(MOTION,script),specFile],{encoding:'utf8',windowsHide:true});if(r.status)throw Error(r.stderr.slice(-1500));return JSON.parse(r.stdout.trim().split('\n').pop());}
function probe(file){const r=spawnSync('ffprobe',['-v','error','-show_entries','stream=codec_name,width,height,pix_fmt,color_space,color_primaries,color_transfer,sample_rate,channels,bit_rate:format=duration,bit_rate','-of','json',file],{encoding:'utf8'});return JSON.parse(r.stdout);}
function sheet(files,out,cols){spawnSync('ffmpeg',['-y','-v','error',...files.flatMap(f=>['-i',f]),'-filter_complex',files.map((_,i)=>`[${i}]scale=360:-1[s${i}]`).join(';')+';'+files.map((_,i)=>`[s${i}]`).join('')+`xstack=inputs=${files.length}:layout=`+files.map((_,i)=>`${(i%cols)?Array.from({length:i%cols},()=>'w0').join('+'):'0'}_${Math.floor(i/cols)?Array.from({length:Math.floor(i/cols)},()=>'h0').join('+'):'0'}`).join('|')+':fill=black',out]);}

async function reel(studio,item){
  const dir=path.join(project,item.id);fs.mkdirSync(dir,{recursive:true});
  const v=await voice(dir,item.narration);
  const words=v.words.map(w=>({text:w.text,start:+(w.start+VOICE_AT).toFixed(3),end:+(w.end+VOICE_AT).toFixed(3)}));
  const end=words.at(-1).end,duration=ceilFrames(end+(item.tail??1.4));
  let from=0;const starts=item.scenes.map((s,i)=>{if(i===0)return 0;from=cueIndex(words,s.cue,from)+1;return Math.max(0,words[from-1].start-.1);});
  const scenes=item.scenes.map((s,i)=>({...s,start:+starts[i].toFixed(3),end:+(i+1<starts.length?starts[i+1]:duration).toFixed(3)}));
  const timeline={format:'reel',height:1920,fps:FPS,duration,series:content.series,when:item.when||content.when,source:item.source,scenes,words};
  fs.writeFileSync(path.join(dir,'timeline.json'),JSON.stringify(timeline,null,1));
  const rel=path.relative(project,path.join(dir,'timeline.json'));
  const pg=await studio.page(rel);const cues=await pg.cues();
  await pg.shot(0).then(b=>fs.writeFileSync(path.join(dir,'slide-01.png'),b));
  const stillsOut=[],issues=[];
  for(const [i,s] of scenes.entries()){const t=Math.min(s.end-.05,s.start+Math.min(2.6,(s.end-s.start)*.85));fs.writeFileSync(path.join(dir,`scene-${String(i+1).padStart(2,'0')}.png`),await pg.shot(t));stillsOut.push(path.join(dir,`scene-${String(i+1).padStart(2,'0')}.png`));issues.push(...(await pg.safety(t)).map(x=>`cena ${i+1}: ${x}`));}
  await pg.p.close();
  sheet(stillsOut,path.join(dir,'contact.jpg'),stillsOut.length);
  if(stills)return {id:item.id,issues,duration};
  const track=await music(dir,item,duration+1.5);
  const spec={duration,out:path.join(dir,'mix.wav'),music:{file:track.file,offset:item.music.offset||0,gain_db:item.music.gain_db??-8,duck_db:item.music.duck_db??8},voice:{file:path.join(dir,'voice.mp3'),at:VOICE_AT},sfx_dir:SFX,sfx:cues,seed:item.seed||1};
  const loud=mixCached(path.join(dir,'mix.spec.json'),spec);
  const out=path.join(dir,'slide-01.mp4');await videoCached(studio,{timeline:rel,wav:spec.out,out},rel);
  const info=probe(out);
  return {id:item.id,format:'reel',files:[{file:'slide-01.mp4',duration,lufs:loud.lufs,true_peak:loud.true_peak,probe:info}],issues,qa:issues.length?'failed':QA_REEL,
    provenance:{voice:{provider:'ElevenLabs',voice_id:v.voice_id,model:v.model},music:{provider:track.provider,style:item.music.style,seed:item.seed},sfx:[...new Set(cues.map(c=>c.sfx))],sfx_library:'Mixkit Sound Effects Free License',engine:'motion-v3',cover_ms:0}};
}

async function carousel(studio,item){
  const dir=path.join(project,item.id);fs.mkdirSync(dir,{recursive:true});
  const sec=item.slideSeconds||6,n=item.slides.length;
  const timeline={format:'carousel',height:1350,fps:FPS,slideSeconds:sec,series:content.series,when:item.when||content.when,source:item.source,slides:item.slides};
  fs.writeFileSync(path.join(dir,'timeline.json'),JSON.stringify(timeline,null,1));
  const rel=path.relative(project,path.join(dir,'timeline.json'));
  const track=stills?null:await music(dir,item,n*sec+1.5);
  const files=[],issues=[],sheets=[];
  for(let i=1;i<=n;i++){
    const id=String(i).padStart(2,'0'),pg=await studio.page(rel,i),cues=await pg.cues();
    fs.writeFileSync(path.join(dir,`slide-${id}.png`),await pg.shot(i===1?0:3));
    fs.writeFileSync(path.join(dir,`still-${id}.png`),await pg.shot(3));sheets.push(path.join(dir,`still-${id}.png`));
    issues.push(...(await pg.safety(3)).map(x=>`slide ${i}: ${x}`));await pg.p.close();
    if(stills)continue;
    const spec={duration:sec,out:path.join(dir,`slide-${id}.wav`),music:{file:track.file,offset:(i-1)*sec,gain_db:0,fade_in:i===1?.03:.25,fade_out:.45},voice:null,sfx_dir:SFX,sfx:cues,seed:(item.seed||1)*100+i};
    const loud=mixCached(path.join(dir,`slide-${id}.spec.json`),spec);
    const out=path.join(dir,`slide-${id}.mp4`);await videoCached(studio,{timeline:rel,slide:i,wav:spec.out,out},rel);
    files.push({file:`slide-${id}.mp4`,duration:sec,lufs:loud.lufs,true_peak:loud.true_peak,probe:probe(out)});
  }
  sheet(sheets,path.join(dir,'contact.jpg'),Math.min(n,3));
  return {id:item.id,format:'carousel',files,issues,qa:issues.length?'failed':'carousel-layout-audio-passed',
    provenance:{music:{provider:track?.provider,style:item.music.style,seed:item.seed},sfx_library:'Mixkit Sound Effects Free License',engine:'motion-v3'}};
}

const studio=await openStudio(project);const results=[];
try{
  for(const item of content.items){if(only&&item.id!==only)continue;
    const r=item.format==='reel'?await reel(studio,item):await carousel(studio,item);results.push(r);
    console.log(r.issues?.length?'ATENCAO':'OK',item.id,r.issues?.join(' | ')||'');}
}finally{await studio.close();}
const qaFile=path.join(project,'qa.json'),prev=fs.existsSync(qaFile)?JSON.parse(fs.readFileSync(qaFile,'utf8')):[];
fs.writeFileSync(qaFile,JSON.stringify([...prev.filter(p=>!results.some(r=>r.id===p.id)),...results],null,1));
