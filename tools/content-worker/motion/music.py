"""Trilha original sintetizada (sem samples de terceiros): bateria, baixo, pads, arpejo/piano elétrico e sidechain.

Quatro estilos (pulse, warm, lofi, garage); tom, progressão, padrões e timbres variam pela semente do post,
então dois posts nunca saem com a mesma trilha. Uso: python music.py spec.json  (spec: style, seconds, seed, out)
"""
import json, pathlib, sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
CHORDS = {'m7': [0, 3, 7, 10], 'M7': [0, 4, 7, 11], 'add9': [0, 4, 7, 14], 'madd9': [0, 3, 7, 14], 'm9': [0, 3, 7, 10, 14],
          '9': [0, 4, 7, 10, 14], 'M9': [0, 4, 7, 11, 14], 'sus4': [0, 5, 7, 10]}
STYLES = {
    # bpm, progressões possíveis (grau, acorde), corte do pad, swing, padrões
    'pulse': {'bpm': (116, 122), 'prog': [[(0, 'madd9'), (8, 'M7'), (3, 'add9'), (10, 'add9')], [(0, 'm7'), (5, 'm7'), (8, 'M7'), (7, 'sus4')]], 'cut': 1700, 'swing': 0, 'kick': 'four', 'bass': 'off8', 'lead': 'arp16'},
    'warm': {'bpm': (100, 108), 'prog': [[(0, 'add9'), (9, 'm7'), (5, 'M7'), (7, 'sus4')], [(5, 'M7'), (7, 'add9'), (9, 'm7'), (0, 'add9')]], 'cut': 2300, 'swing': 0, 'kick': 'pop', 'bass': 'kick', 'lead': 'arp8'},
    'lofi': {'bpm': (86, 94), 'prog': [[(2, 'm9'), (7, '9'), (0, 'M9'), (9, 'm9')], [(0, 'M9'), (9, 'm9'), (2, 'm9'), (7, '9')]], 'cut': 1300, 'swing': .09, 'kick': 'lazy', 'bass': 'half', 'lead': 'ep'},
    'garage': {'bpm': (94, 100), 'prog': [[(0, 'm9'), (5, 'm7'), (8, 'M7'), (7, 'm7')], [(0, 'm7'), (3, 'M7'), (10, 'add9'), (5, 'm9')]], 'cut': 1900, 'swing': .07, 'kick': 'shuffle', 'bass': 'sync', 'lead': 'pluck'},
}


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def lp(x, fc, order=2):
    return sosfilt(butter(order, min(fc, SR * .45), fs=SR, output='sos'), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, btype='high', fs=SR, output='sos'), x)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], btype='band', fs=SR, output='sos'), x)


def saw(f, t, phase=0.0):
    return 2 * ((t * f + phase) % 1) - 1


def env(n, a, r, hold=None):
    t = np.arange(n) / SR
    e = np.minimum(t / max(a, 1e-4), 1)
    if hold is not None:
        e *= np.clip(1 - (t - hold) / r, 0, 1)
    return e


def add(buf, x, at, gain=1.0, pan=0.0):
    pos = int(round(at * SR))
    if pos >= len(buf) or pos < 0:
        return
    n = min(len(x), len(buf) - pos)
    if x.ndim == 1:
        x = np.stack([x * min(1, 1 - pan), x * min(1, 1 + pan)], -1)
    buf[pos:pos + n] += x[:n] * gain


def kick(rng):
    n = int(SR * .42); t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t / .035)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .28)
    click = hp(rng.normal(0, 1, n), 2500) * np.exp(-t / .004) * .25
    return np.tanh((body + click) * 1.6)


def snare(rng, clap=False):
    n = int(SR * .3); t = np.arange(n) / SR
    noise = bp(rng.normal(0, 1, n), 1200, 7000)
    if clap:
        e = sum(np.exp(-np.maximum(t - d, 0) / .012) * (t >= d) for d in (0, .011, .022)) / 2 + np.exp(-t / .12) * .6
        return noise * e
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t / .06)
    return noise * np.exp(-t / .13) * .8 + tone * .5


