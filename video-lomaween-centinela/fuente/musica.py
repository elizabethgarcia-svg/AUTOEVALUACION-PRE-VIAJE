# Música original emotiva (sintetizada, libre de derechos) + efectos suaves, mezclada con la voz.
# Inicio emotivo a 84 BPM, Fa mayor a 66 BPM en medio y final melancólico en Re menor después de la llamada.
import json, sys, numpy as np, soundfile as sf
from scipy.signal import lfilter

B = sys.argv[1]
SR = 44100
tl = json.load(open(B + "/timeline.json"))
TOTAL = tl["total"]
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(3)
BEAT = 60 / 66
BAR = 4 * BEAT
ini = {l["escena"]: l["inicio"] for l in tl["lineas"]}
fin = {l["escena"]: l["fin"] for l in tl["lineas"]}
frases = {f["texto"][:18]: f["inicio"] for l in tl["lineas"] for f in l["frases"]}

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def tt(d): return np.arange(int(d * SR)) / SR

class Pista:
    def __init__(s): s.x = np.zeros(N)
    def put(s, t, y, g=1.0):
        i = int(t * SR)
        if i >= N or i < 0: return
        y = y[: N - i]; s.x[i:i + len(y)] += y * g

def env(d, a=0.005, r=0.05):
    t = tt(d); e = np.ones_like(t)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e

def filtro(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    if lo: X *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: X *= 1 / np.sqrt(1 + (f / hi) ** 4)
    return np.fft.irfft(X, len(x))

# ---------- instrumentos ----------
def piano(n, d=3.2, vel=1.0):
    t = tt(d); f0 = midi(n); y = np.zeros_like(t); Bi = 0.0004
    for k in range(1, 11):
        fk = k * f0 * np.sqrt(1 + Bi * k * k)
        if fk > 12000: break
        y += (1 / k ** 1.3) * np.sin(2 * np.pi * fk * t) * np.exp(-t * (0.9 + 0.55 * k) * (1 + n / 90))
    y[:200] += rng.normal(0, .04, 200) * np.linspace(1, 0, 200)
    return y * env(d, 0.004, 0.4) * 0.22 * vel

def guitarra(n, d=2.4, vel=1.0):
    f = midi(n); P = int(SR / f)
    x = np.zeros(int(d * SR)); x[:P] = filtro(rng.normal(0, 1, P * 4), hi=3500)[:P]
    a = np.zeros(P + 2); a[0] = 1; a[P] = -0.497; a[P + 1] = -0.497
    y = lfilter([1.0], a, x)
    return filtro(y, hi=4500) * env(d, 0.002, 0.3) * 0.16 * vel

def cuerdas(n, d):
    t = tt(d); f = midi(n); y = np.zeros_like(t)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * t)
    for det in (-0.006, 0, 0.0055):
        ph = f * (1 + det) * np.cumsum(vib) / SR
        y += 2 * (ph % 1) - 1
    y = filtro(y, hi=2200)
    return y * env(d, 1.6, 1.4) * 0.035

def cajita(n, d=2.2):
    t = tt(d); f = midi(n)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t * 2.4) + .25 * np.sin(2 * np.pi * 4.01 * f * t) * np.exp(-t * 9)
    return y * env(d, 0.001, 0.2) * 0.12

def grillos(d):
    t = tt(d); y = np.zeros_like(t); c = 0.0
    while c < d - 1:
        for k in range(3):
            a = int((c + k * .07) * SR); m = int(.045 * SR)
            if a + m > len(y): break
            tc = np.arange(m) / SR
            y[a:a + m] += np.sin(2 * np.pi * 4700 * tc) * (0.5 - 0.5 * np.cos(2 * np.pi * np.arange(m) / m)) * (.5 + .5 * np.sin(2 * np.pi * 60 * tc))
        c += 0.7 + rng.random() * .6
    return y * 0.018

def pajaros(d):
    y = np.zeros(int(d * SR)); c = 0.2
    while c < d - .5:
        for k in range(int(2 + rng.random() * 3)):
            a = int((c + k * .11) * SR); m = int(.08 * SR); tc = np.arange(m) / SR
            f = 2600 + 2200 * (tc / .08) ** 1.5 * (1 if rng.random() > .3 else -0.6)
            s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * np.arange(m) / m)
            if a + m < len(y): y[a:a + m] += s
        c += 0.9 + rng.random() * 1.4
    return y * 0.03

def beep(f, d=0.14):
    t = tt(d); return np.sin(2 * np.pi * f * t) * env(d, .004, .06) * 0.07

