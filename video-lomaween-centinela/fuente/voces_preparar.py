# Prepara las grabaciones de la Narradora: toma elegida, sin "Frase N", reparación de picos recortados,
# filtro, compresión suave, pausas internas acotadas y volumen parejo. Alinea el guion con cada tramo de voz.
import json, re, difflib, glob, subprocess, unicodedata
import numpy as np, soundfile as sf, sherpa_onnx, pyloudnorm as pyln
from scipy.interpolate import CubicSpline
from scipy.signal import butter, sosfiltfilt, resample_poly
# Uso: python3 voces_preparar.py <carpeta con las notas de voz .ogg> <modelo whisper de sherpa-onnx> <salida>
import sys
UP, M, SAL = sys.argv[1], sys.argv[2], sys.argv[3]
SR0, SR = 48000, 24000
# frase -> ([(nota de voz, inicio, fin de la toma en s), ...], pausa interna máxima). Varias piezas = tomas unidas en una pausa.
TOMAS = {3: ([('11.45.40_PM', 4.44, 16.72)], 1.0), 4: ([('11.38.25_PM', 2.78, 15.46)], 1.0), 5: ([('11.47.21_PM', 4.18, 24.30)], 1.0),
         6: ([('11.48.58_PM', 5.00, 24.18)], 1.0), 7: ([('11.40.12_PM', 3.06, 13.66)], 1.0), 8: ([('11.40.33_PM', 4.46, 15.96)], 1.0),
         9: ([('11.41.24_PM', 3.96, 16.66)], 1.0),
         10: ([('8.00.00_AM', 7.44, 28.06), ('8.01.01_AM', 25.08, 27.50), ('8.00.00_AM', 31.86, 34.14)], 1.0),  # "tengas sueño" de la 2.ª toma
         11: ([('11.43.04_PM', 13.80, 22.74)], 1.0), 12: ([('7.57.12_AM', 6.48, 12.38)], 1.3), 13: ([('7.58.35_AM', 4.28, 19.20)], 1.0),
         16: ([('7.56.04_AM', 6.50, 15.06), ('7.55.31_AM', 15.60, 18.52)], 1.3)}  # final "los necesitan" de la 2.ª toma
GUION = {3: "Cada noche, en muchas casas de nuestra gran familia Grupo Loma, alguien mira por la ventana, esperando a que papá o mamá regrese de la carretera.",
  4: "En Día de Muertos, los pétalos de cempasúchil marcan el camino de regreso a casa. En la cabina Centinela, nosotros también cuidamos ese camino, kilómetro a kilómetro.",
  5: "Somos los Centinelas: un equipo que, desde una cabina llena de pantallas, acompaña a cada operador en su viaje, de día y de noche. Centinelas de Ruta, Centinelas de Seguridad y Rescates Carreteros: siempre atentos, siempre listos.",
  6: "Y para manejar seguro, lo más importante es descansar. Dormir sus horas completas, hacer pausas en el camino, y si le da sueño, detenerse en un lugar seguro. Porque un operador descansado es un operador seguro.",
  7: "Nuestras pantallas nos avisan si un tráiler va demasiado rápido, y si el operador tiene sueño, o si se distrae con el celular.",
  8: "Entonces llamamos: ¿cómo vas, compañero? A veces, solo necesita descansar un poco. Y eso también es cuidarlo.",
  9: "Y si algo pasa en el camino, nuestros Rescates Carreteros salen de inmediato a ayudar. Porque en esta familia, nadie se queda solo en la carretera.",
  10: "Pero el cuidado más importante empieza en casa. Por eso hoy te pedimos algo muy especial: cuando abraces a papá o a mamá, recuérdale tres cosas. Maneja con calma. Descansa cuando tengas sueño. Y el celular, guárdalo.",
  11: "Desde hoy, tú también eres un Mini Centinela. Tu misión es recordárselo cada vez que salga de casa.",
  12: "Y dile que tú eres su razón más grande para regresar.",
  13: "Recordemos a quienes se fueron, y cuidemos a quienes regresan. Desde la cabina, protegemos cada kilómetro, para que cada noche, la familia esté completa.",
  16: "Porque el viaje más importante es el regreso a casa, donde pueden sentir el calor de quienes más los necesitan."}
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{M}/small-encoder.onnx', decoder=f'{M}/small-decoder.onnx', tokens=f'{M}/small-tokens.txt', language='es', task='transcribe', num_threads=4)

