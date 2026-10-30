# Mezcla del video final: voces de las tomas (limpias y parejas), audio de las animaciones, el fragmento del 877,
# la música (que baja cuando alguien habla) y los efectos. Sale mezcla_final.wav a 48 kHz, lista para masterizar.
import json, subprocess, numpy as np, soundfile as sf, pyloudnorm as pyln
from scipy.signal import resample_poly
from scipy.ndimage import maximum_filter1d, uniform_filter1d
SR = 48000
B = '/tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/jurado_clips/'
M4 = '/tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/jurado/muestra/mezcla4.wav'
mapa = dict(l.split() for l in open(B + 'mapa.txt'))
TL = json.load(open('timeline.json'))
N = int((TL['total'] + 1) * SR)
meter = pyln.Meter(SR)

def leer(fuente, a, b, filtro=None, canales=1):
    cmd = ['ffmpeg', '-nostdin', '-v', 'error', '-ss', f'{a:.4f}', '-t', f'{b - a:.4f}', '-i', fuente, '-vn', '-ac', str(canales), '-ar', str(SR)]
    if filtro: cmd += ['-af', filtro]
    raw = subprocess.run(cmd + ['-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, canales).astype(np.float64)

def bordes(x, f_in, f_out):
    n = len(x); a, b = min(n, int(f_in * SR)), min(n, int(f_out * SR))
    if a: x[:a] *= np.linspace(0, 1, a)[:, None] ** 1.5
    if b: x[-b:] *= np.linspace(1, 0, b)[:, None] ** 1.5
    return x

def nivel_voz(x):
    """Nivel RMS (dB) de los tramos con voz: lo de arriba de 25 dB bajo el máximo."""
    h = int(.02 * SR); n = len(x) // h
    if n < 3: return -30
    r = 20 * np.log10(np.sqrt(np.mean(x[:n * h, 0].reshape(n, h) ** 2, 1)) + 1e-9)
    v = r[r > r.max() - 25]
    return 10 * np.log10(np.mean(10 ** (v / 10)))

voz = np.zeros((N, 2)); amb = np.zeros((N, 2)); anim = np.zeros((N, 2)); tv = np.zeros((N, 2))
habla = np.zeros(N)
LIMPIA = 'highpass=f=85,lowpass=f=11500,afftdn=nr=14:nf=-42:tn=1,deesser=i=0.35,acompressor=threshold=-26dB:ratio=3:attack=6:release=140:makeup=1'
for e in TL['audio']:
    i = int(e['t0'] * SR)
    if e['tipo'] in ('voz', 'amb'):
        x = leer(B + 'raw/' + mapa[e['src']], e['ini'], e['fin'], LIMPIA if e['tipo'] == 'voz' else 'highpass=f=120,afftdn=nr=10:nf=-40')
        if e['tipo'] == 'voz':
            x *= 10 ** ((-17.5 - nivel_voz(x)) / 20)  # todas las voces al mismo nivel
            x = bordes(x, .03, .05) * e['gan']
            pista = voz
            # dónde hay voz, para bajar la música
            h = int(.01 * SR); n = len(x) // h
            if n:
                r = 20 * np.log10(np.sqrt(np.mean(x[:n * h, 0].reshape(n, h) ** 2, 1)) + 1e-9)
                on = np.repeat(r > -42, h)
                habla[i:i + len(on)] = np.maximum(habla[i:i + len(on)], on[:max(0, N - i)])
        else:
            x *= 10 ** ((-30.0 - nivel_voz(x)) / 20) * e['gan'] / .5
            x = bordes(x, .08, .1); pista = amb
        x = np.repeat(x, 2, axis=1) * np.sqrt(.5)
    elif e['tipo'] == 'anim':
        a = TL['anim_m4'][e['src'][5:]] + e['ini']
        y, sr = sf.read(M4, start=int(a * 48000), stop=int((a + e['fin'] - e['ini']) * 48000))
        x = bordes(y.astype(np.float64), .06, .08) * (.68 if e['src'] == 'anim_A' else .92); pista = anim  # la apertura venía más fuerte
    elif e['tipo'] == '877':
        x = bordes(leer(TL['tv877'], e['ini'], e['fin'], canales=2), .25, .3) * .95; pista = tv
    else:
        continue
    j = min(N, i + len(x)); pista[i:j] += x[:j - i]

# la música: baja cuando alguien habla y se calla en las animaciones y en el 877 (traen su propio audio)
mus, sr = sf.read('musica_final.wav'); mus = resample_poly(mus, 160, 147, axis=0)[:N]
sfx, sr = sf.read('sfx_final.wav'); sfx = resample_poly(sfx, 160, 147, axis=0)[:N]
mus = np.pad(mus, ((0, N - len(mus)), (0, 0))); sfx = np.pad(sfx, ((0, N - len(sfx)), (0, 0)))
h = maximum_filter1d(habla, int(.7 * SR)); h = uniform_filter1d(h, int(.3 * SR))
duck = 1 - .74 * h
mute = np.ones(N)
for x in TL['tomas']:
    if x['src'].startswith('anim_') or x['src'] == '877':
        a, b = int((x['t0'] + .25) * SR), int((x['t0'] + x['dur'] - .1) * SR); mute[a:b] = 0
mute = uniform_filter1d(mute, int(.5 * SR))
musica = mus * (duck * mute)[:, None] * .62
efectos = sfx * .8
mezcla = voz + amb + anim + tv + musica + efectos
fin = int(TL['total'] * SR); mezcla = mezcla[:fin]
s = int(1.2 * SR); mezcla[-s:] *= np.linspace(1, 0, s)[:, None] ** 1.4
for nom, p in (('voz', voz), ('anim', anim), ('877', tv), ('música', musica), ('efectos', efectos)):
    q = p[:fin]; act = np.abs(q).max(1) > 1e-4
    print(f'{nom:8s} {meter.integrated_loudness(q[act]) if act.sum() > SR else float("nan"):6.1f} LUFS en lo que suena')
print('mezcla', round(meter.integrated_loudness(mezcla), 1), 'LUFS, pico', round(20 * np.log10(np.abs(mezcla).max()), 1), 'dB')
sf.write('mezcla_final.wav', mezcla.astype(np.float32), SR, subtype='FLOAT')
