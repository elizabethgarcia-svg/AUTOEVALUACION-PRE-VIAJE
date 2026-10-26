# Música original para la muestra del video del jurado: swing de Halloween en Re menor (~155 BPM),
# sintetizada aquí mismo (libre de derechos), con efectos sincronizados a muestra.html y las voces de radio.
import json, numpy as np, soundfile as sf
from scipy.signal import lfilter, resample_poly

SR = 44100
TOTAL = 76.5
N = int((TOTAL + 1) * SR)
rng = np.random.default_rng(7)
BEAT = 0.3875  # 16 tiempos entre la entrada del swing (12.6) y el título (18.8)

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def tt(d): return np.arange(int(d * SR)) / SR

class Pista:
    def __init__(s): s.x = np.zeros((N, 2))
    def put(s, t, y, g=1.0, pan=0.0):
        i = int(t * SR)
        if i >= N or i < 0 or len(y) == 0: return
        y = y[: N - i] * g; a = (pan + 1) * np.pi / 4
        s.x[i:i + len(y), 0] += y * np.cos(a); s.x[i:i + len(y), 1] += y * np.sin(a)

def env(d, a=0.005, r=0.05):
    t = tt(d); e = np.ones_like(t); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e

def filtro(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    if lo: X *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: X *= 1 / np.sqrt(1 + (f / hi) ** 4)
    return np.fft.irfft(X, len(x))

def ruido(d): return rng.normal(0, 1, int(d * SR))

# ---------- instrumentos ----------
def piano(n, d=3.0, vel=1.0):
    t = tt(d); f0 = midi(n); y = np.zeros_like(t)
    for k in range(1, 11):
        fk = k * f0 * np.sqrt(1 + 0.0004 * k * k)
        if fk > 12000: break
        y += (1 / k ** 1.3) * np.sin(2 * np.pi * fk * t) * np.exp(-t * (0.9 + 0.55 * k) * (1 + n / 90))
    return y * env(d, 0.004, 0.4) * 0.22 * vel

def cuerdas(n, d, a=1.2, r=1.2):
    t = tt(d); f = midi(n); y = np.zeros_like(t)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * t)
    for det in (-0.006, 0, 0.0055):
        y += 2 * ((f * (1 + det) * np.cumsum(vib) / SR) % 1) - 1
    return filtro(y, hi=2400) * env(d, a, r) * 0.03

def cajita(n, d=2.0):
    t = tt(d); f = midi(n)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t * 2.6) + .25 * np.sin(2 * np.pi * 4.01 * f * t) * np.exp(-t * 9)
    return y * env(d, 0.001, 0.2) * 0.12

def bajo(n, d=0.5):  # contrabajo pulsado (Karplus-Strong + fundamental)
    f = midi(n); P = int(SR / f); x = np.zeros(int(d * SR))
    x[:P] = filtro(rng.normal(0, 1, P * 4), hi=1200)[:P]
    a = np.zeros(P + 2); a[0] = 1; a[P] = -0.4985; a[P + 1] = -0.4985
    y = lfilter([1.0], a, x); t = tt(d)
    y = filtro(y, hi=900) * 0.5 + np.sin(2 * np.pi * f * t) * np.exp(-t * 3.5) * 0.6
    return y * env(d, 0.004, 0.08) * 0.42

def bombo(d=0.4, g=1.0):
    t = tt(d); f = 46 + 90 * np.exp(-t * 32)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11) * 0.5 * g

def tarola(d=0.25):
    t = tt(d); return (filtro(ruido(d), lo=1500, hi=8000) * np.exp(-t * 22) * .5 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 35) * .5) * .3

def palmas(d=0.3):
    t = tt(d); y = np.zeros_like(t)
    for o in (0, .011, .023):
        i = int(o * SR); e = np.exp(-np.maximum(t - o, 0) * (60 if o < .02 else 16)); e[:i] = 0; y += e
    return filtro(ruido(d), lo=900, hi=5000) * y * .22

