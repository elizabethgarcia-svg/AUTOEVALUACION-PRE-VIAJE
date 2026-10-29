# Califica cada toma completa de cada frase: que diga el guion, que exprese (variación de tono e intensidad),
# que el ritmo vaya con la emoción de la frase y que no traiga golpes. Imprime la tabla y la elegida.
import json, re, unicodedata, difflib, numpy as np, soundfile as sf, librosa, sherpa_onnx
from scipy.signal import butter, sosfiltfilt
from scipy.ndimage import median_filter
D, M = 'notas_29', 'asr/sherpa-onnx-whisper-small'
A, B, C = '8.03.01_AM', '8.06.41_AM', '8.14.47_AM'
CAND = {
 3: [[(A, 4.2, 15.7)], [(A, 18.4, 28.7)]],
 4: [[(A, 30.6, 37.4), (A, 38.6, 45.2)], [(A, 47.3, 61.2)]],
 5: [[(A, 63.8, 85.8)], [(A, 87.6, 109.8)]],
 6: [[(A, 111.5, 131.2)]],
 7: [[(B, 2.6, 9.4), (B, 10.6, 12.5)], [(B, 14.7, 24.9)]],
 8: [[(B, 26.5, 36.9)], [(B, 39.8, 50.9)]],
 9: [[(B, 52.7, 58.9), (B, 60.4, 64.4)], [(B, 66.2, 72.1), (B, 73.3, 77.5)]],
 10: [[(B, 81.5, 102.6)], [(C, 5.0, 18.7), (C, 19.9, 21.1), (C, 22.2, 27.0)], [(C, 30.5, 53.5)]],
 11: [[(C, 58.4, 68.6)], [(C, 70.3, 79.3)], [(C, 92.1, 102.7)]],
 12: [[(C, 105.5, 110.3)], [(C, 113.1, 118.1)], [(C, 121.4, 127.3)], [(C, 130.6, 138.5)]],
 13: [[(C, 141.1, 147.6), (C, 148.8, 156.1)], [(C, 159.8, 172.6)], [(C, 174.6, 187.7)]],
 16: [[(C, 190.9, 199.7)], [(C, 206.9, 209.6), (C, 210.8, 212.0), (C, 213.2, 218.0)], [(C, 221.4, 231.6)], [(C, 234.7, 238.9), (C, 240.2, 244.8)]],
}
# qué pide cada frase: +1 = más energía y movimiento, -1 = más suave y pausada, 0 = natural
EMO = {3: -.5, 4: 0, 5: 1, 6: 0, 7: 0, 8: 0, 9: .5, 10: 0, 11: 1, 12: -1, 13: -1, 16: -1}
src = open('build3/voces_preparar.py').read(); G = eval(src[src.index('GUION = {') + 8:src.index('rec = sherpa_onnx')].strip())
def norm(w):
    w = ''.join(c for c in unicodedata.normalize('NFD', w.lower()) if c.isalnum() and unicodedata.category(c) != 'Mn')
    w = re.sub(r'c([ei])', r's\1', w).replace('z', 's').replace('v', 'b').replace('ll', 'y').replace('h', '')
    return re.sub(r'm([pb])', r'n\1', w)
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{M}/small-encoder.onnx', decoder=f'{M}/small-decoder.onnx', tokens=f'{M}/small-tokens.txt', language='es', task='transcribe', num_threads=4)
notas = {h: sf.read(f'{D}/nota_{h}.wav', dtype='float32')[0].astype(float) for h in (A, B, C)}
SR = 48000
def armar(piezas):
    partes = []
    for k, (h, a, b) in enumerate(piezas):
        if k: partes.append(np.zeros(int(.4 * SR)))
        partes.append(notas[h][int((a - .05) * SR): int((b + .1) * SR)])
    return np.concatenate(partes)
