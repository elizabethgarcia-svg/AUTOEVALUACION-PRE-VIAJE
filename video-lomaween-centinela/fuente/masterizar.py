# Masterización final: sube la mezcla a -16 LUFS con ganancia pareja y un limitador con anticipación
# (pico real máximo -1.5 dBTP), sin el modo dinámico que hace «respirar» el sonido.
import sys, numpy as np, soundfile as sf, pyloudnorm as pyln
from scipy.signal import resample_poly
from scipy.ndimage import minimum_filter1d
ent, sal = sys.argv[1], sys.argv[2]
x, sr = sf.read(ent)
if x.ndim == 1: x = x[:, None]
x = resample_poly(x, 48000, sr, axis=0); sr = 48000
lufs = pyln.Meter(sr).integrated_loudness(x)
x = x * 10 ** ((-16.0 - lufs) / 20)
techo = 10 ** (-1.7 / 20)
# pico real: envolvente con sobremuestreo x4
env = np.abs(resample_poly(x, 4, 1, axis=0)).max(1).reshape(-1, 4).max(1)[:len(x)]
env = np.pad(env, (0, len(x) - len(env)), mode='edge')
g0 = np.minimum(1, techo / (env + 1e-9))
L = int(.005 * sr) | 1
g = minimum_filter1d(g0, L, origin=-(L // 2), mode='nearest')
a = np.exp(-1 / (.08 * sr)); out = np.empty_like(g); v = 1.0
for i, gi in enumerate(g):
    v = gi if gi < v else a * v + (1 - a) * gi
    out[i] = v
k = int(.001 * sr) | 1; out = np.convolve(np.pad(out, k // 2, mode='edge'), np.ones(k) / k, mode='valid')
y = x * np.minimum(out, g0)[:, None]
sf.write(sal, y.astype(np.float32), sr, subtype='FLOAT')
print('antes %.1f LUFS → ahora %.1f LUFS; limitador activo en %.2f %% del tiempo' % (lufs, pyln.Meter(sr).integrated_loudness(y), 100 * np.mean(np.minimum(out, g0) < .999)))
