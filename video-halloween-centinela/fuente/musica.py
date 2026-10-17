# Música original (sintetizada, libre de derechos) + efectos, mezclada con la voz.
# Re menor misterioso -> ritmo carretero -> final triunfal en Re mayor. 120 BPM.
import json, sys, numpy as np, soundfile as sf

B = sys.argv[1]
SR = 44100
tl = json.load(open(B + "/timeline.json"))
TOTAL = tl["total"]
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(7)
BEAT = 0.5
BAR = 2.0

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)

class Pista:
    def __init__(s): s.x = np.zeros(N)
    def put(s, t, y, g=1.0):
        i = int(t * SR)
        if i >= N: return
        y = y[: N - i]
        s.x[i:i + len(y)] += y * g

def tt(d): return np.arange(int(d * SR)) / SR

def env(d, a=0.005, r=0.05):
    t = tt(d); e = np.ones_like(t)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e

def lowpass(x, fc):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X /= np.sqrt(1 + (f / fc) ** 4)
    return np.fft.irfft(X, len(x))

def bandpass(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4) / np.sqrt(1 + (f / hi) ** 4)
    return np.fft.irfft(X, len(x))

# ---------- instrumentos ----------
def clave(n, d=0.45):            # clavecín (pulsado brillante)
    t = tt(d); f = midi(n); y = np.zeros_like(t)
    for k in range(1, 14):
        y += (1 / k) * np.sin(2 * np.pi * k * f * t) * np.exp(-t * (5 + 1.3 * k))
    return y * env(d, 0.002, 0.03) * 0.35

def organo(n, d):                 # órgano / colchón
    t = tt(d); f = midi(n); vib = 1 + 0.003 * np.sin(2 * np.pi * 5 * t)
    y = sum(a * np.sin(2 * np.pi * h * f * vib * t) for h, a in [(1, 1), (2, .5), (3, .3), (4, .2), (6, .1), (8, .08)])
    return y * env(d, 0.25, 0.4) * 0.12

def bajo(n, d=0.42):
    t = tt(d); f = midi(n)
    y = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.15 * np.sign(np.sin(2 * np.pi * f * t))
    return y * np.exp(-t * 3.5) * env(d, 0.004, 0.05) * 0.42

def marimba(n, d=0.6):
    t = tt(d); f = midi(n)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t * 6) + 0.35 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 22)
    return y * env(d, 0.001, 0.05) * 0.4

def theremin(notas, inicio, pista, g=0.16):
    # notas: [(midi, dur)] con portamento y vibrato
    t0 = inicio
    total = sum(d for _, d in notas); t = tt(total)
    f = np.zeros_like(t); pos = 0
    prev = midi(notas[0][0])
    for n, d in notas:
        m = int(d * SR); tgt = midi(n)
        glide = min(int(0.09 * SR), m)
        seg = np.full(m, tgt); seg[:glide] = np.linspace(prev, tgt, glide)
        f[pos:pos + m] = seg[: len(f) - pos]; pos += m; prev = tgt
    vib = 1 + 0.012 * np.sin(2 * np.pi * 5.5 * t) * np.clip(t / 0.6, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    y = np.sin(ph) + 0.12 * np.sin(2 * ph)
    pista.put(t0, y * env(total, 0.15, 0.5), g)

def bombo():
    t = tt(0.45); f = 48 + 110 * np.exp(-t * 30)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    y[:60] += rng.normal(0, 0.3, 60)
    return y * 0.9

def tarola():
    t = tt(0.25)
    ruido = bandpass(rng.normal(0, 1, len(t)), 900, 7000) * np.exp(-t * 18)
    tono = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 25)
    return (ruido * 0.55 + tono * 0.35)

def hihat(d=0.06):
    t = tt(d)
    return bandpass(rng.normal(0, 1, len(t)), 7000, 15000) * np.exp(-t * 60) * 0.25

def tom(f0):
    t = tt(0.4); f = f0 * (1 + 0.5 * np.exp(-t * 20))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) * 0.5

def platillo(d=2.5):
    t = tt(d)
    return bandpass(rng.normal(0, 1, len(t)), 4000, 16000) * np.exp(-t * 2.2) * 0.35

def campana(n, d=4.0):
    t = tt(d); f = midi(n); y = np.zeros_like(t)
    for r, a, dec in [(0.56, .6, 1.2), (0.92, .5, 1.5), (1.19, .4, 2), (1.71, .3, 2.5), (2, .5, 1.6), (2.74, .25, 3), (3, .2, 3.5), (3.76, .15, 4), (4.07, .12, 4.5)]:
        y += a * np.sin(2 * np.pi * r * f * t) * np.exp(-t * dec)
    return y * env(d, 0.002, 0.3) * 0.22

