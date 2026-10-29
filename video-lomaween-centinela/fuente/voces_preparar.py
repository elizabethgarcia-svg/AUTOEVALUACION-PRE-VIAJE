# Prepara las grabaciones de la Narradora: toma elegida, sin "Frase N", reparación de picos recortados,
# filtro, sin golpes ni chasquidos, un poco más ágil (sin cambiar el tono), compresión suave, pausas internas
# cortas y volumen parejo. Alinea el guion con cada tramo de voz.
import json, re, difflib, glob, subprocess, unicodedata
import numpy as np, soundfile as sf, sherpa_onnx, pyloudnorm as pyln
from scipy.interpolate import CubicSpline
from scipy.signal import butter, sosfiltfilt, resample_poly
# Uso: python3 voces_preparar.py <carpeta con las notas de voz .ogg> <modelo whisper de sherpa-onnx> <salida> [velocidad]
import sys, os, tempfile
UP, M, SAL = sys.argv[1], sys.argv[2], sys.argv[3]
VEL = float(sys.argv[4]) if len(sys.argv) > 4 else 1.1  # 1.1 = 10 % más ágil (la que se usa), con el mismo tono de voz
SR0, SR = 48000, 24000
# frase -> ([(nota de voz, inicio, fin de la toma en s), ...], pausa interna máxima). Varias piezas = tomas unidas en una pausa.
TOMAS = {3: ([('11.45.40_PM', 4.44, 16.72)], .45), 4: ([('11.38.25_PM', 2.78, 15.46)], .45), 5: ([('11.47.21_PM', 4.18, 24.30)], .45),
         6: ([('11.48.58_PM', 5.00, 24.18)], .45), 7: ([('11.40.12_PM', 3.06, 13.66)], .45), 8: ([('11.40.33_PM', 4.46, 15.96)], .45),
         9: ([('11.41.24_PM', 3.96, 16.66)], .45),
         10: ([('8.00.00_AM', 7.44, 28.06), ('8.01.01_AM', 25.08, 27.50), ('8.00.00_AM', 31.86, 34.14)], .6),  # "tengas sueño" de la 2.ª toma
         11: ([('11.43.04_PM', 13.80, 22.74)], .45), 12: ([('7.57.12_AM', 6.48, 12.38)], .55), 13: ([('7.58.35_AM', 4.28, 19.20)], .45),
         16: ([('7.56.04_AM', 6.50, 15.06), ('7.55.31_AM', 15.60, 18.52)], .55)}  # final "los necesitan" de la 2.ª toma
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
def desgolpe(x, sr):
    """Quita golpes y explosiones de «p» y «b»: graves por debajo de 100 Hz fuera, y los graves (100-250 Hz)
    que de pronto suben más que la voz se bajan solo en ese instante."""
    x = sosfiltfilt(butter(4, 100, 'highpass', fs=sr, output='sos'), x)
    bajo = sosfiltfilt(butter(4, [100, 250], 'bandpass', fs=sr, output='sos'), x); resto = x - bajo
    hop = int(.005 * sr); n = len(x) // hop
    eb = np.sqrt(np.mean(bajo[:n * hop].reshape(n, hop) ** 2, 1)) + 1e-9
    er = np.sqrt(np.mean(resto[:n * hop].reshape(n, hop) ** 2, 1)) + 1e-9
    rel = 20 * np.log10(eb / er); voz = er > np.percentile(er, 60)
    base = np.median(rel[voz]) if np.any(voz) else np.median(rel)
    exceso = np.maximum(0, rel - (base + 6))
    exceso = np.convolve(exceso, np.ones(5) / 5, mode='same')  # suave, sin escalones
    g = np.repeat(10 ** (-exceso / 20), hop); g = np.pad(g, (0, len(x) - len(g)), constant_values=1)
    return resto + bajo * g, int(np.sum(exceso > 3) * .005 * 100) / 100

def suavizar_eses(x, sr, margen=9, maximo=8):
    """Baja las «s» que salen muy fuertes: los agudos (arriba de 4.5 kHz) que pasan de la voz menos `margen` dB
    se bajan lo que sobra, hasta `maximo` dB, solo en ese instante."""
    agudo = sosfiltfilt(butter(4, 4500, 'highpass', fs=sr, output='sos'), x); resto = x - agudo
    hop = int(.005 * sr); n = len(x) // hop
    ea = 20 * np.log10(np.sqrt(np.mean(agudo[:n * hop].reshape(n, hop) ** 2, 1)) + 1e-9)
    et = 20 * np.log10(np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, 1)) + 1e-9)
    voz = np.median(et[et > np.percentile(et, 60)])
    baja = np.minimum(np.maximum(0, ea - (voz - margen)), maximo)
    baja = np.convolve(baja, np.ones(4) / 4, mode='same')
    g = np.repeat(10 ** (-baja / 20), hop); g = np.pad(g, (0, len(x) - len(g)), constant_values=1)
    return resto + agudo * g