def hat(rng, open_=False):
    n = int(SR * (.22 if open_ else .06)); t = np.arange(n) / SR
    return hp(rng.normal(0, 1, n), 7500) * np.exp(-t / (.08 if open_ else .018))


def pad(notes, dur, cut, rng):
    n = int(SR * (dur + .7)); t = np.arange(n) / SR
    out = np.zeros((n, 2))
    e = env(n, .22, .7, dur)
    for m in notes:
        for ch, cents in ((0, (-9, 0)), (1, (0, 9))):
            for c in cents:
                out[:, ch] += saw(hz(m) * 2 ** (c / 1200), t, rng.random()) * e
    for ch in range(2):
        out[:, ch] = lp(out[:, ch], cut, 2)
    return out / (len(notes) * 2)


def bass_note(m, dur, cut):
    n = int(SR * (dur + .05)); t = np.arange(n) / SR
    f = hz(m)
    x = .6 * saw(f, t) + .8 * np.sin(2 * np.pi * f * t)
    x = lp(x, cut, 2) * env(n, .004, .05, dur) * np.exp(-t / max(dur * 1.4, .12))
    return np.tanh(x * 1.4)


def pluck(m, dur, rng, bright=3200):
    n = int(SR * (dur + .25)); t = np.arange(n) / SR
    f = hz(m)
    x = .55 * saw(f, t) + .45 * np.sign(np.sin(2 * np.pi * f * t))
    return lp(x, bright, 2) * np.exp(-t / .16) * np.minimum(t / .002, 1)


def epiano(notes, dur):
    n = int(SR * (dur + .9)); t = np.arange(n) / SR
    x = np.zeros(n)
    for m in notes:
        f = hz(m)
        x += (np.sin(2 * np.pi * f * t) + .28 * np.sin(4 * np.pi * f * t) + .12 * np.sin(6 * np.pi * f * t) * np.exp(-t / .08)) * np.exp(-t / 1.1)
    x *= env(n, .006, .6, dur) * (1 + .12 * np.sin(2 * np.pi * 4.2 * t))
    return lp(x / len(notes), 3500)


def echo(x, delay, fb=.32, mix=.28):
    d = int(delay * SR)
    y = x.copy()
    for k in range(1, 5):
        g = mix * fb ** (k - 1)
        y[d * k:] += x[:-d * k] * g if d * k < len(x) else 0
    return y