def ride(d=0.9):
    t = tt(d); y = np.zeros_like(t)
    for f in (3150, 4480, 5920, 7380, 8790, 10450): y += np.sin(2 * np.pi * f * t + rng.random() * 6) * np.exp(-t * 4.5)
    y = y / 6 + filtro(ruido(d), lo=7000) * np.exp(-t * 12) * .6
    return y * env(d, 0.001, .1) * .055

def charles(d=0.08):
    t = tt(d); return filtro(ruido(d), lo=7500) * np.exp(-t * 70) * .07

def platillo(d=2.6, g=1.0):
    t = tt(d); y = filtro(ruido(d), lo=2500) * np.exp(-t * 1.7)
    for f in (3300, 4700, 6100, 7900): y += np.sin(2 * np.pi * f * t + rng.random() * 6) * np.exp(-t * 2.2) * .2
    return y * env(d, 0.001, .4) * .13 * g

def organo(notas, d=0.2, g=1.0):
    t = tt(d); y = np.zeros_like(t); vib = 1 + .003 * np.sin(2 * np.pi * 6.3 * t)
    for n in notas:
        f = midi(n)
        for h, w in ((1, 1), (2, .8), (3, .5), (4, .35), (6, .2), (8, .14)):
            if f * h < 9000: y += w * np.sin(2 * np.pi * f * h * np.cumsum(vib) / SR)
    y[:120] += rng.normal(0, .6, 120)  # chasquido de tecla
    return y * env(d, 0.004, 0.05) * .028 * g

def xilo(n, d=0.7, g=1.0):
    t = tt(d); f = midi(n)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t * 6) + .35 * np.sin(2 * np.pi * 3.93 * f * t) * np.exp(-t * 20)
    y[:60] += rng.normal(0, .3, 60)
    return y * env(d, 0.001, .1) * .16 * g

def metales(notas, d=0.3, g=1.0, caida=False):
    t = tt(d); y = np.zeros_like(t)
    for n in notas:
        for det in (-.004, .004):
            fr = midi(n) * (1 + det) * (1 - (0.06 * np.clip((t - d * .55) / (d * .45), 0, 1) ** 2 if caida else 0))
            y += 2 * ((np.cumsum(fr) / SR) % 1) - 1
    y = filtro(y, hi=2600) * env(d, 0.02, d * .3)
    return np.tanh(y * .8) * .05 * g

def campana(n, d=4.0, g=1.0):
    t = tt(d); f = midi(n); y = np.zeros_like(t)
    for r, w, k in ((.5, .6, .6), (1, 1, 1), (1.19, .7, 1.3), (1.56, .5, 1.6), (2, .45, 2), (2.51, .3, 2.6), (3.01, .25, 3.2)):
        y += w * np.sin(2 * np.pi * f * r * t) * np.exp(-t * k)
    return y * env(d, 0.002, .5) * .06 * g

def timbal(n, d=1.5, g=1.0):
    t = tt(d); f = midi(n) * (1 + .03 * np.exp(-t * 20))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2) + filtro(ruido(d), hi=400) * np.exp(-t * 18) * .5) * .3 * g

def theremin(puntos, d):  # puntos: [(t, midi), ...] con deslizamiento
    t = tt(d); ts, ns = zip(*puntos); n = np.interp(t, ts, ns) + .28 * np.sin(2 * np.pi * 6 * t) * np.clip(t / .5, 0, 1)
    ph = np.cumsum(midi(69) * 2 ** ((n - 69) / 12)) / SR
    y = np.sin(2 * np.pi * ph) + .18 * np.sin(4 * np.pi * ph)
    return y * env(d, .25, .4) * .07

# ---------- efectos ----------
def boom(d=2.5, g=1.0):
    t = tt(d); f = 52 * np.exp(-t * .6) + 20
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2) + filtro(ruido(d), hi=260) * np.exp(-t * 6) * .8) * .55 * g