def limitador(y, sr, techo=.89, antes_ms=5, suelta_ms=60):
    """Limitador con anticipación: baja el volumen unos milisegundos antes de un pico y lo regresa despacio,
    en vez de aplastar la onda (que suena a tronido)."""
    from scipy.ndimage import minimum_filter1d
    g0 = np.minimum(1, techo / (np.abs(y) + 1e-9))       # lo que hace falta bajar en cada muestra
    L = int(antes_ms / 1000 * sr) | 1
    g = minimum_filter1d(g0, L, origin=-(L // 2), mode='nearest')  # empieza a bajar antes del pico
    a = np.exp(-1 / (suelta_ms / 1000 * sr)); out = np.empty_like(g); v = 1.0
    for i, gi in enumerate(g):
        v = gi if gi < v else a * v + (1 - a) * gi       # baja de inmediato, sube despacio
        out[i] = v
    k = int(.001 * sr) | 1; out = np.convolve(np.pad(out, k // 2, mode='edge'), np.ones(k) / k, mode='valid')
    return y * np.minimum(out, g0)

def quitar_estallidos(x, sr, umbral_db=6, max_ms=40):
    """Estallidos cortos (una «p» que revienta el micrófono, un golpe): picos de menos de `max_ms` que pasan
    `umbral_db` dB por encima de los picos normales de la voz (el 95 % más alto de la frase) se bajan a ese
    nivel, con rampas de 3 ms. Las sílabas normales no se tocan."""
    hop = int(.002 * sr); n = len(x) // hop
    pk = np.abs(x[:n * hop]).reshape(n, hop).max(1) + 1e-9
    ref = np.percentile(pk[pk > .01 * pk.max()], 95)
    marca = pk > ref * 10 ** (umbral_db / 20)
    g = np.ones(n); cuantos = 0; i = 0
    while i < n:
        if not marca[i]: i += 1; continue
        j = i
        while j < n and marca[j]: j += 1
        if (j - i) * 2 <= max_ms:
            a, b = max(0, i - 2), min(n, j + 2)
            g[a:b] = np.minimum(g[a:b], ref / pk[i:j].max()); cuantos += 1
        i = j
    gs = np.repeat(g, hop); k = int(.003 * sr); gs = np.convolve(gs, np.ones(k) / k, mode='same')
    gs = np.pad(gs, (0, len(x) - len(gs)), constant_values=1)[:len(x)]
    return x * np.minimum(gs, 1), cuantos

def periodicidad(x, sr, hop, W):
    """Qué tan «cantado» es cada cuadro (1 = voz con tono, 0 = soplido o ruido), por autocorrelación."""
    n = len(x) // hop; per = np.zeros(n); L = 1 << int(np.ceil(np.log2(2 * W)))
    lo, hi = int(sr / 400), int(sr / 80)
    for i in range(n):
        s = x[i * hop: i * hop + W]
        if len(s) < W or np.max(np.abs(s)) < 1e-5: continue
        s = (s - s.mean()) * np.hanning(W); X = np.fft.rfft(s, L); ac = np.fft.irfft(np.abs(X) ** 2)[:W]
        per[i] = ac[lo:hi].max() / (ac[0] + 1e-12)
    return per

def quitar_respiraciones(x, sr, bajar_db=18):
    """Respiraciones y chasquidos que quedan antes o después de las palabras (suenan como un «shhh» o un
    «rebobineo» al entrar la voz): los pedacitos sueltos sin voz se quitan, y las respiraciones pegadas
    a una frase se bajan `bajar_db` dB. Las «s» no se tocan (son más agudas) y se respetan 100 ms de
    consonante antes de cada palabra."""
    hop, W = int(.01 * sr), int(.03 * sr); n = len(x) // hop
    fr = x[:n * hop].reshape(n, hop); db = 20 * np.log10(np.sqrt(np.mean(fr ** 2, 1)) + 1e-12)
    S = np.abs(np.fft.rfft(fr * np.hanning(hop), axis=1)); f = np.fft.rfftfreq(hop, 1 / sr)
    cen = (S * f).sum(1) / (S.sum(1) + 1e-12)
    per = periodicidad(x, sr, hop, W)
    vivo = db > -90; vmed = np.median(db[vivo & (db > np.percentile(db[vivo], 40))])
    voz = (per > .5) & (db > vmed - 30)
    g = np.ones(n); quitados = bajados = 0
    def bajar(a, b, k):
        if b > a: g[a:b] = np.minimum(g[a:b], k)
    i = 0
    while i < n:
        if not vivo[i]: i += 1; continue
        j = i
        while j < n and vivo[j]: j += 1
        v = np.where(voz[i:j])[0]
        if len(v) < max(2, .15 * (j - i)) and (j - i) < 50:  # pedacito suelto sin voz: fuera
            bajar(i, j, 0); quitados += 1
        elif len(v):
            a, b = i + v[0], i + v[-1]
            if a - i > 14 and np.median(cen[i:a]) < 4500: bajar(i, a - 10, 10 ** (-bajar_db / 20)); bajados += 1
            if j - b > 20 and np.median(cen[b:j]) < 4500: bajar(b + 12, j, 10 ** (-bajar_db / 20)); bajados += 1
            # respiraciones en medio de una frase (pausa muy corta que no alcanzó a separarla)
            hueco = np.where(~voz[a:b])[0] + a; k = 0
            while k < len(hueco):
                m = k
                while m + 1 < len(hueco) and hueco[m + 1] == hueco[m] + 1: m += 1
                h0, h1 = hueco[k], hueco[m] + 1
                if h1 - h0 > 30 and np.median(cen[h0:h1]) < 4000: bajar(h0 + 8, h1 - 10, 10 ** (-bajar_db / 20)); bajados += 1
                k = m + 1
        i = j
    gs = np.convolve(np.repeat(g, hop), np.ones(int(.02 * sr)) / int(.02 * sr), mode='same')  # rampas de 20 ms
    gs = np.pad(gs, (0, len(x) - len(gs)), constant_values=1)[:len(x)]
    return x * gs, quitados, bajados

def ffmpeg_filtro(x, sr, af):
    """Pasa el audio por un filtro de ffmpeg (quitar chasquidos y cambiar la velocidad sin cambiar el tono)."""
    with tempfile.TemporaryDirectory() as d:
        sf.write(f'{d}/a.wav', x.astype(np.float32), sr, subtype='FLOAT')
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{d}/a.wav', '-af', af, '-ar', str(sr), '-c:a', 'pcm_f32le', f'{d}/b.wav'], check=True)
        y, _ = sf.read(f'{d}/b.wav'); return y.astype(np.float64)

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
        x = sosfiltfilt(lp, x); x, golpes = desgolpe(x, SR0); x, estallidos = quitar_estallidos(x, SR0)
        x = ffmpeg_filtro(x * .5, SR0, f'adeclick,atempo={VEL}') * 2
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
            fade = int(.015 * SR0); seg[:fade] *= np.linspace(0, 1, fade); seg[-fade:] *= np.linspace(1, 0, fade)
            nuevos.append([t + (s0 - s0p), t + (s0 - s0p) + (s1 - s0)])
            piezas.append(seg); t += len(seg) / SR0; prev_fin = s1p
    y = np.concatenate(piezas)
    y, sueltos, resp = quitar_respiraciones(y, SR0)
    y = comprimir(y, SR0)
    y = suavizar_eses(y, SR0)
    y = resample_poly(y, SR, SR0)
    # volumen parejo: sonoridad integrada de cada frase a -20.5 LUFS (un poco arriba del 877 y de la radio)
    y = y * 10 ** ((-20.5 - pyln.Meter(SR).integrated_loudness(y)) / 20)
    y = limitador(y, SR)  # los picos que queden arriba de 0.89 se bajan sin deformar la onda
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
    print(f"F{n:2d} {len(y)/SR:5.1f}s  picos {npicos:3d}  golpes {golpes:4.2f}s  ruidos sueltos {sueltos}  respiraciones {resp}  estallidos {estallidos}  " + ' | '.join(f"[{fz['inicio']:.1f}] {fz['texto']}" for fz in frases))
json.dump(salida, open(f'{SAL}/narradora.json', 'w'), ensure_ascii=False, indent=1)
