# Música de las tomas falsas: cumbia fiestera original (acordeón, güiro, cencerro, congas y bajo) en Sol mayor, 100 BPM,
# con los efectos de la cinta VHS y la toma trabada del 877. Sincronizada con tomas.html.
import numpy as np
base = open('musica_m.py').read().split('\n')
exec('\n'.join(base[:236]).replace('TOTAL = 76.5', 'TOTAL = 37.0'))  # instrumentos y efectos de musica_m.py

BC = 60 / 100
def acordeon(n, d, g=1.0):  # dos lengüetas desafinadas (musette) con trémolo
    t = tt(d); y = np.zeros_like(t)
    for det in (-.006, 0, .007):
        ph = midi(n) * (1 + det) * np.cumsum(1 + .002 * np.sin(2 * np.pi * 5.5 * t)) / SR
        y += (2 * (ph % 1) - 1) + .5 * np.sign(np.sin(2 * np.pi * ph))
    y = filtro(y, lo=250, hi=3800) * (1 + .12 * np.sin(2 * np.pi * 6 * t))
    return np.tanh(y * .5) * env(d, .015, .05) * .05 * g
def guiro(d, g=1.0):
    t = tt(d); return filtro(ruido(d), lo=2500, hi=9000) * (.55 + .45 * np.sign(np.sin(2 * np.pi * 70 * t))) * env(d, .005, .03) * .05 * g
def cencerro(g=1.0):
    d = .12; t = tt(d); return (np.sin(2 * np.pi * 562 * t) + .7 * np.sin(2 * np.pi * 845 * t)) * np.exp(-t * 32) * .05 * g
def conga(n, g=1.0):
    d = .22; t = tt(d); f = midi(n) * (1 + .3 * np.exp(-t * 40))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 16) * .22 * g
def rayon(g=1.0):  # scratch de disco
    d = .35; t = tt(d); f = 300 + 2200 * np.abs(np.sin(2 * np.pi * 3 * t))
    return filtro(ruido(d), lo=400, hi=6000) * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, .01, .08) * .3 * g
def boing(g=1.0):
    d = .5; t = tt(d); f = 180 + 420 * np.exp(-t * 6) * (1 + .3 * np.sin(2 * np.pi * 18 * t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5) * .14 * g
def pop(g=1.0):
    d = .1; t = tt(d); f = 900 * np.exp(-t * 30) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40) * .18 * g
def trombon_triste(g=1.0):  # wah, wah, wah, waaah
    y = []
    for n, d in ((58, .32), (57, .32), (56, .32), (55, 1.0)):
        t = tt(d); f = midi(n) * (1 - .03 * (t / d if d > .5 else 0)) * (1 + .01 * np.sin(2 * np.pi * 6 * t))
        ph = np.cumsum(f) / SR; s = (2 * (ph % 1) - 1)
        s = filtro(s, hi=1400) * (1 - np.cos(2 * np.pi * np.minimum(t / .3, 1))) * .5 * env(d, .02, .06)
        y.append(s)
    return np.concatenate(y) * .09 * g
def bocina_chica(g=1.0):  # ¡pip, pip!
    y = np.zeros(int(.5 * SR))
    for o in (0, .2):
        d = .14; t = tt(d); s = sum(2 * ((midi(n) * t) % 1) - 1 for n in (76, 80))
        i = int(o * SR); y[i:i + len(t)] += np.tanh(filtro(s, hi=3000) * env(d, .01, .03))
    return y * .07 * g
def volteo(g=1.0):
    y = np.zeros(int(.12 * SR))
    for o in (0, .05):
        i = int(o * SR); n = int(.03 * SR); y[i:i + n] += filtro(ruido(.03), lo=1200, hi=7000) * np.exp(-np.arange(n) / SR * 120)
    return y * .25 * g
def zumbido_cinta(d):  # motor de la videocasetera
    t = tt(d); return (np.sin(2 * np.pi * 60 * t) * .3 + filtro(ruido(d), lo=300, hi=1200) * .4) * env(d, .05, .1) * .04

