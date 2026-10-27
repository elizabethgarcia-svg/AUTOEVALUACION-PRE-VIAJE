# Voz de la guía para el video «Así se graba el martes» (Kokoro, voz ef_dora en español latino)
import json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro("video/kokoro-v1.0.onnx", "video/voices-v1.0.bin")
E = json.load(open("martes_video/escenas.json")); dur = []
for i, e in enumerate(E):
    s, sr = k.create(e["voz"], voice="ef_dora", speed=1.0, lang="es-419")
    s = np.asarray(s, np.float32); s = s / (np.abs(s).max() + 1e-6) * .89
    sf.write(f"martes_video/aud/v{i:02d}.wav", s, sr); dur.append(round(len(s) / sr, 2))
json.dump(dur, open("martes_video/aud/dur.json", "w")); print(dur, sum(dur))