def zumbido(d, sube=True, g=1.0):  # whoosh: ruido que cambia de color
    t = tt(d); x = ruido(d); a = filtro(x, lo=150, hi=900); b = filtro(x, lo=1800, hi=9000)
    k = np.clip(t / d, 0, 1); k = k if sube else 1 - k
    camp = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return (a * (1 - k) + b * k) * camp * .18 * g

def subida(d, g=1.0):  # riser
    t = tt(d); k = t / d; f = 180 * 2 ** (k * 3.2)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * .5 + filtro(ruido(d), lo=2000) * .6 * k
    return y * k ** 2 * .14 * g

def ping(f=1300, d=1.6, g=1.0):
    t = tt(d); y = np.zeros_like(t)
    for j, o in enumerate((0, .28, .56)):
        e = np.exp(-np.maximum(t - o, 0) * 7) * (t >= o); y += np.sin(2 * np.pi * f * t) * e * (.55 ** j)
    return y * .07 * g

def beep(f, d=0.1, g=1.0): return np.sin(2 * np.pi * f * tt(d)) * env(d, .004, .02) * .06 * g

def estatica(d, g=1.0):
    x = filtro(ruido(d), lo=1200, hi=6000); x *= 0.5 + 1.5 * (rng.random(len(x)) > 0.997)
    t = tt(d); return x * np.clip(np.minimum(t / .12, (d - t) / .2), 0, 1) * 0.035 * g

def sello(g=1.0):
    t = tt(.5); return (bombo(.5, 1.2) + filtro(ruido(.5), lo=600, hi=3500) * np.exp(-t * 35) * .25) * g

def obturador(g=1.0):
    y = np.zeros(int(.2 * SR))
    for o in (0, .07):
        i = int(o * SR); n = int(.025 * SR); y[i:i + n] += filtro(ruido(.025), lo=2000) * np.exp(-np.arange(n) / SR * 160)
    return y * .25 * g

def tecla(): t = tt(.04); return filtro(ruido(.04), lo=1500) * np.exp(-t * 150) * .08

def grillos(d):
    t = tt(d); y = np.zeros_like(t)
    for f0, r in ((4300, 7.1), (4700, 5.3), (5100, 6.4)):
        y += np.sin(2 * np.pi * f0 * t) * (np.sin(2 * np.pi * r * t) > .6) * (.5 + .5 * np.sin(2 * np.pi * 47 * t))
    return filtro(y, lo=3000) * env(d, .3, .3) * .01

def viento(d):
    t = tt(d); x = filtro(ruido(d), lo=200, hi=900)
    return x * (.6 + .4 * np.sin(2 * np.pi * .35 * t)) * env(d, .5, .6) * .05

mus, sfx, voz = Pista(), Pista(), Pista()

# ---------- armonía y tema ----------
CH = {'Dm': (38, 'm', [62, 65, 69]), 'Gm': (43, 'm', [58, 62, 67]), 'A7': (45, '7', [61, 64, 67, 69]), 'Bb7': (46, '7', [58, 62, 65, 68])}
TEMA = {'A': ['Dm', 'Gm', 'A7', 'Dm'], 'B': ['Dm', 'Bb7', 'A7', 'Dm']}
MEL = {
    'A': [(0, 69, .5), (.67, 74, .33), (1, 77, .5), (1.67, 76, .33), (2, 74, 1), (3, 73, .5), (3.67, 74, .33),
          (4, 79, .5), (4.67, 77, .33), (5, 74, .5), (5.67, 70, .33), (6, 74, 1.5), (7.67, 77, .33),
          (8, 76, .5), (8.67, 73, .33), (9, 69, .5), (9.67, 73, .33), (10, 76, .5), (10.67, 79, .33), (11, 77, .5), (11.67, 76, .33),
          (12, 74, 1.5), (13.67, 69, .33), (14, 74, .5), (15, 62, .3)],
    'B': [(0, 69, .5), (.67, 74, .33), (1, 77, .5), (1.67, 76, .33), (2, 74, 1), (3, 73, .5), (3.67, 74, .33),
          (4, 77, .5), (4.67, 74, .33), (5, 70, .5), (5.67, 68, .33), (6, 70, 1), (7, 72, .5), (7.67, 73, .33),
          (8, 76, 1), (9, 79, .5), (9.67, 76, .33), (10, 73, 1), (11, 69, 1),
          (12, 74, .5), (12.67, 77, .33), (13, 81, 1), (14, 86, .5), (15, 74, .5)],
}

