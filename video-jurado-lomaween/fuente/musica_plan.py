# Audio del recorrido del plan (7 s, intercalado en 31.5 s): cajita de música sobre cuerdas en Re menor,
# el lápiz que raspa, el boceto que se llena de color, las hojas que se voltean y la subida al sello de APROBADO.
import numpy as np
base = open('musica_m.py').read().split('# ---------- armonía y tema ----------')[0]
PRE = .3  # el audio empieza 0.3 s antes, para cruzarse con la música que se apaga
exec(base.replace('TOTAL = 76.5', 'TOTAL = 8.0'))
mus, sfx = Pista(), Pista()
T = lambda u: u + PRE

def raspado(d, g=1.0):  # un trazo de lápiz sobre papel
    t = tt(d); x = filtro(ruido(d), lo=2200, hi=7500) * (.6 + .4 * np.abs(np.sin(2 * np.pi * rng.uniform(18, 30) * t)))
    return x * np.sin(np.pi * t / d) ** .7 * .05 * g
def hoja(g=1.0):  # una página que se voltea
    d = .22; t = tt(d)
    aire = filtro(ruido(d), lo=700, hi=5000) * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2 * .12
    golpe = filtro(ruido(.05), lo=300, hi=2500) * np.exp(-tt(.05) * 70) * .18
    y = aire.copy(); i = int(.15 * SR); y[i:i + len(golpe)] += golpe[: len(y) - i]
    return y * g

# cuerdas: Dm → Bb → Gm → A, la dominante deja todo listo para el sello
for u0, d, notas in [(-.2, 2.6, [50, 57, 62, 65]), (2.25, 1.2, [46, 53, 58, 62]), (3.3, 1.9, [43, 50, 55, 58]), (5.1, 2.1, [45, 52, 57, 61])]:
    for n in notas: mus.put(T(u0), cuerdas(n, d + .4, .5, .6), .9)
# cajita de música: el tema, despacio y como recuerdo
MEL = [(.5, 69), (.85, 74), (1.2, 77), (1.55, 76), (1.9, 74), (2.3, 81), (2.45, 86), (2.6, 89), (3.3, 74), (3.62, 77), (3.99, 81), (4.32, 79),
       (4.6, 77), (4.85, 76), (5.08, 74), (5.27, 73), (5.44, 76), (5.59, 79), (5.73, 81), (6.2, 73), (6.5, 76)]
for u0, n in MEL: mus.put(T(u0), cajita(n, 1.8), 1.15, .15 if n > 76 else -.15)
mus.put(T(2.25), campana(81, 3.0), .9, .2); mus.put(T(2.3), ping(1760, 1.6), .7, -.2)

# efectos
sfx.put(T(-.1), zumbido(.7), 1.0)                       # entra el documento
u = .5
while u < 2.2:                                           # el lápiz
    d = rng.uniform(.09, .22); sfx.put(T(u), raspado(d), rng.uniform(.7, 1.1), rng.uniform(-.3, .3)); u += d + rng.uniform(.0, .06)
for u0 in [3.2, 3.62, 3.99, 4.315, 4.601, 4.853, 5.075, 5.27, 5.441, 5.592, 5.725]: sfx.put(T(u0), hoja(), 1.0, rng.uniform(-.25, .25))
sfx.put(T(6.15), zumbido(.75, False), .9)               # el plan cae en la bitácora
sfx.put(T(6.35), subida(.75), 1.0)

def reverb(x, dur=2.0, mezcla=0.25):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros_like(x)
    L = 1 << int(np.ceil(np.log2(len(x) + n)))
    for c in range(2):
        ir = rng.normal(0, 1, n) * np.exp(-t * 3.0); ir[0] = 0
        ir = filtro(ir, hi=5000); ir /= np.sqrt(np.sum(ir ** 2))
        y[:, c] = np.fft.irfft(np.fft.rfft(x[:, c], L) * np.fft.rfft(ir, L), L)[: len(x)]
    return x * (1 - mezcla) + y * mezcla
mezcla = reverb(mus.x, 2.6, .35) + reverb(sfx.x, 1.0, .18)
nf = int((PRE + 7.0 + .5) * SR); mezcla = mezcla[:nf]
ent = int(.25 * SR); mezcla[:ent] *= np.linspace(0, 1, ent)[:, None]
sal = int(.5 * SR); mezcla[-sal:] *= np.linspace(1, 0, sal)[:, None]
sf.write('plan_audio.wav', (mezcla / np.max(np.abs(mezcla)) * .9).astype(np.float32), SR, subtype='FLOAT')
print('ok', nf / SR)