# ---------- la cumbia ----------
PROG = ['G', 'C', 'D', 'G', 'G', 'C', 'D', 'G']
AC = {'G': (43, [67, 71, 74]), 'C': (48, [67, 72, 76]), 'D': (50, [66, 69, 74])}
MELO = [[74, 0, 71, 74, 79, 0, 78, 76], [76, 0, 72, 76, 79, 0, 76, 74], [74, 72, 71, 72, 74, 0, 78, 0], [79, 0, 74, 0, 71, 74, 79, 0],
        [74, 0, 71, 74, 79, 0, 81, 79], [76, 0, 79, 76, 72, 0, 76, 74], [74, 76, 78, 79, 81, 0, 78, 74], [79, 0, 0, 0, 67, 71, 74, 79]]
def cumbia(t0, t1, mel=True, g=1.0):
    bar = 0
    while True:
        tb = t0 + bar * 4 * BC
        if tb >= t1: break
        ch = PROG[bar % 8]; raiz, voc = AC[ch]
        for b, n in ((0, raiz), (2, raiz + 7), (3.5, raiz + 12 if ch != 'D' else raiz + 7)):
            if tb + b * BC < t1: mus.put(tb + b * BC, bajo(n, BC * .9), 1.1 * g)
        for b in range(4):
            tt0 = tb + b * BC
            if tt0 >= t1: break
            mus.put(tt0, guiro(BC * .42), g, .4); mus.put(tt0 + BC * .5, guiro(BC * .2), .8 * g, .4); mus.put(tt0 + BC * .75, guiro(BC * .2), .8 * g, .4)
            mus.put(tt0 + BC * .5, cencerro(), g, -.4)
            mus.put(tt0 + BC * .5, acordeon(voc[0], BC * .3) + acordeon(voc[1], BC * .3) + acordeon(voc[2], BC * .3), .55 * g, -.2)
            if b in (0, 2): mus.put(tt0, bombo(.3), .55 * g)
            if b in (1, 3): mus.put(tt0 + BC * .5, conga(62), .8 * g, .3); mus.put(tt0 + BC * .75, conga(57), .7 * g, .3)
        if mel:
            notas = MELO[bar % 8]
            for k, n in enumerate(notas):
                if not n: continue
                d = 1
                while k + d < 8 and notas[k + d] == 0: d += 1
                tn = tb + k * BC / 2
                if tn < t1: mus.put(tn, acordeon(n, d * BC / 2 * .95), 1.0 * g, .15)
        bar += 1