def decodificar(f):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f, '-ac', '1', '-ar', str(SR0), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)
def reparar_picos(x, umbral=.98, k=16):
    c = np.abs(x) >= umbral
    d = np.diff(np.concatenate([[0], c.astype(int), [0]])); ini, fin = np.where(d == 1)[0], np.where(d == -1)[0]
    y = x.copy()
    for a, b in zip(ini, fin):
        if b - a < 2 or a - k < 0 or b + k > len(x): continue
        idx = np.r_[a - k:a, b:b + k]
        if np.any(c[idx]): idx = idx[~c[idx]]
        if len(idx) < 6: continue
        rep = CubicSpline(idx, x[idx])(np.arange(a, b))
        s = np.sign(x[a:b]); rep = s * np.maximum(np.abs(rep), np.abs(x[a:b]))  # nunca por debajo del recorte
        y[a:b] = np.clip(rep, -2.5, 2.5)
    return y, len(ini)
def tramos(x, sr, min_sil=.32, min_voz=.12):
    hop = int(.01 * sr); n = len(x) // hop
    db = 20 * np.log10(np.array([np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2)) for i in range(n)]) + 1e-9)
    umbral = max(np.percentile(db, 10) + 12, np.percentile(db, 95) - 34)
    v = db > umbral; segs = []; i = 0
    while i < n:
        if not v[i]: i += 1; continue
        j = i
        while True:
            while j < n and v[j]: j += 1
            k = j
            while k < n and not v[k]: k += 1
            if k < n and (k - j) * .01 < min_sil: j = k; continue
            break
        if (j - i) * .01 >= min_voz: segs.append([i * .01, j * .01])
        i = j
    return segs
def comprimir(x, sr, umbral_db=-24, ratio=2.2, ataque=.008, suelta=.12):
    e = np.abs(x); a1, a2 = np.exp(-1 / (ataque * sr)), np.exp(-1 / (suelta * sr))
    env = np.zeros_like(e); g = 0.0
    for i, v in enumerate(e):
        g = a1 * g + (1 - a1) * v if v > g else a2 * g + (1 - a2) * v
        env[i] = g
    db = 20 * np.log10(env + 1e-9); exceso = np.maximum(0, db - umbral_db)
    return x * 10 ** (-(exceso - exceso / ratio) / 20)
def norm(w):  # minúsculas, sin acentos y con equivalencias de sonido (seseo, b/v, h muda) para comparar con el reconocedor
    w = ''.join(c for c in unicodedata.normalize('NFD', w.lower()) if c.isalnum() and unicodedata.category(c) != 'Mn')
    w = re.sub(r'c([ei])', r's\1', w).replace('z', 's').replace('v', 'b').replace('ll', 'y').replace('h', '')
    return re.sub(r'm([pb])', r'n\1', w)

