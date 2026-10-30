# Parte un tramo en ráfagas de voz (silencios de 0.2 s o más) y transcribe cada una, para cortar con precisión.
import sys, numpy as np, soundfile as sf, sherpa_onnx
B = '/tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/'
M = B + 'asr/sherpa-onnx-whisper-small'
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{M}/small-encoder.onnx', decoder=f'{M}/small-decoder.onnx', tokens=f'{M}/small-tokens.txt', language='es', task='transcribe', num_threads=4)
for arg in sys.argv[1:]:
    clip, a, b = arg.split(':'); a, b = float(a), float(b)
    x, sr = sf.read(f'{B}jurado_clips/wavall/{clip}.wav'); seg = x[int(a * sr):int(b * sr)]
    hop = 160; n = len(seg) // hop
    db = 20 * np.log10(np.sqrt(np.mean(seg[:n * hop].reshape(n, hop) ** 2, 1)) + 1e-9)
    v = db > max(np.percentile(db, 8) + 10, np.percentile(db, 97) - 28)
    rs = []; i = 0
    while i < n:
        if not v[i]: i += 1; continue
        j = i
        while True:
            while j < n and v[j]: j += 1
            k = j
            while k < n and not v[k]: k += 1
            if k < n and (k - j) < 20: j = k; continue
            break
        if j - i >= 8: rs.append((i, j))
        i = j
    print(f'--- {clip} {a}-{b}')
    for i, j in rs:
        s = seg[max(0, i * hop - 1600): j * hop + 2400].astype(np.float32)
        st = rec.create_stream(); st.accept_waveform(sr, s); rec.decode_stream(st)
        print(f'   {a + i * .01:6.2f}-{a + j * .01:6.2f}  {st.result.text.strip()}', flush=True)
