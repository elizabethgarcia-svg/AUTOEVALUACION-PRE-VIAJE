# Transcribe cada clip del jurado por tramos de voz (Whisper small, español).
import re, sys, glob, json, os, numpy as np, soundfile as sf, sherpa_onnx
D, M = sys.argv[1], sys.argv[2]
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{M}/small-encoder.onnx', decoder=f'{M}/small-decoder.onnx', tokens=f'{M}/small-tokens.txt', language='es', task='transcribe', num_threads=int(os.environ.get('HILOS', 4)))
def tramos(x, sr, min_sil, min_voz=.25):
    hop = int(.01 * sr); n = len(x) // hop
    db = 20 * np.log10(np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, 1)) + 1e-9)
    umbral = max(np.percentile(db, 10) + 10, np.percentile(db, 95) - 30)
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
def dec(seg, sr):
    st = rec.create_stream(); st.accept_waveform(sr, seg); rec.decode_stream(st); return st.result.text.strip()
J = f'{D}/' + os.environ.get('SALIDA', 'transcripcion.json')
out = json.load(open(J)) if os.path.exists(J) else {}
hechos = set(out) | set(sys.argv[3].split(',') if len(sys.argv) > 3 else [])
for f in sorted(glob.glob(f'{D}/c*.wav')):
    x, sr = sf.read(f, dtype='float32'); n = os.path.basename(f)[:-4]
    if n in hechos or (os.environ.get('SOLO') and n not in os.environ['SOLO'].split(',')): continue
    lista = []
    for a, b in tramos(x.astype(float), sr, .7):
        seg = x[int(max(0, a - .1) * sr): int((b + .15) * sr)]
        txt = re.sub(r'(.{4,40}?)(\s*\1){3,}', r'\1…', dec(seg[:29 * sr], sr))
        lista.append({'ini': a, 'fin': b, 'texto': txt})
    out[n] = {'dur': len(x) / sr, 'tramos': lista}
    print(f'== {n} ({len(x)/sr:.1f}s)', flush=True)
    for t in lista: print(f'     {t["ini"]:5.1f}-{t["fin"]:5.1f} {t["texto"]}', flush=True)
    json.dump(out, open(J, 'w'), ensure_ascii=False, indent=1)