def compas(t0, ch, sig, nivel, mel=None, barra=0, relleno=False):
    """Un compás de swing: bajo caminando, batería, órgano y melodía opcional."""
    raiz, q, voc = CH[ch]; tercera = 3 if q == 'm' else 4
    sig_r = CH[sig][0]
    g = {'full': 1.0, 'med': .75, 'soft': .62, 'bajo': .45}[nivel]
    for k, n in enumerate([raiz, raiz + tercera, raiz + 7, sig_r - 1 if sig_r - 1 > raiz + 2 else sig_r + 1]):
        mus.put(t0 + k * BEAT, bajo(n, BEAT * 1.05), g * (1.1 if k == 0 else .95))
    if nivel == 'bajo': return
    for b in (0, 1, 1.67, 2, 3, 3.67): mus.put(t0 + b * BEAT, ride(), g * (1 if b % 1 == 0 else .7), .35)
    for b in (1, 3): mus.put(t0 + b * BEAT, charles(), g, .25)
    if nivel in ('full', 'med'):
        for b in range(4): mus.put(t0 + b * BEAT, bombo(), g * (.75 if b == 0 else .45))
        for b in (1, 3): mus.put(t0 + b * BEAT, palmas(), g, -.1); mus.put(t0 + b * BEAT, tarola(), g * .5)
    for b in (1, 3): mus.put(t0 + b * BEAT, organo(voc, .2), g, -.35)
    if nivel == 'full': mus.put(t0 + 3.67 * BEAT, organo(voc, .14), g * .7, -.35)
    if relleno and nivel != 'soft':
        for b in (3, 3.33, 3.67): mus.put(t0 + b * BEAT, tarola(), g * .9)
    if mel:
        for b, n, d in MEL[mel]:
            if barra * 4 <= b < barra * 4 + 4:
                tb = t0 + (b - barra * 4) * BEAT
                mus.put(tb, xilo(n, max(.4, d * BEAT * 1.6)), g * 1.0, .15)
                mus.put(tb, organo([n - 12], d * BEAT * .9), g * .5, -.2)

def tramo(ancla, plan):
    """plan: lista de (compás, tema, nivel, con_melodía); los compases van seguidos desde 'ancla'."""
    for i, (c, tema, nivel, m) in enumerate(plan):
        seq = TEMA[tema]; barra = c % 4
        compas(ancla + c * 4 * BEAT, seq[barra], seq[(barra + 1) % 4], nivel, tema if m else None, barra, relleno=(barra == 3))

def shout(t0, tema, barra, g=1.0):  # metales doblando la melodía (coro final)
    for b, n, d in MEL[tema]:
        if barra * 4 <= b < barra * 4 + 4:
            mus.put(t0 + (b - barra * 4) * BEAT, metales([n - 12, n - 5], max(.15, d * BEAT * .95)), g, 0)

def golpe_final(t, g=1.0):
    mus.put(t, organo([38, 50, 62, 65, 69, 74], 2.6), 1.6 * g); mus.put(t, metales([50, 57, 62, 65, 69], 1.4, caida=True), 1.6 * g)
    mus.put(t, bajo(38, 1.8), 1.3 * g); mus.put(t, timbal(38, 2.5), 1.2 * g); mus.put(t, platillo(3.5), 1.3 * g); mus.put(t, bombo(.6), 1.2 * g)