def timbre():
    y = np.zeros(int(2.4 * SR))
    for r in (0, 1.2):
        t = tt(.7); s = np.where(np.sin(2 * np.pi * 18 * t) > 0, np.sin(2 * np.pi * 1180 * t), np.sin(2 * np.pi * 960 * t))
        s = s * env(.7, .01, .08) * 0.045; a = int(r * SR); y[a:a + len(s)] += s
    return y

def paso_troca(d=3.5):
    t = tt(d); ruido = filtro(rng.normal(0, 1, len(t)), lo=60, hi=900)
    motor = sum(np.sin(2 * np.pi * h * 55 * t) / h for h in (1, 2, 3))
    forma = np.exp(-((t - d / 2) / (d / 4)) ** 2)
    return (ruido * .6 + motor * .3) * forma * 0.05

# ---------- composición ----------
mus, sfx = Pista(), Pista()
# acordes I–V–vi–IV en Fa (raíz, terceras/quinta) y una melodía sencilla
ACORDES = [(41, [53, 57, 60]), (36, [52, 55, 60]), (38, [53, 57, 62]), (34, [53, 58, 62])]
MELODIA = [[(72, 2), (69, 2)], [(67, 3), (64, 1)], [(65, 1), (69, 1), (74, 2)], [(72, 1), (70, 1), (69, 2)]]
FIN = TOTAL - 1.0

def arpegio_piano(t, i, vel=1.0):
    r, ac = ACORDES[i % 4]
    mus.put(t, piano(r, 3.6, .8 * vel))
    patron = [ac[0], ac[1], ac[2], ac[1] + 12 if False else ac[1]]
    for k, n in enumerate([ac[0], ac[1], ac[2], ac[1], ac[0] + 12, ac[2], ac[1], ac[2]]):
        mus.put(t + k * BEAT / 2, piano(n, 2.4, .55 * vel))

def melodia(t, i, inst, g=1.0, oct=0):
    c = 0
    for n, b in MELODIA[i % 4]:
        mus.put(t + c * BEAT, inst(n + oct), g); c += b

def arpegio_guitarra(t, i):
    r, ac = ACORDES[i % 4]
    notas = [r + 12, ac[0], ac[1], ac[2], ac[1] + 12, ac[2], ac[1], ac[0]]
    for k, n in enumerate(notas):
        mus.put(t + k * BEAT / 2, guitarra(n), 0.9 if k else 1.1)

def bombo(d=0.5):
    t = tt(d); f = 42 + 50 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 0.22

def rasgueo(t0, ac, r, g=0.55):
    for k, n in enumerate([r + 12] + ac + [ac[1] + 12]): mus.put(t0 + k * .016, guitarra(n, 1.6, .8), g)

# --- 1. inicio emotivo, con más movimiento (84 BPM; bajo que desciende Fa–Mi–Re–Si♭) ---
B1 = 60 / 84; BAR1 = 4 * B1
AC1 = [(41, [53, 57, 60]), (40, [52, 55, 60]), (38, [53, 57, 62]), (34, [53, 58, 62])]
MEL1 = [[(72, 1), (74, .5), (76, .5), (77, 1.5), (76, .5)], [(76, 1), (74, 1), (72, 2)],
        [(74, .5), (76, .5), (77, 1), (81, 1.5), (79, .5)], [(77, 1), (76, 1), (74, 1), (72, 1)]]
t, i = 0.0, 0
while t + BAR1 <= ini["camino"] - .3:
    r, ac = AC1[i % 4]
    radio = ini["radio"] - .3 <= t < ini["espera"] - .6
    espera = t >= ini["espera"] - .6
    if radio:
        # se abre espacio para la estática y la voz del radio
        for n in ac: mus.put(t, cuerdas(n, BAR1 + 1.0), .55)
        mus.put(t, piano(r + 12, 3.0, .55))
    else:
        mus.put(t, piano(r, 3.0, .85))
        for k, n in enumerate([ac[0], ac[1], ac[2], ac[0] + 12, ac[2], ac[1], ac[2], ac[0] + 12]):
            mus.put(t + k * B1 / 2, piano(n, 1.8, .5))
        for b in (0, 2): mus.put(t + b * B1, bombo(), .8 if espera else .6)
        if not espera:
            for b in (1, 3): rasgueo(t + b * B1, ac, r)
        c = 0
        for n, b in MEL1[i % 4]:
            mus.put(t + c * B1, piano(n + (12 if espera and i % 8 >= 4 else 0), 2.4, .95)); c += b
        for n in ac + [r + 12]: mus.put(t - .2, cuerdas(n, BAR1 + 1.0), 1.0 if espera else .45)
    t += BAR1; i += 1