def barrido(d, f0, f1, g=0.25):   # whoosh / riser
    t = tt(d); x = rng.normal(0, 1, len(t)); y = np.zeros_like(t)
    tramos = 24
    for i in range(tramos):
        a, b = i * len(t) // tramos, (i + 1) * len(t) // tramos
        fc = f0 * (f1 / f0) ** (i / tramos)
        seg = bandpass(x[max(a - 2000, 0):b], fc * 0.6, fc * 1.6)[-(b - a):]
        y[a:b] = seg
    forma = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    return y * forma * g

def claxon(d=0.9):                # claxon de aire de tráiler (dos tonos)
    t = tt(d); y = np.zeros_like(t)
    for f in (311.0, 370.0, 466.0):
        vib = 1 + 0.004 * np.sin(2 * np.pi * 7 * t)
        ph = 2 * np.pi * f * np.cumsum(vib) / SR
        y += 2 * (ph / (2 * np.pi) % 1) - 1          # diente de sierra
    y = lowpass(y, 2200) * env(d, 0.03, 0.18)
    return np.tanh(y * 1.4) * 0.30

def beep(f=1450, d=0.12):         # "roger beep" de radio
    t = tt(d)
    return np.sign(np.sin(2 * np.pi * f * t)) * env(d, 0.003, 0.01) * 0.09

def brillo():                     # destello mágico para la dona
    y = np.zeros(int(1.2 * SR))
    for i, n in enumerate([86, 89, 93, 98, 101]):
        t = tt(0.6); s = np.sin(2 * np.pi * midi(n) * t) * np.exp(-t * 7) * 0.12
        a = int(i * 0.06 * SR); y[a:a + len(s)] += s
    return y

# ---------- composición ----------
mus, perc, sfx = Pista(), Pista(), Pista()

menor = [  # acordes por compás (2 s): Dm Bb Gm A
    [62, 65, 69, 74], [62, 65, 70, 74], [62, 67, 70, 74], [61, 64, 69, 73]]
raiz_m = [38, 34, 31, 33]

def compas_menor(i, t, clave_on=True, organo_on=True, bajo_on=False, marimba_on=False):
    ac = menor[i % 4]; r = raiz_m[i % 4]
    if organo_on:
        for n in ac[:3]: mus.put(t, organo(n - 12, BAR + 0.3), 1.0)
    if clave_on:
        patron = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 2, 3, 2]
        for k, p in enumerate(patron):
            mus.put(t + k * 0.125, clave(ac[p]), 0.8 if k % 4 else 1.0)
    if bajo_on:
        for k, d in enumerate([0, 0.75, 1.0, 1.5]):
            mus.put(t + d, bajo(r + (12 if k == 3 else 0)), 1.0)
    if marimba_on:
        mot = [ac[3] + 12, ac[2] + 12, ac[3] + 12, ac[1] + 12]
        for k, n in enumerate(mot):
            mus.put(t + k * 0.5, marimba(n), 0.9)

def bateria(t, fill=False, intensidad=1.0):
    for b in range(4):
        tb = t + b * BEAT
        if b in (0, 2): perc.put(tb, bombo(), intensidad)
        if b == 2 and not fill: perc.put(tb + 0.25, bombo(), 0.6 * intensidad)
        if b in (1, 3): perc.put(tb, tarola(), 0.8 * intensidad)
        for h in range(2): perc.put(tb + h * 0.25, hihat(), (0.9 if h else 0.6) * intensidad)
    if fill:
        for k, f in enumerate([220, 180, 150, 120]):
            perc.put(t + 1.5 + k * 0.125, tom(f), 0.8)

# intro: estática de radio y reloj
estatica = bandpass(rng.normal(0, 1, int(7.2 * SR)), 1200, 6000)
estatica *= (0.5 + 0.5 * (rng.random(len(estatica)) > 0.997).astype(float) * 3)
estatica *= np.clip(np.minimum(tt(7.2) / 0.3, (7.2 - tt(7.2)) / 0.7), 0, 1)
sfx.put(0.0, estatica, 0.035)
sfx.put(1.30, beep(1450), 1.0); sfx.put(1.43, beep(1850), 1.0)
radio_fin = next(l["fin"] for l in tl["lineas"] if l["escena"] == "radio")
sfx.put(radio_fin + 0.08, beep(1850), 1.0); sfx.put(radio_fin + 0.21, beep(1450), 1.0)
for k in range(8): perc.put(k * 0.5, hihat(0.03), 0.5)       # tic-tac

mus.put(0.0, organo(26, 8.5), 1.6)                            # drone Re grave
compas_menor(0, 2.0, clave_on=True, organo_on=False)
compas_menor(1, 4.0, clave_on=True, organo_on=True)
compas_menor(2, 6.0, clave_on=True, organo_on=True)
theremin([(69, 0.75), (74, 0.75), (73, 0.5), (74, 0.5), (77, 1.0), (76, 0.5), (74, 1.5)], 2.0, mus)

