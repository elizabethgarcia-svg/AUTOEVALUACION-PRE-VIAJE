# Intercala el audio del recorrido del plan en la mezcla de la muestra 3 (31.5 s, +7 s)
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
A, INS, PRE = 31.5, 7.0, .3
o, sr = sf.read('mezcla2_norm.wav', dtype='float32')
p, sp = sf.read('plan_audio.wav', dtype='float32')
if sp != sr: p = resample_poly(p, sr // 100 if sr == 48000 else sr, sp // 100 if sp == 44100 else sp, axis=0).astype(np.float32)
ia = int(A * sr); n = int(INS * sr)
out = np.zeros((len(o) + n, 2), np.float32)
pre = o[:ia].copy(); f = int(.3 * sr); pre[-f:] *= np.linspace(1, 0, f)[:, None] ** 1.5
post = o[ia:].copy(); g = int(.05 * sr); post[:g] *= np.linspace(0, 1, g)[:, None]
out[:ia] = pre; out[ia + n:] = post
ref = np.sqrt(np.mean(o[int(24 * sr):ia] ** 2)); rp = np.sqrt(np.mean(p ** 2))
k = ref / rp * .5; i0 = int((A - PRE) * sr)
out[i0:i0 + len(p)] += p[: len(out) - i0] * k
print('ganancia', k, 'pico', np.max(np.abs(out)))
out = np.clip(out, -1, 1)
sf.write('mezcla4.wav', out, sr, subtype='PCM_16'); print(len(out) / sr)
