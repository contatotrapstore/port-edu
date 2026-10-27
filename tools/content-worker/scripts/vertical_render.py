"""On-demand vertical motion renderer. Public script text only is sent to Edge TTS.
Original procedural soundtrack/SFX. No Meta calls, no background loop.
"""
import asyncio, hashlib, json, math, pathlib, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.io import wavfile
from sound_library import synthesize, SR

REPO=pathlib.Path(__file__).resolve().parents[3]
FONT_DIR=REPO/'tools/content-worker/vendor/criador-de-carrosseis-simples-0c0323d44ecdf69c501145a27af0796763efaff5/assets/fonts'
W,H,FPS=1080,1920,30
IVORY='#E9E6DF'; GREEN='#0E1716'; AMBER='#F2B33D'; MUTED='#9AAFA5'
FONTS={}
def font(size,mono=False):
 key=(size,mono)
 if key not in FONTS:FONTS[key]=ImageFont.truetype(str(FONT_DIR/('GeistMono-Variable.ttf' if mono else 'Geist-Variable.ttf')),size)
 return FONTS[key]

def validate_script(data):
 if data.get('format') not in ('reel','story'):raise ValueError('invalid_format')
 slides=data.get('slides')
 if not isinstance(slides,list) or not 2<=len(slides)<=10 or any(not isinstance(s,str) or not s.strip() or len(s)>500 for s in slides):raise ValueError('invalid_scenes')
 custom=data.get('brief',{}).get('vertical',{}).get('scenes')
 if custom is not None and (not isinstance(custom,list) or len(custom)!=len(slides)):raise ValueError('invalid_storyboard')
 scenes=[]
 for i,text in enumerate(slides):
  parts=re.split(r'(?<=[.!?])\s+',text,maxsplit=1)
  scene=custom[i] if custom else {'title':parts[0], 'narration':text,'kind':['question','pipeline','terminal','checklist','closing'][i%5]}
  if not isinstance(scene,dict) or not 1<=len(scene.get('title',''))<=130 or not 1<=len(scene.get('narration',''))<=500:raise ValueError('invalid_scene')
  if scene.get('kind','question') not in ('question','pipeline','terminal','checklist','closing','compare'):raise ValueError('invalid_layout')
  labels=scene.get('labels',[])
  if not isinstance(labels,list) or len(labels)>5 or any(not isinstance(x,str) or len(x)>64 for x in labels):raise ValueError('invalid_labels')
  scenes.append(scene)
 return scenes

def subtitle_groups(words):
 result=[]
 for i in range(0,len(words),6):
  group=words[i:i+6]
  result.append({'start':group[0]['offset']/1e7,'end':(group[-1]['offset']+group[-1]['duration'])/1e7,'text':' '.join(w['text'] for w in group)})
 return result

def lines(text,size,max_width,mono=False):
 result=[];line=''
 for word in text.split():
  trial=(line+' '+word).strip()
  if font(size,mono).getlength(trial)>max_width and line:result.append(line);line=word
  else:line=trial
 if line:result.append(line)
 return result

def textblock(draw,text,xy,size,color=IVORY,width=880,max_lines=3,mono=False,spacing=1.15):
 while size>=22:
  ls=lines(text,size,width,mono)
  if len(ls)<=max_lines and all(font(size,mono).getlength(x)<=width for x in ls):break
  size-=2
 if len(ls)>max_lines:raise ValueError('text_overflow')
 x,y=xy
 for line in ls:draw.text((x,y),line,font=font(size,mono),fill=color);y+=int(size*spacing)
 return y

async def speech(scene,target):
 import edge_tts
 signature=hashlib.sha256(scene['narration'].encode()).hexdigest()
 meta=target.with_suffix('.json')
 if target.exists() and meta.exists():
  cached=json.loads(meta.read_text())
  if cached.get('hash')==signature:return cached['words']
 words=[]
 for attempt in range(3):
  try:
   words=[]
   with target.open('wb') as out:
    async for chunk in edge_tts.Communicate(scene['narration'],'pt-BR-AntonioNeural',rate='+5%',boundary='WordBoundary').stream():
     if chunk['type']=='audio':out.write(chunk['data'])
     elif chunk['type']=='WordBoundary':words.append({k:chunk[k] for k in ('text','offset','duration')})
   if not words or target.stat().st_size<1000:raise ValueError('empty_voice')
   meta.write_text(json.dumps({'hash':signature,'words':words}),encoding='utf-8');return words
  except Exception:
   if attempt==2:raise RuntimeError('voice_generation_failed') from None
   await asyncio.sleep(1+attempt)