# ---------- A · espacio (0–8.6) ----------
for n in (38, 45, 50, 53): mus.put(0, cuerdas(n, 9.0, 3.0, 1.0), .9, (n - 45) / 20)
mus.put(0, np.sin(2 * np.pi * midi(26) * tt(9)) * env(9, 2.5, .8) * .09)
for k in range(30): mus.put(rng.uniform(.3, 8.2), cajita(rng.choice([81, 84, 86, 88, 93]), 1.6), .35, rng.uniform(-.8, .8))
for tp in (0.6, 2.6): sfx.put(tp, ping(1250), .8, -.2)
for k in range(8): sfx.put(3.2 + k * .12, beep(900 + k * 90, .05), .8)
sfx.put(4.2, beep(1760, .09), 1.0); sfx.put(4.32, beep(1760, .18), 1.0); sfx.put(4.4, beep(2300, .05), .6, .5)
sfx.put(5.9, subida(2.7), 1.0); sfx.put(7.6, zumbido(1.0), 1.3)
sfx.put(8.6, boom(3.0), 1.0); sfx.put(8.6, platillo(2.0), .6)

# ---------- B · patio (8.6–12.6): tensión con pizzicato ----------
for k in range(-21, 0):
    tb = 12.6 + k * BEAT / 2
    if tb < 8.65: continue
    mus.put(tb, xilo(50 if k % 2 else 57, .25), .55, .2); mus.put(tb, bajo(38, BEAT * .5), .45)
for n in (50, 57, 62): mus.put(8.6, cuerdas(n, 4.2, 2.5, .4), 1.1)
for k in range(4): sfx.put(9.6 + k * .09, beep(1500, .05), .9)
sfx.put(9.98, beep(2000, .22), 1.0)
sfx.put(11.05, zumbido(.4), 1.2); sfx.put(11.3, boom(1.2), .5); sfx.put(11.3, grillos(1.4), 1.0)
for k in range(10): mus.put(11.6 + k * .1, timbal(38, .4), .25 + k * .07)
sfx.put(12.2, zumbido(.45), 1.4)

# ---------- C · el swing arranca, se corta para el reflector y regresa en el título ----------
mus.put(12.6, platillo(2.4), 1.0); mus.put(12.6, campana(62, 4.0), 1.0, -.3); mus.put(12.6 + 2 * BEAT, campana(69, 3.0), .8, .3)
tramo(12.6, [(0, 'A', 'full', True)])
compas(12.6 + 4 * BEAT, 'Gm', 'A7', 'full', None, 1)  # hasta el tiempo 6 y corte
mus.x[int((12.6 + 6 * BEAT) * SR):int(15.0 * SR)] *= 0  # silencio seco tras el corte
mus.put(12.6 + 6 * BEAT, organo([50, 62, 65, 69], .35), 1.4); mus.put(12.6 + 6 * BEAT, metales([62, 65, 69], .3), 1.2); mus.put(12.6 + 6 * BEAT, bombo(), 1)
sfx.put(15.0, viento(4.0), 1.0)
mus.put(15.0, np.sin(2 * np.pi * midi(26) * tt(4)) * env(4, .6, .4) * .1)
mus.put(15.1, theremin([(0, 62), (.5, 62), (.9, 69), (1.5, 69), (1.8, 65), (2.6, 65), (3.0, 74), (3.7, 73)], 3.7), 1.0, .1)
sfx.put(16.0, boom(2.2), .9); sfx.put(16.0, platillo(2.2), .7); sfx.put(16.0, campana(74, 2.5), .7)
sfx.put(16.5, ping(980, 1.4), 1.0); sfx.put(16.5, subida(.6), .3)
for i, n in enumerate([62, 65, 69, 74, 77, 81, 86, 89, 93]): mus.put(17.0 + i * .17, cajita(n, 1.5), 1.1, -.6 + i * .15)
for k in range(28): mus.put(17.62 + k * (1.18 / 28), tarola(.15), .2 + .6 * k / 28)
sfx.put(17.8, subida(1.0), .9)
golpe_final(18.8, .9); mus.put(18.8, campana(50, 4), 1.2)

