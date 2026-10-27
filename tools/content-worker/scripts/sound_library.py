"""EDevsHub procedural SFX v1. Original synthesis; no third-party audio samples.
Twelve interaction families, three deterministic timbres each, 48 kHz mono.
"""
import json
import pathlib
import numpy as np
from scipy.signal import butter,sosfilt
from scipy.io import wavfile
SR=48000
FAMILIES=('click','key','pop','toggle','notification','success','card','paper','sweep','reverse','impact','sparkle')

def synthesize(family,variant=0):
 if family not in FAMILIES or variant not in (0,1,2):raise ValueError('Unknown sound')
 rng=np.random.default_rng(2710+FAMILIES.index(family)*17+variant)
 duration={'click':.10,'key':.16,'pop':.22,'toggle':.19,'notification':.55,'success':.8,'card':.35,'paper':.4,'sweep':.65,'reverse':.65,'impact':.55,'sparkle':.8}[family]
 t=np.arange(round(duration*SR))/SR;pitch=1+variant*.16;noise=rng.standard_normal(len(t))
 band=lambda x,lo,hi:sosfilt(butter(2,[lo,hi],fs=SR,btype='bandpass',output='sos'),x)
 if family in ('click','key','toggle'):
  f=(700 if family=='key' else 1200)*pitch
  x=(np.sin(2*np.pi*f*t)+.3*band(noise,1800,6500))*np.exp(-t/(.018+variant*.005))
  if family!='click':
   delay=int(.045*SR);x[delay:]+=.5*x[:-delay].copy()
 elif family=='pop':
  f=(750*np.exp(-t/.035)+180)*pitch;x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/.055)
 elif family in ('notification','success','sparkle'):
  x=np.zeros(len(t));notes=(1,1.25,1.5) if family=='success' else (1,1.5) if family=='notification' else (1,1.5,2,2.5)
  for i,note in enumerate(notes):
   u=t-i*.09;mask=u>=0;u=np.maximum(u,0);x+=mask*np.sin(2*np.pi*(520+variant*90)*note*u)*np.exp(-u/.16)*np.minimum(u/.004,1)
 elif family in ('card','paper'):
  x=band(noise,400+variant*300,4200+variant*900)*np.sin(np.pi*t/duration)**2
  if family=='paper':x*=.5+.5*np.sin(2*np.pi*37*t)**2
 elif family in ('sweep','reverse'):
  envelope=np.sin(np.pi*t/duration)**2
  x=band(noise,300+variant*250,2500+variant*1200)*envelope
  x+=.12*np.sin(2*np.pi*np.cumsum(200+1800*(t/duration)**2)/SR)*envelope
  if family=='reverse':x=x[::-1].copy()
 else:
  f=(50+90*np.exp(-t/.04))*pitch
  x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/.12)+.2*band(noise,600,2600)*np.exp(-t/.025)
 x*=np.minimum(t/.003,1)*np.minimum((duration-t)/.012,1)
 x-=np.mean(x);x*=np.minimum(t/.003,1)*np.minimum((duration-t)/.012,1)
 peak=np.max(np.abs(x));return x*(.42/max(peak,1e-9))

def catalog(destination):
 destination=pathlib.Path(destination);destination.mkdir(parents=True,exist_ok=True)
 items=[];demo=[]
 for family in FAMILIES:
  for variant in range(3):
   sound=synthesize(family,variant);name=f'{family}-{variant+1}.wav'
   wavfile.write(destination/name,SR,(sound*32767).astype(np.int16))
   items.append({'file':name,'family':family,'variant':variant,'origin':'EDevsHub procedural synthesis v1','third_party_samples':False,'sample_rate':SR})
   if variant==0:demo.extend([sound,np.zeros(int(.3*SR))])
 wavfile.write(destination/'demo.wav',SR,(np.concatenate(demo)*32767).astype(np.int16))
 (destination/'manifest.json').write_text(json.dumps(items,indent=2),encoding='utf-8')
if __name__=='__main__':
 import sys
 catalog(sys.argv[1])
