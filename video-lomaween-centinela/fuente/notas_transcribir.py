# Corta las notas de voz nuevas por silencios largos y transcribe cada pedazo, para encontrar cada frase y sus repeticiones.
import sys, glob, json, numpy as np, soundfile as sf, sherpa_onnx
D, M = sys.argv[1], sys.argv[2]
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{M}/small-encoder.onnx', decoder=f'{M}/small-decoder.onnx', tokens=f'{M}/small-tokens.txt', language='es', task='transcribe', num_threads=4)
def tramos(x, sr, min_sil, min_voz=.25):
    hop = int(.01 * sr); n = len(x) // hop
    db = 20 * np.log10(np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, 1)) + 1e-9)
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
        if (j - i) * .01 >= min_voz: segs.append([round(i * .01, 2), round(j * .01, 2)])
        i = j
    return segs
out = {}
for f in sorted(glob.glob(f'{D}/nota_*.wav')):
    x, sr = sf.read(f, dtype='float32'); hora = f.split('nota_')[1][:-4]
    lista = []
    for a, b in tramos(x.astype(float), sr, 1.1):
        seg = x[int(max(0, a - .1) * sr): int((b + .15) * sr)]
        if len(seg) > 29 * sr:  # Whisper escucha hasta 30 s: se parte en dos
            mitad = len(seg) // 2; textos = []
            for s in (seg[:mitad], seg[mitad:]):
                st = rec.create_stream(); st.accept_waveform(sr, s); rec.decode_stream(st); textos.append(st.result.text.strip())
            txt = ' '.join(textos)
        else:
            st = rec.create_stream(); st.accept_waveform(sr, seg); rec.decode_stream(st); txt = st.result.text.strip()
        lista.append({'ini': a, 'fin': b, 'texto': txt}); print(f'{hora}  {a:6.1f}-{b:6.1f}  {txt}')
    out[hora] = lista
json.dump(out, open(f'{D}/transcripcion.json', 'w'), ensure_ascii=False, indent=1)
