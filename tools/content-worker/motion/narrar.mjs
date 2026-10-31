// Narra um MP4 pronto: voz da marca em PT-BR (ElevenLabs, brands.guidelines.voz), trilha da marca baixa por baixo
// (ducking do mix.py, -14 LUFS / -1,5 dBTP) e legenda queimada palavra por palavra pelos tempos da voz.
// Uso (na raiz do checkout):
//   node tools/content-worker/motion/narrar.mjs --marca revix --video entrada.mp4 --roteiro roteiro.txt --saida saida.mp4
//   opcionais: --estilo pulse|warm|lofi|garage  --inicio 0.3  --sem-legenda
// A voz fica em cache pelo texto: rodar de novo com o mesmo roteiro não gasta crédito.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {parseEnv} from 'node:util';
import {fileURLToPath} from 'node:url';
import pg from 'pg';
import {falar,vozDaMarca} from './voz.mjs';

const MOTION=path.dirname(fileURLToPath(import.meta.url)),REPO=path.resolve(MOTION,'../../..');
const arg=(k,d)=>{const i=process.argv.indexOf('--'+k);return i>0?process.argv[i+1]:d;};
const marca=arg('marca'),video=path.resolve(arg('video')||''),roteiro=arg('roteiro'),saida=path.resolve(arg('saida')||'');
if(!marca||!fs.existsSync(video)||!roteiro||!arg('saida'))throw Error('uso: --marca <handle> --video <mp4> --roteiro <txt> --saida <mp4>');
const inicio=Number(arg('inicio','0.3')),legenda=!process.argv.includes('--sem-legenda');
const lerEnv=f=>fs.existsSync(f)?parseEnv(fs.readFileSync(f,'utf8')):{};
const env={...lerEnv(path.join(REPO,'.env.local')),...lerEnv(path.join(REPO,'.env.elevenlabs.local')),...process.env};
const PY=env.CONTENT_PYTHON||path.join(REPO,'tools/content-worker/.venv/Scripts/python.exe');
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const run=(cmd,args,opts={})=>{const r=spawnSync(cmd,args,{encoding:'utf8',windowsHide:true,...opts});if(r.status)throw Error(cmd+': '+String(r.stderr).slice(-800));return r.stdout;};

// diretrizes da marca (voz, cores, fonte, trilha)
const u=new URL(env.CONTENT_DATABASE_URL);for(const k of['sslmode','sslcert','sslkey','sslrootcert'])u.searchParams.delete(k);
const db=new pg.Client({connectionString:u.href,ssl:{rejectUnauthorized:true,ca:env.CONTENT_DATABASE_CA},connectionTimeoutMillis:10000});
await db.connect();const row=(await db.query('select guidelines from content_studio.brands where handle=$1',[marca])).rows[0];await db.end();
if(!row)throw Error('marca_desconhecida: '+marca);
const g=row.guidelines||{},cores=g.visual?.colors||{};

const info=JSON.parse(run('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height:format=duration','-of','json',video]));
const dur=Number(info.format.duration),W=info.streams[0].width,H=info.streams[0].height;
const texto=fs.readFileSync(roteiro,'utf8').replace(/\s+/g,' ').trim();
if(!texto)throw Error('roteiro_vazio');
// estimativa antes de pagar: ~15 caracteres por segundo de fala em PT-BR
if(texto.length/15+inicio>dur+2)throw Error(`roteiro_longo_demais: ~${Math.round(texto.length/15)}s de fala para ${dur.toFixed(1)}s de vídeo`);
const dir=path.join(REPO,'output/conteudo/narrar',marca+'-'+hash([fs.statSync(video).size,path.basename(video),texto]).slice(0,12));fs.mkdirSync(dir,{recursive:true});

const {voiceId,model}=vozDaMarca(g,env);
const voz=await falar({dir,texto,voiceId,model,apiKey:env.ELEVENLABS_API_KEY});
const palavras=voz.words.map(w=>({text:w.text,start:w.start+inicio,end:w.end+inicio}));
const fimFala=palavras.at(-1).end;
if(fimFala>dur-.1)throw Error(`narracao_maior_que_video: ${fimFala.toFixed(1)}s de voz para ${dur.toFixed(1)}s de vídeo (encurte o roteiro)`);

