# Música de la muestra v2: mismos instrumentos que musica_m.py, arreglo nuevo para muestra2.html.
# Espacio y patio → swing → golpe con la Catrina → chispas del logo → swing en el título → acción en la lotería
# → swing en Trabajo en Equipo y Resultados → piano en Pasión y el puente → audio del 877 → swing final.
import numpy as np
base = open('musica_m.py').read().split('\n')
codigo = '\n'.join(base[:258]).replace('TOTAL = 76.5', 'TOTAL = 137.3')
exec(codigo)  # instrumentos, efectos, tema, compas(), tramo(), shout(), golpe_final(), espacio y patio (0–12.6)

# ---------- instrumentos y efectos extra ----------
def tom(n, d=.5, g=1.0):
    t = tt(d); f = midi(n) * (1 + .5 * np.exp(-t * 30))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) + filtro(ruido(d), hi=900) * np.exp(-t * 30) * .3) * .35 * g
def maraca(d=.06): t = tt(d); return filtro(ruido(d), lo=5000) * np.exp(-t * 60) * .05
def staccato(notas, d=.14, g=1.0):
    t = tt(d); y = np.zeros_like(t)
    for n in notas:
        for det in (-.005, .005): y += 2 * ((midi(n) * (1 + det) * t) % 1) - 1
    return filtro(y, hi=3000) * env(d, .006, .05) * .03 * g
def chisporroteo(d, g=1.0):  # fuego que truena
    x = np.zeros(int(d * SR))
    for k in range(int(d * 90)):
        i = rng.integers(0, len(x) - 900); n = rng.integers(80, 900)
        x[i:i + n] += filtro(rng.normal(0, 1, n), lo=1500, hi=9000) * np.exp(-np.arange(n) / n * 6) * rng.uniform(.2, 1)
    return x * env(d, .3, .4) * .12 * g
