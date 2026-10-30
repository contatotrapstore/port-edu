"""Offline gain control: voice remains untouched; only backing stems are reduced."""
import numpy as np

def narration_gain(voice,length,sample_rate=48000,attenuation_db=16):
 if length<0 or sample_rate<=0:raise ValueError('invalid_audio_shape')
 if length==0:return np.ones(0)
 signal=np.zeros(length);n=min(length,len(voice));signal[:n]=np.asarray(voice[:n],dtype=float)
 block=max(1,round(sample_rate*.01));count=(length+block-1)//block
 padded=np.pad(signal,(0,count*block-length)).reshape(count,block)
 rms=np.sqrt(np.mean(padded*padded,axis=1))
 active=rms>.006
 # 30 ms pre-roll protects consonants; 200 ms release avoids between-word pumping.
 held=np.zeros(count,dtype=bool)
 for index in np.flatnonzero(active):held[max(0,index-3):min(count,index+21)]=True
 floor=10**(-attenuation_db/20);levels=np.where(held,floor,1.)
 # Interpolate block levels for smooth transitions, without modifying voice samples.
 return np.interp(np.arange(length),np.arange(count)*block,levels)
