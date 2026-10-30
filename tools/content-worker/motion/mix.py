"""Mixagem do motor de motion: trilha + voz + efeitos, com ducking sob a voz e loudness único.

Entrada: JSON com duration, out, music{file,offset,gain_db,duck_db}, voice{file,at}|null, sfx_dir, sfx[{t,sfx,gain}], seed.
Saída: WAV estéreo 48 kHz normalizado em duas passadas (-14 LUFS integrado, pico real -1,5 dBTP) e medição impressa em JSON.
Cada efeito ganha uma variação pequena de altura, volume e posição (semente por post), para não soar idêntico entre vídeos.
"""
import json, pathlib, re, subprocess, sys
import numpy as np
from scipy.io import wavfile

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'scripts'))
from voice_ducking import narration_gain  # noqa: E402

SR = 48000
CREATION = 0x08000000 if sys.platform == 'win32' else 0


def run(args):
    return subprocess.run(args, capture_output=True, check=True, creationflags=CREATION)


def decode(path, channels):
    raw = run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', str(channels), '-ar', str(SR), '-f', 'f32le', 'pipe:1']).stdout
    a = np.frombuffer(raw, dtype='<f4').astype(np.float64)
    return a.reshape(-1, channels) if channels > 1 else a


def db(x):
    return 10 ** (x / 20)


def rms(a):
    a = a[np.abs(a) > 1e-4] if a.ndim == 1 else a[np.max(np.abs(a), axis=1) > 1e-4]
    return float(np.sqrt(np.mean(a * a))) if len(a) else 1e-6


def place(buf, snd, at, gain, pan=0.0):
    pos = round(at * SR)
    if pos >= len(buf):
        return
    if pos < 0:
        snd, pos = snd[-pos:], 0
    n = min(len(snd), len(buf) - pos)
    if snd.ndim == 1:
        snd = np.stack([snd * min(1, 1 - pan), snd * min(1, 1 + pan)], axis=-1)
    buf[pos:pos + n] += snd[:n] * gain


def loudnorm(src, dst, target, peak):
    first = run(['ffmpeg', '-hide_banner', '-i', str(src), '-af', f'loudnorm=I={target}:TP={peak}:LRA=11:print_format=json', '-f', 'null', '-']).stderr.decode('utf-8', 'ignore')
    m = json.loads(re.findall(r'\{[^{}]+\}', first)[-1])
    chain = (f"loudnorm=I={target}:TP={peak}:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
             f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,"
             f"alimiter=limit={db(peak - .3):.4f}:level=false")
    run(['ffmpeg', '-y', '-v', 'error', '-i', str(src), '-af', chain, '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s16le', str(dst)])
    final = run(['ffmpeg', '-hide_banner', '-i', str(dst), '-af', 'loudnorm=print_format=json', '-f', 'null', '-']).stderr.decode('utf-8', 'ignore')
    f = json.loads(re.findall(r'\{[^{}]+\}', final)[-1])
    return {'lufs': float(f['input_i']), 'true_peak': float(f['input_tp']), 'lra': float(f['input_lra'])}


def mix(spec):
    seconds = float(spec['duration'])
    n = round(seconds * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(int(spec.get('seed', 0)))
    out = np.zeros((n, 2))

    voice = None
    if spec.get('voice'):
        v = decode(spec['voice']['file'], 1)
        voice = np.zeros(n)
        at = round(float(spec['voice'].get('at', 0)) * SR)
        voice[at:at + len(v)] = v[:max(0, n - at)]
    ref = rms(voice) if voice is not None else None

    m = spec['music']
    music = decode(m['file'], 2)
    start = round(float(m.get('offset', 0)) * SR)
    seg = music[start:start + n]
    if len(seg) < n:  # trilha curta: completa repetindo com cruzamento de 1 s
        while len(seg) < n:
            seg = np.concatenate([seg, music[:n - len(seg)]])
    seg = seg[:n].copy()
    if ref is None:
        ref = rms(seg)
    seg *= ref / rms(seg) * db(float(m.get('gain_db', -8 if voice is not None else 0)))
    if voice is not None:
        seg *= narration_gain(voice, n, SR, float(m.get('duck_db', 8)))[:, None]
    fade_in = np.minimum(t / float(m.get('fade_in', .03)), 1)
    fade_out = np.minimum(np.maximum(seconds - t, 0) / float(m.get('fade_out', .6)), 1)
    seg *= (fade_in * fade_out)[:, None]
    out += seg

    fx = np.zeros((n, 2))
    lib = pathlib.Path(spec['sfx_dir'])
    cache = {}
    base = -11 if voice is not None else -5
    for c in spec.get('sfx', []):
        name = c['sfx']
        if name not in cache:
            source = lib / f'{name}-edit.wav'
            if not source.exists():  # biblioteca de efeitos fica fora do git; sem ela, segue só com trilha e voz
                continue
            cache[name] = decode(source, 1)
        s = cache[name]
        rate = float(rng.uniform(.94, 1.06))
        s = np.interp(np.arange(0, len(s) - 1, rate), np.arange(len(s)), s)
        gain = ref / max(rms(s), 1e-6) * db(base + float(c.get('gain', 0)) + float(rng.uniform(-1.5, 1.5)))
        place(fx, s, float(c['t']), gain, float(rng.uniform(-.3, .3)))
    if voice is not None:
        fx *= narration_gain(voice, n, SR, 5)[:, None]
        out += fx
        out += voice[:, None] * db(float(spec['voice'].get('gain_db', 0)))
    else:
        out += fx

    peak = np.max(np.abs(out))
    if peak > .95:
        out *= .95 / peak
    raw = pathlib.Path(spec['out']).with_suffix('.raw.wav')
    wavfile.write(raw, SR, out.astype(np.float32))
    result = loudnorm(raw, spec['out'], spec.get('target_lufs', -14), spec.get('true_peak', -1.5))
    raw.unlink()
    return result


if __name__ == '__main__':
    print(json.dumps(mix(json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8')))))
