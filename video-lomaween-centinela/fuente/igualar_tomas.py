# Mete frases de otra grabación (otro lugar, otro día) y les iguala el timbre con el de la grabación principal:
# compara el espectro promedio de la voz y aplica una ecualización suave (máximo ±6 dB), luego el mismo volumen.
# Uso: python3 igualar_tomas.py <carpeta principal> <carpeta de donde vienen> <salida> <frases separadas por coma>
import sys, json, shutil, os, numpy as np, soundfile as sf, pyloudnorm as pyln
from scipy.signal import welch, firwin2, fftconvolve
PRIN, OTRA, SAL, FR = sys.argv[1], sys.argv[2], sys.argv[3], [int(f) for f in sys.argv[4].split(',')]
SR = 24000
def espectro(archivos):
    P = []
    for a in archivos:
        x, sr = sf.read(a); assert sr == SR
        hop = int(.02 * SR); n = len(x) // hop; e = np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, 1))
        voz = np.repeat(e > np.percentile(e[e > 0], 30), hop); y = x[:n * hop][voz]  # solo donde hay voz
        f, p = welch(y, SR, nperseg=2048); P.append(p)
    return f, np.mean(P, 0)
def suavizar(f, db, oct=1 / 3):  # promedio por tercios de octava
    out = np.copy(db)
    for i, fi in enumerate(f):
        if fi <= 0: continue
        m = (f >= fi * 2 ** (-oct / 2)) & (f <= fi * 2 ** (oct / 2)); out[i] = db[m].mean()
    return out
meta_p = json.load(open(f'{PRIN}/narradora.json')); meta_o = json.load(open(f'{OTRA}/narradora.json'))
os.makedirs(SAL, exist_ok=True)
for a in os.listdir(PRIN): shutil.copy(f'{PRIN}/{a}', f'{SAL}/{a}')
f, Pp = espectro([f'{PRIN}/{meta_p[n]["archivo"]}' for n in meta_p if int(n) not in FR])
_, Po = espectro([f'{OTRA}/{meta_o[str(n)]["archivo"]}' for n in FR])
corr = suavizar(f, 10 * np.log10(Pp / Po)); corr -= np.interp(1000, f, corr)  # sin cambiar el volumen en 1 kHz
corr = np.clip(corr, -6, 6); corr[f < 90] = corr[np.argmin(np.abs(f - 90))]; corr[f > 10000] = corr[np.argmin(np.abs(f - 10000))]
h = firwin2(1023, f / (SR / 2), 10 ** (corr / 20))
meter = pyln.Meter(SR)
for n in FR:
    x, _ = sf.read(f'{OTRA}/{meta_o[str(n)]["archivo"]}')
    obj = meter.integrated_loudness(x)
    y = fftconvolve(x, h, mode='same'); y *= 10 ** ((obj - meter.integrated_loudness(y)) / 20)
    pk = np.abs(y).max(); y = y * min(1, .89 / pk)
    sf.write(f'{SAL}/frase_{n:02d}.wav', y.astype(np.float32), SR)
    meta_p[str(n)] = dict(meta_o[str(n)], igualada_con=PRIN)
json.dump(meta_p, open(f'{SAL}/narradora.json', 'w'), ensure_ascii=False, indent=1)
for fr in (125, 250, 500, 1000, 2000, 4000, 8000): print(f'{fr:5d} Hz: {np.interp(fr, f, corr):+.1f} dB')