def asr(x):
    y = librosa.resample(x.astype(np.float32), orig_sr=SR, target_sr=16000)
    if len(y) > 29 * 16000:
        m = len(y) // 2; t = []
        for s in (y[:m], y[m:]):
            st = rec.create_stream(); st.accept_waveform(16000, s); rec.decode_stream(st); t.append(st.result.text)
        return ' '.join(t)
    st = rec.create_stream(); st.accept_waveform(16000, y); rec.decode_stream(st); return st.result.text
res = {}
for n, cands in CAND.items():
    g = [norm(w) for w in G[n].split() if norm(w)]
    filas = []
    for i, piezas in enumerate(cands):
        x = armar(piezas); txt = asr(x); a = [norm(w) for w in txt.split() if norm(w)]
        sm = difflib.SequenceMatcher(None, g, a); acierto = sum(b.size for b in sm.get_matching_blocks()) / len(g)
        y = librosa.resample(x.astype(np.float32), orig_sr=SR, target_sr=16000)
        f0, vf, _ = librosa.pyin(y, fmin=110, fmax=520, sr=16000, frame_length=1024, hop_length=160)
        st = 12 * np.log2(f0[vf] / 100)
        tono_rango = np.percentile(st, 90) - np.percentile(st, 10); tono_mov = np.std(np.diff(st)) if len(st) > 2 else 0
        hop = 480; F = len(x) // hop; db = 20 * np.log10(np.sqrt((x[:F * hop].reshape(F, hop) ** 2).mean(1)) + 1e-9)
        voz = db > np.percentile(db, 95) - 30; intens = np.std(db[voz]); nivel = np.percentile(db[voz], 90)
        habla = sum(b - a for _, a, b in piezas); vel = len(g) / habla
        h = sosfiltfilt(butter(4, 4000, 'highpass', fs=SR, output='sos'), x); hp = int(.001 * SR); m = len(h) // hp
        pk = np.abs(h[:m * hp]).reshape(m, hp).max(1) + 1e-9; clics = int(np.sum(20 * np.log10(pk / median_filter(pk, size=61, mode='nearest')) > 24))
        filas.append(dict(toma=i + 1, piezas=piezas, texto=txt.strip(), acierto=round(acierto, 2), tono_rango=round(tono_rango, 1), tono_mov=round(float(tono_mov), 2),
                          intensidad=round(float(intens), 1), nivel=round(float(nivel), 1), palabras_seg=round(vel, 2), clics=clics))
    # calificación dentro de la frase
    def z(k):
        v = np.array([f[k] for f in filas], float); return (v - v.mean()) / (v.std() + 1e-9) if len(v) > 1 else v * 0
    expr = z('tono_rango') + .6 * z('tono_mov') + .5 * z('intensidad')
    emo = EMO[n] * (z('nivel') + z('palabras_seg'))  # +: más energía y rapidez; -: más suave y pausada
    cal = expr + emo - .4 * z('clics') + 6 * np.array([f['acierto'] for f in filas])
    mejor_acierto = max(f['acierto'] for f in filas)
    for f, c in zip(filas, cal): f['calificacion'] = round(float(c), 2) if f['acierto'] >= mejor_acierto - .04 else None
    elegida = max((f for f in filas if f['calificacion'] is not None), key=lambda f: f['calificacion'])
    res[n] = {'tomas': filas, 'elegida': elegida['toma']}
    print(f'\nFRASE {n}  (pide {"más energía" if EMO[n] > 0 else "suave y pausada" if EMO[n] < 0 else "natural"})')
    for f in filas:
        print(f"  {'★' if f['toma'] == elegida['toma'] else ' '} toma {f['toma']}: acierto {f['acierto']:.2f}  tono {f['tono_rango']:4.1f} st  mov {f['tono_mov']:.2f}  intens {f['intensidad']:4.1f}  "
              f"nivel {f['nivel']:5.1f}  {f['palabras_seg']:.2f} pal/s  clics {f['clics']:3d}  → {f['calificacion']}  | {f['texto'][:70]}")
json.dump(res, open(f'{D}/eleccion.json', 'w'), ensure_ascii=False, indent=1, default=str)
