# Mide cada toma candidata: dónde empieza y acaba la voz, pausas, volumen, ruido de fondo, expresividad, y la vuelve a transcribir.
import sys, json, numpy as np, soundfile as sf, librosa, sherpa_onnx
B = '/tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/'
M = B + 'asr/sherpa-onnx-whisper-small'
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{M}/small-encoder.onnx', decoder=f'{M}/small-decoder.onnx', tokens=f'{M}/small-tokens.txt', language='es', task='transcribe', num_threads=4)
C = json.load(open(sys.argv[1])); solo = sys.argv[2].split(',') if len(sys.argv) > 2 else None
out = {}
for clave, lista in C.items():
    if solo and clave not in solo: continue
    for clip, a, b in lista:
        x, sr = sf.read(f'{B}jurado_clips/wavall/{clip}.wav'); seg = x[int(a * sr):int(b * sr)]
        hop = 160; n = len(seg) // hop
        db = 20 * np.log10(np.sqrt(np.mean(seg[:n * hop].reshape(n, hop) ** 2, 1)) + 1e-9)
        piso = np.percentile(db, 8); alto = np.percentile(db, 97)
        v = db > max(piso + 10, alto - 28)
        idx = np.where(v)[0]
        if not len(idx): continue
        ini, fin = idx[0] * .01, idx[-1] * .01 + .01
        # pausas internas
        pausas = []; k = idx[0]
        for i in idx[1:]:
            if (i - k) * .01 > .35: pausas.append(round((i - k) * .01, 2))
            k = i
        voz = seg[int(ini * sr):int(fin * sr)]
        f0, vf, _ = librosa.pyin(voz.astype(float), fmin=70, fmax=400, sr=sr, frame_length=1024)
        f0 = f0[vf & ~np.isnan(f0)]
        st = 12 * np.log2(f0 / np.median(f0)) if len(f0) > 5 else np.array([0])
        st_ = rec.create_stream(); st_.accept_waveform(sr, seg[int(max(0, ini - .1) * sr):int((fin + .15) * sr)].astype(np.float32)); rec.decode_stream(st_)
        r = dict(clip=clip, ini=round(a + ini, 2), fin=round(a + fin, 2), dur=round(fin - ini, 2), pausa_max=max(pausas) if pausas else 0,
                 n_pausas=len(pausas), nivel=round(alto, 1), snr=round(alto - piso, 1), rango_st=round(float(np.percentile(st, 95) - np.percentile(st, 5)), 1),
                 texto=st_.result.text.strip())
        out.setdefault(clave, []).append(r)
        print(clave, json.dumps(r, ensure_ascii=False), flush=True)
json.dump(out, open(sys.argv[1].replace('.json', '_res.json'), 'w'), ensure_ascii=False, indent=1)
