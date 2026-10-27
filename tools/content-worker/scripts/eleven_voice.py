"""ElevenLabs speech: explicit credentials, paid-plan check, provider-bound cache.
Only narration text is sent. No automatic retry of potentially billed requests.
"""
import base64,hashlib,json,os,urllib.request,urllib.error

def cache_key(text,voice,model):
 return hashlib.sha256(json.dumps(['elevenlabs',voice,model,text,.5,.75],ensure_ascii=False).encode()).hexdigest()

def alignment_words(a):
 chars=a.get('characters',[]);starts=a.get('character_start_times_seconds',[]);ends=a.get('character_end_times_seconds',[])
 if not chars or not len(chars)==len(starts)==len(ends):raise ValueError('missing_voice_alignment')
 words=[];text='';start=None;end=None
 for c,s,e in zip(chars,starts,ends):
  if not isinstance(s,(int,float)) or not isinstance(e,(int,float)) or s<0 or e<s:raise ValueError('invalid_voice_alignment')
  if c.isspace():
   if text:words.append({'text':text,'offset':round(start*1e7),'duration':round((end-start)*1e7)});text='';start=None
  else:
   if start is None:start=s
   text+=c;end=e
 if text:words.append({'text':text,'offset':round(start*1e7),'duration':round((end-start)*1e7)})
 if not words:raise ValueError('empty_voice_alignment')
 return words

def request(endpoint,payload=None):
 key=os.environ.get('ELEVENLABS_API_KEY')
 if not key:raise RuntimeError('elevenlabs_key_required')
 req=urllib.request.Request('https://api.elevenlabs.io'+endpoint,data=json.dumps(payload).encode() if payload is not None else None,headers={'xi-api-key':key,'Content-Type':'application/json'})
 try:
  with urllib.request.urlopen(req,timeout=90) as response:return json.load(response)
 except urllib.error.HTTPError as e:
  try:reason=json.loads(e.read()).get('detail',{}).get('status','request_failed')
  except Exception:reason='request_failed'
  raise RuntimeError('elevenlabs_'+str(e.code)+'_'+str(reason)) from None
 except Exception:raise RuntimeError('elevenlabs_request_uncertain_no_auto_retry') from None

_verified=False

def speech(scene,target):
 global _verified
 voice=os.environ.get('ELEVENLABS_VOICE_ID');model=os.environ.get('ELEVENLABS_MODEL_ID','eleven_v4')
 if not voice:raise RuntimeError('elevenlabs_voice_required')
 if not _verified:
  sub=request('/v1/user/subscription')
  if sub.get('tier') in (None,'free'):raise RuntimeError('elevenlabs_paid_plan_required')
  _verified=True
 signature=cache_key(scene['narration'],voice,model);meta=target.with_suffix('.json')
 if target.exists() and meta.exists():
  cached=json.loads(meta.read_text(encoding='utf-8'))
  if cached.get('hash')==signature and cached.get('commercial_plan_verified') is True:return cached['words']
 result=request('/v1/text-to-speech/'+voice+'/with-timestamps?output_format=mp3_44100_128',{'text':scene['narration'],'model_id':model,'voice_settings':{'stability':.5,'similarity_boost':.75}})
 # Save provider response locally before decoding so alignment failure cannot cause unnoticed rebilling.
 target.with_suffix('.response.json').write_text(json.dumps(result),encoding='utf-8')
 words=alignment_words(result.get('normalized_alignment') or result.get('alignment') or {})
 audio=base64.b64decode(result['audio_base64'],validate=True)
 if len(audio)<1000:raise ValueError('empty_voice_audio')
 target.write_bytes(audio)
 meta.write_text(json.dumps({'hash':signature,'words':words,'provider':'ElevenLabs','voice_id':voice,'model':model,'commercial_plan_verified':True}),encoding='utf-8')
 return words