# --- 2. la parte de en medio se queda como estaba (66 BPM) ---
T_FINAL = fin["cambio"] + .6
i = 0
while t < FIN - BAR * .5:
    if t + BAR > T_FINAL:
        # puente en Si♭ (común a Fa mayor y a Re menor) mientras termina la llamada
        if T_FINAL - t > .5:
            for n in [50, 53, 58]: mus.put(t, cuerdas(n, T_FINAL - t + 1.2), .8)
            mus.put(t, piano(34, 3.5, .7))
        t = T_FINAL; break
    sec_camino = ini["camino"] - .5 <= t < ini["alertas"] - .5 or ini["despedida"] - .5 <= t < ini["cambio"] - .3
    sec_msg = ini["mensaje"] - .5 <= t < ini["razon"] - 1
    sec_clim = t >= ini["razon"] - 1.5
    calma = ini["alertas"] - .5 <= t < ini["mensaje"] - .5
    arpegio_piano(t, i, 0.75 if calma else 1.0)
    if sec_camino: arpegio_guitarra(t, i)
    if sec_msg: melodia(t, i, cajita, 1.0, 12)
    elif not calma: melodia(t, i, lambda n: piano(n, 3.0, .9), 1.0)
    if sec_clim or sec_msg:
        r, ac = ACORDES[i % 4]
        for n in ac + [r + 12]: mus.put(t - .3, cuerdas(n, BAR + 1.2), 1.0 if sec_clim else 0.55)
    t += BAR; i += 1
# --- 3. después de la llamada: final melancólico en Re menor (60 BPM) ---
B3 = 1.0; BAR3 = 4 * B3
PROG = {'Dm': (38, [50, 53, 57], [(69, 2), (67, 1), (65, 1)]), 'Bb': (34, [50, 53, 58], [(65, 1.5), (67, .5), (69, 2)]),
        'F': (41, [53, 57, 60], [(72, 2), (70, 1), (69, 1)]), 'C': (36, [52, 55, 60], [(67, 3), (64, 1)]),
        'Gm': (43, [50, 55, 58], [(70, 2), (69, 1), (67, 1)]), 'A': (33, [49, 52, 57], [(69, 2), (73, 2)])}
n_bar = max(3, int((TOTAL - 6.5 - t) / BAR3))
orden = {3: ['Dm', 'Gm', 'A'], 4: ['Dm', 'Bb', 'Gm', 'A'], 5: ['Dm', 'Bb', 'F', 'Gm', 'A']}.get(n_bar, ['Dm', 'Bb', 'F', 'C', 'Gm', 'A'][:n_bar])
for k, nombre in enumerate(orden):
    r, ac, mel = PROG[nombre]
    mus.put(t, piano(r, 4.5, .7)); mus.put(t, piano(r + 12, 4.5, .45))
    for j, n in enumerate([ac[0], ac[1], ac[2], ac[1] + 12, ac[2], ac[1]]):
        mus.put(t + j * B3 * .5 + .02 * j, piano(n, 2.6, .38))
    for n in ac: mus.put(t - .3, cuerdas(n, BAR3 + 1.4), .75)
    mus.put(t - .3, cuerdas(r + 12, BAR3 + 1.4), 1.1)
    c = 0
    for n, b in mel:
        mus.put(t + c * B3, piano(n, 3.4, .8))
        if k >= len(orden) - 2: mus.put(t + c * B3 + .03, cajita(n + 12, 2.6), .55)
        c += b
    t += BAR3
# acorde final: Re menor con novena, que se queda sonando
for n in [38, 50, 53, 57, 62, 64]: mus.put(t, piano(n, 7.0, .75))
mus.put(t, piano(74, 6.0, .7)); mus.put(t + .03, cajita(86, 3.0), .5)
for n in [50, 53, 57, 62]: mus.put(t - .3, cuerdas(n, 6.5), .9)

# efectos
def estatica(d):
    # radio limpio: un «chsss» corto al abrir y al cerrar, y casi nada mientras se habla (sin chasquidos)
    x = filtro(rng.normal(0, 1, int(d * SR)), lo=1500, hi=4200)
    t = tt(d); golpe = np.exp(-t / .12) + np.exp(-(d - t) / .12) * .8
    forma = np.clip(np.minimum(t / .02, (d - t) / .05), 0, 1) * (0.22 + 0.78 * np.clip(golpe, 0, 1))
    return x * forma * 0.022

def roger(t0):
    sfx.put(t0, beep(1850, .12) * 1.2, 1.0); sfx.put(t0 + .13, beep(1450, .12) * 1.2, 1.0)