ini = {l["escena"]: l["inicio"] for l in tl["lineas"]}
fin_lema = ini["final"] - 0.6

# groove principal desde la dona hasta el lema
t = 8.0; i = 3
while t < fin_lema - 6.0:
    seccion_altar = ini["altar"] - 1.0 <= t < ini["cabina"] - 0.5
    compas_menor(i, t, clave_on=True, organo_on=True, bajo_on=True, marimba_on=seccion_altar)
    fill = (i % 4 == 2)
    bateria(t, fill=fill, intensidad=0.85 if t < ini["cabina"] else 1.0)
    t += BAR; i += 1
# breakdown (lema): colchón y clavecín suave, sin batería
while t < fin_lema:
    compas_menor(i, t, clave_on=True, organo_on=True, bajo_on=False)
    t += BAR; i += 1
mus.put(fin_lema - 2.2, barrido(2.4, 300, 9000, 0.22), 1.0)   # subida al final

# final triunfal: Bb - C - D mayor
tf = ini["final"] - 0.45
mayor = [([58, 62, 65, 70], 34), ([60, 64, 67, 72], 36), ([62, 66, 69, 74], 38)]
perc.put(tf, platillo(3.0), 1.0)
for j, (ac, r) in enumerate(mayor):
    tj = tf + j * 1.0
    for n in ac: mus.put(tj, organo(n, 1.2 if j < 2 else 4.5), 1.6)
    mus.put(tj, bajo(r, 0.9), 1.4)
    perc.put(tj, bombo(), 1.0); perc.put(tj + 0.5, tarola(), 0.9)
    for k in range(8): mus.put(tj + k * 0.125, clave(ac[k % 4] + (12 if k > 3 else 0)), 0.9)
tg = tf + 3.0
perc.put(tg, platillo(3.5), 1.0); perc.put(tg, bombo(), 1.2)
for n in [62, 66, 69, 74, 78]: mus.put(tg, marimba(n + 12, 2.0), 0.6)
sfx.put(tf - 0.15, claxon(0.55), 1.0)
cambio = next(l for l in tl["lineas"] if l["escena"] == "cambio")
sfx.put(cambio["fin"] + 0.08, beep(1850), 1.0); sfx.put(cambio["fin"] + 0.21, beep(1450), 1.0)
sfx.put(cambio["fin"] + 0.55, claxon(1.2), 0.9)

# efectos de escena
sfx.put(ini["dona"] - 0.35, brillo(), 1.0)
sfx.put(ini["cero"] + 2.2, brillo(), 0.9)
sfx.put(ini["altar"] - 0.2, campana(57), 1.0)
for esc in ["dona", "cero", "altar", "cabina", "sustos", "lema"]:
    sfx.put(ini[esc] - 0.55, barrido(0.7, 500, 6000, 0.12), 1.0)

# ---------- reverberación ----------
def reverb(x, dur=1.6, mezcla=0.25):
    n = int(dur * SR); t = np.arange(n) / SR
    ir = rng.normal(0, 1, n) * np.exp(-t * 4.2); ir[0] = 0
    ir = lowpass(ir, 5000); ir /= np.sqrt(np.sum(ir ** 2))
    L = 1 << int(np.ceil(np.log2(len(x) + n)))
    y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)[: len(x)]
    return x * (1 - mezcla) + y * mezcla

musica = reverb(mus.x, 1.8, 0.30) + reverb(perc.x, 0.8, 0.12) * 0.9
musica = np.tanh(musica * 0.9)

# ---------- mezcla con la voz (ducking) ----------
voz, sr = sf.read(B + "/voz44.wav")
assert sr == SR
if voz.ndim > 1: voz = voz.mean(axis=1)
voz = np.pad(voz, (0, max(0, N - len(voz))))[:N]
envv = np.convolve(np.abs(voz), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode="same")
envv = np.clip(envv / (np.percentile(envv[envv > 1e-4], 90) + 1e-9), 0, 1)
duck = 1 - 0.78 * envv
duck = np.convolve(duck, np.ones(int(0.12 * SR)) / int(0.12 * SR), mode="same")
fondo = musica * duck * 0.125 + reverb(sfx.x, 1.0, 0.2) * (0.28 + 0.32 * duck)
mezcla = voz * 1.0 + fondo
# fundido final
nf = int(TOTAL * SR)
mezcla = mezcla[:nf]
fade = int(1.2 * SR); mezcla[-fade:] *= np.linspace(1, 0, fade) ** 2
mezcla = mezcla / np.max(np.abs(mezcla)) * 0.97
sf.write(B + "/mezcla.wav", np.stack([mezcla, mezcla], 1).astype(np.float32), SR, subtype="FLOAT")
sf.write(B + "/solo_musica.wav", (musica[:nf] / np.max(np.abs(musica)) * 0.9).astype(np.float32), SR, subtype="FLOAT")
print("ok", nf / SR)