# 0–6.8: arranca la cinta y la cumbia
sfx.put(0, zumbido_cinta(2.4), 1.0); sfx.put(0.05, tecla(), 3.0); sfx.put(.15, estatica(.6), 1.2)
cumbia(0.4, 6.8)
sfx.put(2.85, filtro(ruido(.08), lo=900, hi=5000) * np.exp(-tt(.08) * 60) * .5 + bombo(.2, .6)[:int(.08 * SR)], 1.3)  # la claqueta
# 6.8: ¡CORTE! y rebobinado (la cumbia al revés y rapidísimo)
mus.x[int(6.8 * SR):] *= 0
sfx.put(6.8, rayon(), 1.2); sfx.put(6.85, sello(), 1.0)
seg = mus.x[int(3.4 * SR):int(6.8 * SR)][::-1]
idx = np.linspace(0, len(seg) - 1, int(1.0 * SR)).astype(int)
sfx.put(7.4, seg[idx].mean(axis=1) * .7, 1.0); sfx.put(7.4, estatica(1.0), 1.5)
# 8.4–23: sigue la fiesta
cumbia(8.4, 23.0)
sfx.put(9.4, boing(), 1.0)
for k in range(18): sfx.put(12.3 + k * .13, tecla(), .6, .2)
sfx.put(15.0, rayon(.7), 1.0); sfx.put(15.05, sello(), .9)
for k in range(24): sfx.put(16.0 + k * .125, beep(1800 + (k % 4) * 300, .04), .5, .5)  # cámara rápida
for tp in (19.5, 19.8, 20.6): sfx.put(tp, pop(), 1.0)
sfx.put(21.6, pop(), 1.0); sfx.put(21.65, trombon_triste(), 1.1)
# 23–27: la cinta del 877 se traba
mus.x[int(23.0 * SR):] *= 0
cumbia(23.0, 27.0, mel=False, g=.45)
hola, sr = sf.read('../bloopers/aud/hola.wav')
if sr != SR: hola = resample_poly(hola, SR // 100, sr // 100)
cut = lambda a, b: hola[int(a * SR):int(b * SR)]
pre, ho, todo = cut(0, .27), cut(.27, .72), cut(.27, 1.73)
voz.put(23.0, pre, 1.0); [voz.put(23.3 + i * .45, ho * np.linspace(1, .8, len(ho)), 1.0) for i in range(3)]
voz.put(24.65, todo, 1.0)
for i in range(3): sfx.put(23.3 + i * .45, estatica(.08), 2.0)
sfx.put(26.1, rayon(), 1.2); sfx.put(26.15, sello(), 1.0); sfx.put(26.25, boing(), .9)
# 27: STOP, la cumbia se frena como cinta y la tele se apaga
mus.x[int(26.1 * SR):] *= 0
sfx.put(27.0, tecla(), 3.0); sfx.put(27.4, filtro(ruido(.6), lo=3000) * np.exp(-tt(.6) * 8) * .15, 1.0)
sfx.put(27.4, np.sin(2 * np.pi * np.cumsum(15000 * np.exp(-tt(.6) * 3)) / SR) * np.exp(-tt(.6) * 6) * .03, 1.0)
# 29.2–35: después de los créditos, el 877
mus.put(29.2, np.sin(2 * np.pi * midi(31) * tt(5.8)) * env(5.8, .8, 1.2) * .06)
sfx.put(29.45, cajita(86, 1.5), .9); sfx.put(29.5, cajita(91, 1.5), .6)
cop, sr = sf.read('../bloopers/aud/copian.wav')
if sr != SR: cop = resample_poly(cop, SR // 100, sr // 100)
voz.put(30.2, cop * env(len(cop) / SR, .05, .2), 1.0)
sfx.put(31.4, volteo(.6), 1.0)  # parpadeo
sfx.put(32.3, bocina_chica(), 1.3)
sfx.put(33.0, campana(88, 1.2), .6)
# 35–37: tarjeta final con remate de cumbia
for k, n in enumerate((67, 71, 74, 79)): mus.put(35.0 + k * BC / 2, acordeon(n, BC * .45), 1.0)
mus.put(35.0 + 2 * BC, acordeon(67, 1.2) + acordeon(71, 1.2) + acordeon(74, 1.2) + acordeon(79, 1.2), .8); mus.put(35.0 + 2 * BC, cencerro(), 1.2); mus.put(35.0 + 2 * BC, bajo(43, 1.0), 1.2)

def reverb(x, dur=1.6, mezcla=.2):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros_like(x)
    L = 1 << int(np.ceil(np.log2(len(x) + n)))
    for c in range(2):
        ir = rng.normal(0, 1, n) * np.exp(-t * 4.0); ir[0] = 0; ir = filtro(ir, hi=5000); ir /= np.sqrt(np.sum(ir ** 2))
        y[:, c] = np.fft.irfft(np.fft.rfft(x[:, c], L) * np.fft.rfft(ir, L), L)[: len(x)]
    return x * (1 - mezcla) + y * mezcla
mr = reverb(mus.x, 1.4, .18); m = np.tanh(mr / (np.percentile(np.abs(mr), 99.9) + 1e-9) * .9) * .55
mezcla = m + reverb(sfx.x, 1.0, .15) + voz.x * 1.4
nf = int(TOTAL * SR); mezcla = mezcla[:nf]
mezcla[-int(.6 * SR):] *= np.linspace(1, 0, int(.6 * SR))[:, None]
mezcla = mezcla / np.max(np.abs(mezcla)) * .95
sf.write('mezcla_tomas.wav', mezcla.astype(np.float32), SR, subtype='FLOAT'); print('ok', nf / SR)