def claxon(d=1.1):
    t = tt(d); y = np.zeros_like(t)
    for f in (311.0, 370.0):
        ph = f * np.cumsum(1 + 0.003 * np.sin(2 * np.pi * 6 * t)) / SR
        y += 2 * (ph % 1) - 1
    return np.tanh(filtro(y, hi=1800) * env(d, .04, .25) * 1.3) * 0.12

def al_decir(esc, frag):  # instante aproximado en que la voz dice "frag"
    for l in tl["lineas"]:
        if l["escena"] != esc: continue
        for f in l["frases"]:
            i = f["texto"].find(frag)
            if i >= 0: return f["inicio"] + (f["fin"] - f["inicio"]) * i / len(f["texto"])
        todo, marcas = "", []  # la frase puede quedar repartida entre dos tramos de una grabación
        for f in l["frases"]: marcas.append((len(todo), f)); todo += f["texto"] + " "
        i = todo.find(frag)
        if i >= 0:
            c0, f = [m for m in marcas if m[0] <= i][-1]
            return f["inicio"] + (f["fin"] - f["inicio"]) * min(1, (i - c0) / len(f["texto"]))
    raise KeyError(frag)

sfx.put(ini["radio"] - .7, estatica(fin["radio"] - ini["radio"] + 1.3), 1.0)
roger(ini["radio"] - .45); roger(fin["radio"] + .1)
sfx.put(fin["bienvenida"] + .15, claxon(.4), 1.0); sfx.put(fin["bienvenida"] + .65, claxon(.8), 1.0)
sfx.put(fin["bienvenida"] + .9, paso_troca(3.2), 1.6)
sfx.put(fin["despedida"] + .1, claxon(.4), 1.0); sfx.put(fin["despedida"] + .6, claxon(.8), 1.0)
sfx.put(fin["radio"] - .5, grillos(ini["camino"] - fin["radio"] + 1.5), 1.0)
sfx.put(ini["camino"] + 1.5, paso_troca(4.0), 1.0)
sfx.put(ini["rescate"] + .5, paso_troca(4.5), 1.3)
sfx.put(ini["final"] - 1.0, grillos(TOTAL - ini["final"] + 1.0), 0.35)  # grillos muy bajitos al final
for frag in ("si un tráiler", "si el operador", "o si se distrae"):
    tb = al_decir("alertas", frag) + .2
    sfx.put(tb, beep(880), 1.0); sfx.put(tb + .18, beep(1320), 1.0)
sfx.put(al_decir("cabina", "llamamos") + .55, timbre()[: int(.8 * SR)], 1.0)
sfx.put(ini["cambio"] - .4, estatica(fin["cambio"] - ini["cambio"] + 1.2), 1.0)
roger(fin["cambio"] + .1)

def reverb(x, dur=2.6, mezcla=0.3):
    n = int(dur * SR); t = np.arange(n) / SR
    ir = rng.normal(0, 1, n) * np.exp(-t * 2.8); ir[0] = 0
    ir = filtro(ir, hi=4500); ir /= np.sqrt(np.sum(ir ** 2))
    L = 1 << int(np.ceil(np.log2(len(x) + n)))
    y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)[: len(x)]
    return x * (1 - mezcla) + y * mezcla

musica = np.tanh(reverb(mus.x, 2.8, .32) * 1.2)

voz, sr = sf.read(B + "/voz44.wav")
if voz.ndim > 1: voz = voz.mean(axis=1)
voz = np.pad(voz, (0, max(0, N - len(voz))))[:N]
w = int(.3 * SR)
envv = np.convolve(np.abs(voz), np.ones(w) / w, mode="same")
envv = np.clip(envv / (np.percentile(envv[envv > 1e-4], 90) + 1e-9), 0, 1)
duck = np.convolve(1 - 0.72 * envv, np.ones(int(.2 * SR)) / int(.2 * SR), mode="same")
fondo = musica * duck * 0.25 + reverb(sfx.x, 1.2, .25) * (0.5 + 0.5 * duck)
mezcla = voz + fondo
nf = int(TOTAL * SR); mezcla = mezcla[:nf]
ent = int(1.5 * SR); mezcla[:ent] *= np.linspace(0, 1, ent)
sal = int(3.0 * SR); mezcla[-sal:] *= np.linspace(1, 0, sal) ** 1.5
mezcla = mezcla / np.max(np.abs(mezcla)) * 0.97
sf.write(B + "/mezcla.wav", np.stack([mezcla, mezcla], 1).astype(np.float32), SR, subtype="FLOAT")
print("ok", nf / SR)
