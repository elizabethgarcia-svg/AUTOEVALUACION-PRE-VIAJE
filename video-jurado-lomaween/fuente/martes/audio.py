# Audio del video «Así se graba el martes»: la voz de cada escena sobre una marimba suave
import json, numpy as np, soundfile as sf
SR = 48000
largo = json.load(open('martes_video/aud/largo.json')); T = sum(largo) + .5
n = int(T * SR); voz = np.zeros(n); mus = np.zeros(n)
def a48(x, sr):  # 24 kHz → 48 kHz
    return np.interp(np.arange(len(x) * 2) / 2, np.arange(len(x)), x)
t0 = 0
for i, L in enumerate(largo):
    x, sr = sf.read(f'martes_video/aud/v{i:02d}.wav'); x = a48(x, sr)
    ini = int((t0 + (.9 if i == 0 else .4)) * SR); voz[ini:ini + len(x)] += x[:n - ini]
    t0 += L
# marimba: Lam - Fa - Do - Sol, 92 por minuto
def nota(f, d, v=1.0):
    t = np.arange(int(d * SR)) / SR
    return v * (np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 18)) * np.exp(-t * 5.5)
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
ACORDES = [[57, 60, 64], [53, 57, 60], [60, 64, 67], [55, 59, 62]]
pulso = 60 / 92 / 2; k = 0
while k * pulso < T:
    ac = ACORDES[(k // 8) % 4]; m = ac[[0, 1, 2, 1, 0, 2, 1, 2][k % 8]] + 12
    s = int(k * pulso * SR); x = nota(mid(m), 1.2, .55 if k % 2 == 0 else .38); mus[s:s + len(x)] += x[:n - s]
    if k % 8 == 0: b = nota(mid(ac[0] - 12), 2.6, .9); mus[s:s + len(b)] += b[:n - s]
    k += 1
mus = mus / np.abs(mus).max() * .11
env = np.ones(n); f = int(1.5 * SR); env[:f] = np.linspace(0, 1, f); env[-f * 2:] = np.linspace(1, 0, f * 2)
mez = voz + mus * env
mez = mez / np.abs(mez).max() * .93
sf.write('martes_video/aud/mezcla.wav', mez.astype(np.float32), SR); print(round(T, 2), 's')