// trilha da marca e mixagem (mesmo mix.py do motor: ducking sob a voz e loudness final)
const estilo=arg('estilo',g.musica?.estilo||'pulse'),seed=parseInt(hash([marca,texto]).slice(0,6),16)%100000;
const musica=path.join(dir,'musica.wav');
fs.writeFileSync(path.join(dir,'musica.spec.json'),JSON.stringify({style:estilo,seconds:dur+1,seed,out:musica}));
run(PY,[path.join(MOTION,'music.py'),path.join(dir,'musica.spec.json')]);
const mix={duration:+dur.toFixed(3),out:path.join(dir,'mix.wav'),music:{file:musica,offset:0,gain_db:-8,duck_db:8},voice:{file:voz.mp3,at:inicio},sfx_dir:'',sfx:[],seed};
fs.writeFileSync(path.join(dir,'mix.spec.json'),JSON.stringify(mix));
const loud=JSON.parse(run(PY,[path.join(MOTION,'mix.py'),path.join(dir,'mix.spec.json')]).trim().split('\n').pop());

// legenda: grupos de até 3 palavras; a palavra falada no momento fica na cor da marca
const assCor=hex=>{const h=String(hex||'#F5B935').replace('#','');return `&H00${h.slice(4,6)}${h.slice(2,4)}${h.slice(0,2)}&`.toUpperCase();};
const t=s=>{const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=(s%60).toFixed(2).padStart(5,'0');return `${h}:${String(m).padStart(2,'0')}:${x}`;};
const esc=s=>s.replace(/[{}\\]/g,'');
const grupos=[];let gr=[];for(const w of palavras){gr.push(w);if(/[.,?!:;]$/.test(w.text)||gr.length>=3||gr.map(x=>x.text).join(' ').length>=17){grupos.push(gr);gr=[];}}if(gr.length)grupos.push(gr);
const fonte=g.visual?.font==='SpaceGrotesk'?'Space Grotesk':'Geist';
const linhas=[];
grupos.forEach((grupo,gi)=>{const limite=gi+1<grupos.length?grupos[gi+1][0].start:grupo.at(-1).end+.5;
  grupo.forEach((w,i)=>{const a=w.start,b=i+1<grupo.length?grupo[i+1].start:limite;
    linhas.push(`Dialogue: 0,${t(a)},${t(Math.max(b,a+.05))},Fala,,0,0,0,,${grupo.map((x,k)=>k===i?`{\\c${assCor(cores.amber)}}${esc(x.text)}{\\c&H00FFFFFF&}`:esc(x.text)).join(' ')}`);});});
const vertical=H>W,ass=`[Script Info]
ScriptType: v4.00+
PlayResX: ${W}
PlayResY: ${H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Fala,${fonte},${Math.round(W*.058)},&H00FFFFFF,&H00FFFFFF,&H50080808,&H00000000,1,0,0,0,100,100,0,0,3,${Math.round(W*.014)},0,2,${Math.round(W*.06)},${Math.round(W*.06)},${Math.round(H*(vertical?.32:.16))},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${linhas.join('\n')}
`;
fs.writeFileSync(path.join(dir,'legenda.ass'),ass);
const fontes=path.join(dir,'fonts');fs.mkdirSync(fontes,{recursive:true});for(const f of fs.readdirSync(path.join(MOTION,'fonts')).filter(f=>f.endsWith('.ttf')))fs.copyFileSync(path.join(MOTION,'fonts',f),path.join(fontes,f));
run('ffmpeg',['-y','-v','error','-i',video,'-i',mix.out,'-map','0:v:0','-map','1:a:0',...(legenda?['-vf','subtitles=legenda.ass:fontsdir=fonts']:[]),
  '-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709',
  '-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-t',String(dur),'-movflags','+faststart',saida],{cwd:dir});
console.log(JSON.stringify({saida,duracao:+dur.toFixed(1),fala_ate:+fimFala.toFixed(1),lufs:loud.lufs,true_peak:loud.true_peak,voz:{voice_id:voiceId,modelo:model},estilo,legenda}));