hp = butter(2, 75, 'highpass', fs=SR0, output='sos'); lp = butter(6, 11000, 'lowpass', fs=SR0, output='sos')
salida = {}
def voz_rms(x):
    hop = int(.02 * SR0); fr = np.array([np.sqrt(np.mean(x[i*hop:(i+1)*hop]**2)) for i in range(len(x)//hop)])
    return np.sqrt(np.mean(fr[fr > np.max(fr) * .1] ** 2))
for n, (lista, pmax) in TOMAS.items():
    piezas, t, nuevos, npicos = [], 0.0, [], 0
    for j, (hora, a, b) in enumerate(lista):
        x = decodificar(glob.glob(f'{UP}/*{hora}.ogg')[0])
        x = x[int((a - .2) * SR0): int((b + .3) * SR0)]
        x, k = reparar_picos(x); npicos += k
        x = sosfiltfilt(lp, sosfiltfilt(hp, x))
        x = x * (0.1 / voz_rms(x))  # piezas de tomas distintas al mismo nivel antes de unirlas
        segs = tramos(x, SR0)
        # quitar ruidos antes/después de la frase y acotar pausas internas
        for i, (s0, s1) in enumerate(segs):
            s0p, s1p = max(0, s0 - .06), min(len(x) / SR0, s1 + .10)
            if i > 0 or j > 0:
                p = min(s0p - prev_fin, pmax) if i > 0 else min(.8, pmax)
                p = max(p, 0)
                piezas.append(np.zeros(int(p * SR0))); t += p
            seg = x[int(s0p * SR0): int(s1p * SR0)].copy()
            fade = int(.008 * SR0); seg[:fade] *= np.linspace(0, 1, fade); seg[-fade:] *= np.linspace(1, 0, fade)
            nuevos.append([t + (s0 - s0p), t + (s0 - s0p) + (s1 - s0)])
            piezas.append(seg); t += len(seg) / SR0; prev_fin = s1p
    y = np.concatenate(piezas)
    y = comprimir(y, SR0)
    y = resample_poly(y, SR, SR0)
    # volumen parejo: sonoridad integrada de cada frase a -20.5 LUFS (un poco arriba del 877 y de la radio)
    y = y * 10 ** ((-20.5 - pyln.Meter(SR).integrated_loudness(y)) / 20)
    u = .9; m = np.abs(y) > u  # limitador suave para los picos que queden arriba de 0.9
    y[m] = np.sign(y[m]) * (u + (1 - u) * np.tanh((np.abs(y[m]) - u) / (1 - u)))
    sf.write(f'{SAL}/frase_{n:02d}.wav', y.astype(np.float32), SR)
    # transcribir cada tramo y alinear el guion palabra por palabra
    asr = []
    for k, (s0, s1) in enumerate(nuevos):
        seg = y[int(max(0, s0 - .1) * SR): int((s1 + .1) * SR)].astype(np.float32)
        st = rec.create_stream(); st.accept_waveform(SR, seg); rec.decode_stream(st)
        asr += [(norm(w), k) for w in st.result.text.split() if norm(w)]
    g = GUION[n].split(); gn = [norm(w) for w in g]
    sm = difflib.SequenceMatcher(None, gn, [w for w, _ in asr], autojunk=False)
    tramo = [None] * len(g)
    for blk in sm.get_matching_blocks():
        for j in range(blk.size): tramo[blk.a + j] = asr[blk.b + j][1]
    emparejada = [k is not None for k in tramo]
    ult = 0
    for i in range(len(g)):
        if tramo[i] is None:
            # sin pareja: si abre frase (tras puntuación) va con la siguiente palabra emparejada; si no, con la anterior
            sig = next((tramo[j] for j in range(i + 1, len(g)) if emparejada[j]), None)
            abre = i > 0 and g[i - 1][-1] in '.,;:!?'
            tramo[i] = sig if (abre and sig is not None) else ult
        if tramo[i] < ult: tramo[i] = ult
        ult = tramo[i]
    frases = []
    for i, w in enumerate(g):
        k = tramo[i]
        if frases and frases[-1]['k'] == k: frases[-1]['texto'] += ' ' + w
        else: frases.append({'k': k, 'texto': w})
    for fz in frases:
        fz['inicio'], fz['fin'] = round(nuevos[fz['k']][0], 3), round(nuevos[fz['k']][1], 3)
    # tramos sin palabras del guion (respiraciones, ruidos) se quedan como silencio de la frase anterior
    salida[n] = {'archivo': f'frase_{n:02d}.wav', 'dur': round(len(y) / SR, 3), 'picos_reparados': npicos, 'frases': [{k: v for k, v in fz.items() if k != 'k'} for fz in frases]}
    print(f"F{n:2d} {len(y)/SR:5.1f}s  picos {npicos:3d}  " + ' | '.join(f"[{fz['inicio']:.1f}] {fz['texto']}" for fz in frases))
json.dump(salida, open(f'{SAL}/narradora.json', 'w'), ensure_ascii=False, indent=1)