def compose(style, seconds, seed):
    st = STYLES[style]
    rng = np.random.default_rng(seed)
    bpm = float(rng.integers(st['bpm'][0], st['bpm'][1] + 1))
    beat = 60 / bpm; bar = beat * 4
    root = int(rng.choice([45, 46, 47, 48, 50, 52, 53]))  # Lá a Fá
    prog = st['prog'][int(rng.integers(len(st['prog'])))]
    shift = int(rng.integers(len(prog))); prog = prog[shift:] + prog[:shift]
    n = int(SR * (seconds + 1)); buf = {k: np.zeros((n, 2)) for k in ('drums', 'bass', 'pad', 'lead')}
    kicks = []
    K, S, C, H, HO = kick(rng), snare(rng), snare(rng, True), hat(rng), hat(rng, True)
    sw = lambda b: b + (st['swing'] if (round(b * 2) % 2) else 0)  # atrasa as colcheias fracas
    bars = int(np.ceil(seconds / bar)) + 1
    for b in range(bars):
        t0 = b * bar
        deg, q = prog[b % len(prog)]
        notes = [root + 12 + deg + i for i in CHORDS[q]]
        # bateria
        kpat = {'four': [0, 1, 2, 3], 'pop': [0, 1.5, 2, 3.5] if b % 2 else [0, 2, 2.75], 'lazy': [0, 1.75, 2.5], 'shuffle': [0, 1.75, 2.75]}[st['kick']]
        for k in kpat:
            at = t0 + sw(k) * beat; kicks.append(at); add(buf['drums'], K, at, .95)
        for k in (1, 3):
            add(buf['drums'], C if style in ('warm', 'garage') else S, t0 + k * beat + (.012 if style == 'lofi' else 0), .5 if style != 'lofi' else .38)
        step = .25 if style == 'pulse' else .5
        for i, k in enumerate(np.arange(0, 4, step)):
            vel = [1, .45, .75, .45][i % 4] if step == .25 else [.85, .55][i % 2]
            add(buf['drums'], HO if (style == 'warm' and k % 1 == .5 and i % 4 == 3) else H, t0 + sw(k) * beat, .2 * vel, .25 if i % 2 else -.15)
        if b % 4 == 3 and style in ('pulse', 'garage'):
            for k in np.arange(3, 4, .125):
                add(buf['drums'], S, t0 + k * beat, .12 + .2 * (k - 3))
        # baixo
        bm = root - 12 + deg
        while bm > root - 1:
            bm -= 12
        bpat = {'off8': [(k + .5, .22) for k in range(4)], 'kick': [(k, .45) for k in kpat], 'half': [(0, 1.8), (2, 1.6)], 'sync': [(0, .6), (.75, .3), (2, .5), (2.75, .9)]}[st['bass']]
        for k, d in bpat:
            add(buf['bass'], bass_note(bm, d * beat, 420 if style != 'lofi' else 300), t0 + sw(k) * beat, .5)
        # pad
        add(buf['pad'], pad(notes, bar, st['cut'], rng), t0, .5)
        # voz principal
        if st['lead'] in ('arp16', 'arp8'):
            stp = .25 if st['lead'] == 'arp16' else .5
            order = [0, 1, 2, 3, 2, 1, 3, 2] if seed % 2 else [0, 2, 1, 3, 1, 2, 3, 1]
            for i, k in enumerate(np.arange(0, 4, stp)):
                m = notes[order[i % len(order)] % len(notes)] + 12
                add(buf['lead'], pluck(m, stp * beat, rng, 2600 if style == 'pulse' else 3400), t0 + k * beat, .22, -.35 if i % 2 else .35)
        elif st['lead'] == 'ep':
            for k, d in ((0, 1.4), (2.5, 1.2)):
                add(buf['lead'], epiano(notes, d * beat), t0 + sw(k) * beat, .55)
        else:
            for i, k in enumerate((.5, 1.75, 2.5, 3.5)):
                add(buf['lead'], pluck(notes[(i + b) % len(notes)] + 12, .4 * beat, rng, 2400), t0 + k * beat, .2, -.4 if i % 2 else .4)
    # sidechain: pads, baixo e voz principal respiram com o bumbo
    t = np.arange(n) / SR; duck = np.ones(n)
    for at in kicks:
        i = int(at * SR); m = min(n - i, int(SR * .3))
        if m > 0:
            duck[i:i + m] = np.minimum(duck[i:i + m], 1 - .55 * np.exp(-np.arange(m) / SR / .09))
    for k in ('bass', 'pad', 'lead'):
        buf[k] *= duck[:, None]
    lead = buf['lead']
    lead = np.stack([echo(lead[:, 0], beat * .75), echo(lead[:, 1], beat * .5)], -1)
    mixd = buf['drums'] * .9 + buf['bass'] * .85 + buf['pad'] * 1.1 + lead * .9
    if style == 'lofi':
        crackle = np.zeros(n); idx = rng.integers(0, n, int(seconds * 9)); crackle[idx] = rng.normal(0, .5, len(idx))
        mixd += lp(crackle + rng.normal(0, .004, n), 4000)[:, None] * .5
    for ch in range(2):
        mixd[:, ch] = hp(mixd[:, ch], 32)
    mixd = mixd / max(np.max(np.abs(mixd)), 1e-6) * 1.15  # só um toque de saturação nos picos
    mixd = np.tanh(mixd) / np.tanh(1.15)
    mixd = mixd[:int(SR * seconds)]
    return mixd / max(np.max(np.abs(mixd)), 1e-6) * .89, {'bpm': bpm, 'root_midi': root, 'progression': prog}


if __name__ == '__main__':
    spec = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
    audio, info = compose(spec['style'], float(spec['seconds']), int(spec['seed']))
    wavfile.write(spec['out'], SR, audio.astype(np.float32))
    print(json.dumps({'style': spec['style'], **info}))