def silbido(d=.5, g=1.0):  # chispa que vuela
    t = tt(d); f = 3200 + 1800 * np.sin(np.pi * t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 2 * .02 * g
def zumbido_neon(d, g=1.0):
    t = tt(d); y = sum(np.sin(2 * np.pi * 120 * h * t) / h for h in (1, 2, 3, 5))
    return y * (1 + .3 * (rng.random(len(t)) > .995)) * env(d, .05, .2) * .02 * g
def carta(g=1.0):  # una carta que se desliza y cae
    d = .16; t = tt(d); return (filtro(ruido(d), lo=2500, hi=9000) * np.exp(-t * 28) * .2 + filtro(ruido(d), lo=300, hi=1500) * np.exp(-t * 60) * .1) * g
def volteo(g=1.0):
    y = np.zeros(int(.12 * SR))
    for o in (0, .05):
        i = int(o * SR); n = int(.03 * SR); y[i:i + n] += filtro(ruido(.03), lo=1200, hi=7000) * np.exp(-np.arange(n) / SR * 120)
    return y * .25 * g
def coro(notas, d, g=1.0):  # "aah" oscuro
    t = tt(d); y = np.zeros_like(t)
    for n in notas:
        for det in (-.004, 0, .004):
            ph = midi(n) * (1 + det) * np.cumsum(1 + .003 * np.sin(2 * np.pi * 5 * t)) / SR
            y += np.sin(2 * np.pi * ph) + .3 * np.sin(4 * np.pi * ph) + .15 * np.sin(6 * np.pi * ph)
    y = filtro(y, lo=200, hi=1800)
    return y * env(d, .8, 1.2) * .02 * g

# ---------- C1 · cabina (12.6–14.6): el swing arranca con campanas ----------
mus.put(12.6, platillo(2.4), 1.0); mus.put(12.6, campana(62, 4.0), 1.0, -.3); mus.put(12.6 + 2 * BEAT, campana(69, 3.0), .8, .3)
tramo(12.6, [(0, 'A', 'full', True)])
mus.x[int(14.55 * SR):int(19.6 * SR)] *= 0
sfx.put(14.2, subida(.4), .9)

# ---------- C2 · la Catrina (14.6–19.6) ----------
sfx.put(14.6, boom(3.0), 1.2); sfx.put(14.6, platillo(3.0), .8); mus.put(14.6, organo([26, 38, 50, 53, 57], 2.4), 1.2)
mus.put(14.6, coro([50, 53, 57, 62], 5.0), 1.3)
mus.put(14.6, np.sin(2 * np.pi * midi(26) * tt(5)) * env(5, .2, 1.0) * .12)
for k in range(5): mus.put(15.0 + k * .8, bombo(.6), .55)  # latido
mus.put(15.5, theremin([(0, 62), (.5, 62), (.9, 69), (1.4, 65), (1.9, 65), (2.3, 74), (3.0, 73)], 3.0), .9, .1)
sfx.put(15.5, ping(820, 1.5), .6)
sfx.put(16.9, chisporroteo(2.8), 1.3); sfx.put(17.0, zumbido(2.2), 1.0)
sfx.put(18.4, subida(1.2), .8)

# ---------- C3 · logo con chispas (19.6–23.4) ----------
for k in range(26): sfx.put(19.62 + rng.uniform(0, 1.3), silbido(rng.uniform(.25, .5)), rng.uniform(.5, 1.0), rng.uniform(-.8, .8))
sfx.put(19.6, chisporroteo(1.8), .8)
sfx.put(20.9, zumbido_neon(.8), 1.0)
mus.put(19.6, coro([50, 57, 62], 4.0), .8)
sfx.put(21.6, boom(2.6), 1.1); sfx.put(21.6, platillo(2.6), .9); sfx.put(21.6, campana(74, 3.0), .8)
for n in (50, 57, 62, 65): mus.put(21.7, cuerdas(n, 2.2, .3, .8), 1.4)
mus.put(21.7, metales([50, 57, 62], 1.6), .9)
sfx.put(22.9, subida(.55), .9)

# ---------- título y bitácora (23.45–33.6): swing ----------
golpe_final(23.45, 1.0); mus.put(23.45, campana(50, 4), 1.2)
plan1 = [(0, 'A', 'full', True), (1, 'A', 'full', True), (2, 'B', 'med', False), (3, 'B', 'med', False), (4, 'B', 'med', False),
         (5, 'B', 'full', True), (6, 'B', 'full', True)]
tramo(23.45, plan1)
sfx.put(26.2, zumbido(.4), 1.0)
for i in range(5): sfx.put(26.9 + i * .4, beep(1300 + i * 120, .06), .8)
sfx.put(29.45, zumbido(.4, False), .9)
for k in range(24): sfx.put(29.9 + k * .066 + rng.uniform(0, .02), tecla(), 1.0, .2)
sfx.put(31.6, sello(), 1.3); sfx.put(32.2, platillo(1.6), .7); mus.put(32.2, metales([62, 65, 69, 74], .35), 1.4)
mus.x[int(33.55 * SR):int(33.62 * SR)] *= np.linspace(1, .2, int(33.62 * SR) - int(33.55 * SR))[:, None]
sfx.put(33.3, zumbido(.4), 1.0)

# ---------- E · lotería (33.6–53.2): música de acción, 150 BPM ----------
BA = .4
TD = [39.0, 43.2, 47.4]
calma = lambda tb: any(d + .4 <= tb < d + 2.0 for d in TD)  # mientras la Base canta, baja la batería
ACORDES = [[62, 65, 69], [62, 65, 69], [58, 62, 65], [57, 61, 64]]
OST = [38, 38, 41, 38, 43, 38, 41, 40]
for bar in range(13):
    t0 = 33.6 + bar * 4 * BA
    if t0 >= 53.1: break
    ac = ACORDES[bar % 4]; raiz = {0: 38, 1: 38, 2: 34, 3: 33}[bar % 4]
    for e in range(8):
        tb = t0 + e * BA / 2
        if tb >= 53.15: break
        n = OST[e] + (raiz - 38)
        mus.put(tb, bajo(n, .2), .9 if e % 2 == 0 else .7)
        mus.put(tb, staccato(ac, .12), (.6 if calma(tb) else 1.0) * (1.2 if e % 2 else .9), -.3)
        for s16 in (0, BA / 4): mus.put(tb + s16, maraca(), .8, .4)
        if not calma(tb):
            if e in (0, 3, 4, 7) and tb >= 34.4: mus.put(tb, bombo(.4), .8)
            if e in (2, 6) and tb >= 34.4: mus.put(tb, palmas(), .9); mus.put(tb, tarola(), .6)
    if bar % 2 == 1 and t0 >= 34.4:
        for k, n in enumerate((45, 43, 41, 38)): mus.put(t0 + 3 * BA + k * BA / 4, tom(n), .8)
    if bar % 4 == 0 and t0 >= 36.0: mus.put(t0, metales([50, 57, 62], .3), 1.0)
mus.put(33.6, platillo(2.0), .8); mus.put(33.6, timbal(38, 1.2), 1.0)
for k in range(10): sfx.put(34.9 + k * .05, carta(.8), 1.0, (-1) ** k * .3)  # se barajean
for k in range(10): sfx.put(35.55 + k * .06, volteo(.5), 1.0)
for k in range(10): sfx.put(36.2 + k * .2, carta(1.0), 1.0, (k % 5 - 2) * .2)  # se reparten
mus.put(38.4, metales([62, 65, 69, 74], .5), 1.5); sfx.put(38.4, platillo(1.6), .8)
for d in TD:
    sfx.put(d, volteo(1.2), 1.0); sfx.put(d + .4, zumbido(.4), .9)
    mus.put(d + 1.3, metales([62, 69], .25), 1.3); mus.put(d + 1.3, timbal(38, .8), .9)
    sfx.put(d + 2.0, zumbido(.3), 1.0); sfx.put(d + 2.2, obturador(), 1.1)
for k in range(10): sfx.put(51.7 + k * .13, volteo(.8), 1.0, (k % 5 - 2) * .2)
sfx.put(52.4, subida(.8), .9)

# ---------- puntos de control 1 y 2 (53.2–69.0): swing ----------
golpe_final(53.2, .8)
plan2 = ([(0, 'A', 'med', False), (1, 'A', 'med', False)] + [(c, 'A' if c < 5 else 'B', 'full', True) for c in range(2, 5)]
         + [(5, 'B', 'med', False), (6, 'B', 'med', False)] + [(c, 'A', 'full', True) for c in range(7, 10)])
tramo(53.2, plan2)
for c in (3, 4): shout(53.2 + c * 4 * BEAT, 'A', c % 4, .9)
for tp in (53.0, 61.0): sfx.put(tp, zumbido(.4), .9)
sfx.put(56.1, zumbido(.3), .8); sfx.put(58.3, zumbido(.3), .8)
sfx.put(64.5, zumbido(1.3), 1.0)
for i in range(4): sfx.put(66.6 + (i + 1) * .3, campana(91, .8), .6, .3)
sfx.put(68.3, sello(), 1.3); sfx.put(68.3, platillo(1.6), .7)

# ---------- punto de control 3 · Pasión (69.0–81.2): swing suave que baja a piano ----------
t3 = 69.0
mus.put(t3, platillo(1.6), .6)
plan3 = [(0, 'B', 'soft', False), (1, 'B', 'soft', False), (2, 'A', 'soft', True), (3, 'A', 'soft', True), (4, 'A', 'soft', True), (5, 'A', 'bajo', False)]
tramo(t3, plan3)
sfx.put(68.8, zumbido(.4), .9); sfx.put(71.7, zumbido(.3), .6); sfx.put(73.9, zumbido(.3), .6)
for k in range(4): sfx.put(76.3 + k * .12, carta(.8), 1.0)
PIANO = [(38, [50, 53, 57], [74, 77]), (34, [50, 53, 58], [77, 74]), (41, [53, 57, 60], [72, 69]), (45, [52, 55, 61], [73, 76])]
def piano_tramo(t0, n_ac, dur_ac, g=1.0):
    for i in range(n_ac):
        r, ac, mel = PIANO[i % 4]; ti = t0 + i * dur_ac
        mus.put(ti, piano(r, 3.2, .8), g); mus.put(ti, piano(r + 12, 3.0, .5), g)
        for k, n in enumerate(ac + [ac[1] + 12]): mus.put(ti + .14 + k * .28, piano(n, 2.4, .6), g, -.3 + k * .2)
        for k, n in enumerate(mel): mus.put(ti + k * dur_ac / 2, piano(n, 2.6, .8), g, .2)
        for n in ac: mus.put(ti, cuerdas(n, dur_ac + .4, .5, .7), 1.2 * g)
piano_tramo(77.6, 2, 1.8, .9)
piano_tramo(81.2, 4, 1.5, 1.0)  # el puente
mus.put(86.7, campana(74, 2.0), .4)

# ---------- 87.2–126.4: el audio del video del 877 (sin música nuestra) ----------
exc = Pista()
for i, (t0, d) in enumerate([(87.2, 12.3), (99.0, 13.3), (111.8, 14.6)]):
    v, sr = sf.read(f'e877/s{i}.wav')
    if v.ndim > 1: v = v.mean(axis=1)
    e = np.ones(len(v)); f = int(.5 * SR); e[:f] = np.linspace(0, 1, f); e[-f:] = np.linspace(1, 0, f)
    exc.put(t0, v * e, 1.0)
mus.x[int(87.3 * SR):int(126.3 * SR)] *= 0

# ---------- llegada y final (126.4–137.3) ----------
mus.put(126.4, platillo(2.0), .9)
plan4 = [(0, 'B', 'med', False), (1, 'B', 'med', False), (2, 'B', 'full', True), (3, 'B', 'full', True)]
tramo(126.4, plan4)
shout(126.4 + 2 * 4 * BEAT, 'B', 2, 1.1); shout(126.4 + 3 * 4 * BEAT, 'B', 3, 1.1)
tf = 126.4 + 15 * BEAT
mus.x[int((tf - .02) * SR):int((tf + 4) * SR)] *= 0
golpe_final(tf, 1.2)
for n in (50, 57, 62, 65): mus.put(tf, cuerdas(n, 4.6, .3, 2.0), 1.4)
for i, (b, n, d) in enumerate(MEL['A'][:8]): mus.put(tf + 1.4 + b * .42, cajita(n + 12, 2.0), .9, .2)
mus.put(tf + 1.0, campana(62, 4.5), .8, -.3)
sfx.put(126.2, zumbido(.4), .9)
sfx.put(128.0, boom(2.0), .8); sfx.put(128.0, platillo(2.0), .8)
sfx.put(129.8, zumbido(.4), .8); sfx.put(131.5, platillo(1.2), .6)
sfx.put(133.6, zumbido(.5, False), .5)

# ---------- voces de radio y mezcla ----------
RADIO = [(1.0, 'r0'), (26.7, 'r1'), (53.6, 'r2'), (61.6, 'r4'), (69.4, 'r3'), (126.8, 'r5')]
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

mr = reverb(mus.x, 2.4, .25)
m = np.tanh(mr / np.percentile(np.abs(mr), 99.9) * .9) * .6
s = reverb(sfx.x, 1.3, .22)
ex = exc.x / (np.max(np.abs(exc.x)) + 1e-9) * .75
mezcla = m * DUCK[:, None] + s + reverb(voz.x, .6, .08) + ex
nf = int(TOTAL * SR); mezcla = mezcla[:nf]
ent = int(.4 * SR); mezcla[:ent] *= np.linspace(0, 1, ent)[:, None]
sal = int(2.0 * SR); mezcla[-sal:] *= (np.linspace(1, 0, sal) ** 1.6)[:, None]
mezcla = mezcla / np.max(np.abs(mezcla)) * .95
sf.write('mezcla_m2.wav', mezcla.astype(np.float32), SR, subtype='FLOAT')
for a, b, nom in [(0, 14.6, 'intro'), (33.6, 53.2, 'lotería'), (87.2, 126.4, '877'), (126.4, 137.3, 'final')]:
    seg = mezcla[int(a * SR):int(b * SR)]; print(nom, round(20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9), 1), 'dB')
print('ok', nf / SR)