# ---------- swing principal (18.8–52.9) ----------
plan1 = ([(c, 'A', 'full', True) for c in range(0, 2)] + [(c, 'B', 'med', False) for c in range(2, 6)] +
         [(c, 'B', 'full', True) for c in range(6, 8)] + [(c, 'A', 'med', False) for c in range(8, 10)] +
         [(c, 'A' if c < 12 else 'B', 'full', True) for c in range(10, 16)] + [(16, 'A', 'med', False)] +
         [(c, 'A', 'soft', True) for c in range(17, 19)] + [(19, 'A', 'soft', False), (20, 'A', 'bajo', False)])
tramo(18.8, plan1)
for c in (14, 15): shout(18.8 + c * 4 * BEAT, 'B', c % 4, 1.0)
for b in (0, 1): mus.put(18.8 + 21 * 4 * BEAT + b * BEAT, bajo([38, 45][b], BEAT), .3)

# ---------- piano con el 877 (52.2–58.0) ----------
for i, (r, ac, mel) in enumerate([(38, [50, 53, 57], [74, 77]), (34, [50, 53, 58], [77, 74]), (41, [53, 57, 60], [72, 69]), (45, [52, 55, 61], [73, 76])]):
    t0 = 52.2 + i * 1.45
    mus.put(t0, piano(r, 3.0, .8)); mus.put(t0, piano(r + 12, 3.0, .5))
    for k, n in enumerate(ac + [ac[1] + 12]): mus.put(t0 + .12 + k * .24, piano(n, 2.2, .6), 1, -.3 + k * .2)
    for k, n in enumerate(mel): mus.put(t0 + k * .72, piano(n, 2.4, .8), 1, .2)
    for n in ac: mus.put(t0, cuerdas(n, 1.9, .5, .7), 1.2)
sfx.put(55.6, boom(2.2), .35)
for k in range(6): sfx.put(55.6 + k * .4, campana(81 + (k % 3) * 4, 1.5), .25, -.5 + k * .2)
sfx.put(57.3, subida(.7), .9)
for k in range(8): mus.put(57.69 + k * BEAT / 4, tarola(.12), .3 + k * .07)

# ---------- swing de resultados y llegada (58.0–71.95) ----------
mus.put(58.0, platillo(2.0), 1.0)
plan2 = ([(0, 'B', 'med', False), (1, 'B', 'med', False)] + [(c, 'A', 'full', True) for c in range(2, 5)] +
         [(5, 'B', 'med', False), (6, 'B', 'med', False), (7, 'B', 'full', True), (8, 'B', 'full', True)])
tramo(58.0, plan2)
for c in (7, 8): shout(58.0 + c * 4 * BEAT, 'B', c % 4 + 2, 1.1)
golpe_final(58.0 + 36 * BEAT, 1.1)
tf = 58.0 + 36 * BEAT
for n in (50, 57, 62, 65): mus.put(tf, cuerdas(n, 4.6, .3, 2.0), 1.4)
for i, (b, n, d) in enumerate(MEL['A'][:8]): mus.put(tf + 1.4 + b * .42, cajita(n + 12, 2.0), .9, .2)
mus.put(tf + 1.0, campana(62, 4.5), .8, -.3)