def frame(scene,index,total,t,duration,subtitles,series,seed,logo):
 light=(scene.get('kind')=='compare' or (index%3==1 and scene.get('kind')!='terminal'))
 bg=IVORY if light else GREEN;ink=GREEN if light else IVORY;muted='#52645D' if light else MUTED
 im=Image.new('RGB',(W,H),bg);d=ImageDraw.Draw(im)
 # Brand rail: asymmetric; meaningful progress instead of endless decoration.
 d.rectangle((0,0,18,H),fill=AMBER)
 if logo:im.paste(logo,(80,210),logo)
 d.text((154,225),'EDevsHub',font=font(30),fill=ink)
 d.text((80,305),series.upper()[:42],font=font(22,True),fill=muted)
 d.line((80,355,970,355),fill=muted,width=1)
 ease=1-(1-min(1,t/.45))**3
 textblock(d,scene['title'],(80,415+int((1-ease)*35)),82,ink,width=880,max_lines=3)
 kind=scene.get('kind','question');labels=scene.get('labels') or ['Pedido recebido','Ação executada','Resultado confirmado']
 progress=min(1,t/max(duration-.5,.1)); y0=810
 if kind in ('pipeline','checklist'):
  rowgap=min(145,500/max(1,len(labels)))
  for n,label in enumerate(labels):
   y=y0+n*rowgap;active=progress>n/max(len(labels),1)*.65
   if n<len(labels)-1:d.line((116,y+64,116,y+rowgap),fill=muted,width=3)
   d.ellipse((89,y+26,143,y+80),fill=AMBER if active else muted)
   d.text((105,y+33),str(n+1),font=font(28,True),fill=GREEN)
   textblock(d,label,(175,y+28),38,ink,width=750,max_lines=2)
 elif kind=='terminal':
  d.rounded_rectangle((80,800,970,1270),radius=20,fill='#172824',outline='#40554C',width=2)
  d.text((115,830),'EXEMPLO / EXECUÇÃO',font=font(22,True),fill=MUTED)
  d.line((110,880,940,880),fill='#40554C',width=1)
  for n,label in enumerate(labels):
   reveal=max(0,min(1,(t-n*1.1-.3)/1.1))
   textblock(d,label[:int(len(label)*reveal)],(115,925+n*86),31,AMBER if n==len(labels)-1 else IVORY,width=810,max_lines=2,mono=True)
 elif kind=='compare':
  for n,label in enumerate(labels[:2]):
   y=810+n*265
   d.rounded_rectangle((80,y,970,y+220),radius=15,fill=GREEN if n else '#D3D9D1')
   d.text((115,y+25),'01 / ANTES' if not n else '02 / DEPOIS',font=font(23,True),fill=GREEN if not n else AMBER)
   textblock(d,label,(115,y+80),48,GREEN if not n else IVORY,width=810,max_lines=2)
 else:
  center=(525,1025);radius=165
  d.arc((center[0]-radius,center[1]-radius,center[0]+radius,center[1]+radius),-90,-90+max(1,progress*355),fill=AMBER,width=8)
  d.ellipse((center[0]-113,center[1]-113,center[0]+113,center[1]+113),outline=muted,width=2)
  symbol='?' if kind=='question' else '→'
  d.text((center[0]-35,center[1]-70),symbol,font=font(100),fill=ink)
  textblock(d,labels[0],(105,1250),37,ink,width=850,max_lines=2)
 # Narration captions stay above Instagram's caption/action overlay area.
 current=next((c for c in subtitles if c['start']<=t<max(c['end']+.12,c['start']+.25)),None)
 if current:
  ls=lines(current['text'],42,820)
  if len(ls)>3:raise ValueError('caption_overflow')
  boxheight=len(ls)*52+40
  d.rounded_rectangle((80,1450,970,1450+boxheight),radius=14,fill=GREEN if light else '#22392F')
  for n,line in enumerate(ls):d.text((110,1470+n*52),line,font=font(42),fill=IVORY)
 note=scene.get('note','DEMONSTRAÇÃO ILUSTRATIVA')
 d.text((80,1690),note[:60],font=font(19,True),fill=muted)
 for n in range(total):
  x=80+n*(890/total);d.rectangle((x,1755,x+890/total-10,1760),fill=AMBER if n<=index else muted)
 return im