# ---------- efectos de escena ----------
sfx.put(22.35, zumbido(.4), 1.0)
for i in range(5): sfx.put(23.2 + i * .5, beep(1300 + i * 120, .06), .8)
sfx.put(26.65, zumbido(.4, False), .9)
for k in range(26): sfx.put(27.1 + k * .066 + rng.uniform(0, .02), tecla(), 1.0, .2)
sfx.put(28.8, sello(), 1.3); sfx.put(29.5, platillo(1.6), .7)
mus.put(29.5, metales([62, 65, 69, 74], .35), 1.4)
sfx.put(30.3, zumbido(.4), .8)
for tp in (31.0, 44.0, 58.0): sfx.put(tp - .2, zumbido(.4), .9)
for tp in (34.6, 37.8): sfx.put(tp - .1, zumbido(.3), .9)
for tp in (37.15, 40.35): sfx.put(tp, obturador(), 1.2); mus.put(tp, metales([62, 69], .18), 1.1)
for i in range(4): sfx.put(41.0 + i * .18, beep(700 + i * 150, .06), .7)
for tp in (47.0, 49.6): sfx.put(tp - .1, zumbido(.35), .6)
sfx.put(52.2, beep(1050, .06), .5)
sfx.put(61.4, zumbido(1.3), 1.0)
for i in range(4): sfx.put(63.4 + .2 + (i + 1) * .3, campana(91, .8), .6, .3)
sfx.put(65.3, sello(), 1.3); sfx.put(65.3, platillo(1.6), .7)
sfx.put(65.85, zumbido(.4), .8)
sfx.put(67.6, boom(2.0), .8); sfx.put(67.6, platillo(2.0), .8)
sfx.put(69.3, zumbido(.4), .8); sfx.put(71.0, platillo(1.2), .6)
sfx.put(72.8, zumbido(.5, False), .5)

# ---------- voces de radio ----------
RADIO = [(1.0, 'r0'), (22.8, 'r1'), (31.4, 'r2'), (44.4, 'r3'), (58.4, 'r4'), (66.4, 'r5')]
DUCK = np.ones(N)
for t0, f in RADIO:
    v, sr = sf.read(f'aud/{f}.wav')
    if v.ndim > 1: v = v.mean(axis=1)
    if sr != SR: v = resample_poly(v, SR // 300, sr // 300)
    v = v / (np.max(np.abs(v)) + 1e-9) * .5
    voz.put(t0, v, 1.0, 0)
    d = len(v) / SR
    sfx.put(t0 - .3, estatica(d + .55), 1.0); sfx.put(t0 - .28, beep(1850, .09), .8)
    if f != 'r0': sfx.put(t0 + d + .05, beep(1850, .08), .7); sfx.put(t0 + d + .14, beep(1450, .1), .7)
    a, b = int((t0 - .15) * SR), int((t0 + d + .1) * SR); DUCK[a:b] = .38
w = int(.18 * SR); DUCK = np.convolve(DUCK, np.ones(w) / w, mode='same')

def reverb(x, dur=2.4, mezcla=0.28):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros_like(x)
    L = 1 << int(np.ceil(np.log2(len(x) + n)))
    for c in range(2):
        ir = rng.normal(0, 1, n) * np.exp(-t * 3.0); ir[0] = 0
        ir = filtro(ir, hi=5000); ir /= np.sqrt(np.sum(ir ** 2))
        y[:, c] = np.fft.irfft(np.fft.rfft(x[:, c], L) * np.fft.rfft(ir, L), L)[: len(x)]
    return x * (1 - mezcla) + y * mezcla

mr = reverb(mus.x, 2.4, .25); print('pico música', np.max(np.abs(mr)), np.percentile(np.abs(mr), 99.9))
m = np.tanh(mr / np.percentile(np.abs(mr), 99.9) * .9) * .6
s = reverb(sfx.x, 1.3, .22)
mezcla = m * DUCK[:, None] + s + reverb(voz.x, .6, .08) * 1.0
nf = int(TOTAL * SR); mezcla = mezcla[:nf]
ent = int(.4 * SR); mezcla[:ent] *= np.linspace(0, 1, ent)[:, None]
sal = int(2.0 * SR); mezcla[-sal:] *= (np.linspace(1, 0, sal) ** 1.6)[:, None]
mezcla = mezcla / np.max(np.abs(mezcla)) * .95
sf.write('mezcla_m.wav', mezcla.astype(np.float32), SR, subtype='FLOAT')
print('ok', nf / SR)