async def render(input_file,root):
 data=json.loads(pathlib.Path(input_file).read_text(encoding='utf-8-sig'));scenes=validate_script(data)
 root=pathlib.Path(root).resolve();base=(REPO/'output/conteudo').resolve()
 if not root.is_relative_to(base):raise ValueError('invalid_output_path')
 root.mkdir(parents=True,exist_ok=True);out=root/'resultados';out.mkdir(exist_ok=True);(out/'estatico').mkdir(exist_ok=True);audio=root/'audio';audio.mkdir(exist_ok=True)
 seed=int(hashlib.sha256(json.dumps(data,sort_keys=True).encode()).hexdigest()[:8],16)
 series=data.get('brief',{}).get('vertical',{}).get('series','IA aplicada / na prática')
 logo_path=REPO/'public/content-studio/brand-mark.png'
 logo=None
 if logo_path.exists():logo=Image.open(logo_path).convert('RGBA').resize((60,60),Image.Resampling.LANCZOS)
 durations=[];captions=[];voiced=[]
 for i,scene in enumerate(scenes):
  mp3=audio/f'voice-{i+1:02}.mp3';words=await speech(scene,mp3)
  wav=audio/f'voice-{i+1:02}.wav'
  subprocess.run(['ffmpeg','-y','-v','error','-i',str(mp3),'-ar',str(SR),'-ac','1',str(wav)],check=True,creationflags=0x08000000 if sys.platform=='win32' else 0)
  _,samples=wavfile.read(wav);samples=samples.astype(float)/32768
  duration=math.ceil((len(samples)/SR+.5)*FPS)/FPS
  durations.append(duration);voiced.append(samples);captions.append(subtitle_groups(words))
 duration=sum(durations);maximum=60 if data['format']=='story' else 90
 if not 3<=duration<=maximum:raise ValueError(f'voice_duration_exceeds_{maximum}_seconds')
 mix=np.zeros(round(duration*SR));cursor=0
 # Original restrained bed, distinct harmonic register per script. No commercial music.
 tim=np.arange(len(mix))/SR;root_hz=[110,123.47,130.81,146.83][seed%4]
 for ratio in [1,1.5,2]:mix+=.009*np.sin(2*np.pi*root_hz*ratio*tim)*(.7+.3*np.sin(2*np.pi*.12*tim))
 for i,(scene,samples,seconds) in enumerate(zip(scenes,voiced,durations)):
  start=round(cursor*SR);mix[start:start+len(samples)]+=samples*.9
  events=[(.1,'sweep',.12)]
  if scene.get('kind')=='terminal':events +=[(.4+k*.14,'key',.35) for k in range(min(18,int(seconds/.14)))]
  elif scene.get('kind') in ('pipeline','checklist'):events +=[(seconds*j/3,'click',.22) for j in (1,2)]
  elif scene.get('kind')=='closing':events +=[(.8,'success',.15)]
  else:events +=[(.5,'pop',.20)]
  for at,family,gain in events:
   sound=synthesize(family,(seed+i)%3)*gain;pos=start+round(at*SR);end=min(len(mix),pos+len(sound))
   if end>pos:mix[pos:end]+=sound[:end-pos]
  cursor+=seconds
 fade=np.minimum(tim/.08,1)*np.minimum((duration-tim)/.35,1);mix*=fade
 peak=float(np.max(np.abs(mix)))
 if peak>.96:mix*=.96/peak
 wavfile.write(audio/'mix.wav',SR,(mix*32767).astype(np.int16))
 target=out/'slide-01.mp4';partial=out/'vertical.partial.mp4'
 args=['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','pipe:0','-i',str(audio/'mix.wav'),'-map','0:v','-map','1:a','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-threads','4','-c:a','aac','-b:a','128k','-ar','48000','-af','loudnorm=I=-16:TP=-1.5:LRA=9','-t',str(duration),'-movflags','+faststart',str(partial)]
 screenshots=[]
 with (root/'render-errors.log').open('wb') as errors:
  proc=subprocess.Popen(args,stdin=subprocess.PIPE,stderr=errors,creationflags=0x08000000 if sys.platform=='win32' else 0)
  try:
   for i,(scene,seconds) in enumerate(zip(scenes,durations)):
    still=frame(scene,i,len(scenes),min(1.8,seconds/2),seconds,captions[i],series,seed,logo)
    still.save(out/f'scene-{i+1:02}.jpg',quality=88);screenshots.append(still.resize((270,480)))
    if i==0:still.save(out/'estatico/slide-01.png')
    for n in range(round(seconds*FPS)):
     im=frame(scene,i,len(scenes),n/FPS,seconds,captions[i],series,seed,logo);proc.stdin.write(im.tobytes())
    print(f'Scene {i+1}/{len(scenes)} rendered',flush=True)
   proc.stdin.close()
   if proc.wait(timeout=120)!=0:raise RuntimeError('ffmpeg_failed')
  finally:
   if proc.poll() is None:proc.kill();proc.wait()
 partial.replace(target)
 sheet=Image.new('RGB',(270*len(screenshots),480))
 for i,im in enumerate(screenshots):sheet.paste(im,(i*270,0))
 sheet.save(out/'review.jpg',quality=90)
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(target)]))
 v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
 if v['width']!=W or v['height']!=H or v['codec_name']!='h264' or a['codec_name']!='aac':raise ValueError('invalid_encoded_media')
 qa={'format':data['format'],'width':W,'height':H,'duration':float(probe['format']['duration']),'codec':'h264','audio':'aac','qa':'vertical-layout-audio-passed','scenes':len(scenes),'voice':'pt-BR-AntonioNeural','voice_provider':'Edge online TTS via edge-tts 7.3.1','subtitles':'word-boundary groups','soundtrack':'EDevsHub original procedural','audio_review_required':True,'visual_review_required':True}
 (out/'qa.json').write_text(json.dumps(qa,indent=2),encoding='utf-8')
 print(json.dumps(qa),flush=True)
if __name__=='__main__':asyncio.run(render(sys.argv[1],sys.argv[2]))
