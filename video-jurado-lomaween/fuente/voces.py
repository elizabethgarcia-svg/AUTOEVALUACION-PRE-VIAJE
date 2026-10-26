# Voces de radio de la muestra (Base Centinela, Kokoro TTS con efecto de radio). En la versión final las graba "La Base".
import numpy as np, soundfile as sf, json
from kokoro_onnx import Kokoro
SR = 24000
k = Kokoro("video/kokoro-v1.0.onnx", "video/voices-v1.0.bin")
def radio(x):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= ((f > 350) & (f < 3200)).astype(float)
    y = np.fft.irfft(X, len(x)); return np.tanh(y * 3.2) / np.tanh(3.2) * 0.6
LINEAS = {
    "r0": "Base Centinela a todas las unidades… ¿me copian?",
    "r1": "Unidad Blindaje Centinela, salida diecinueve de octubre. Destino: LOMAween.",
    "r2": "Base Centinela a Trabajo en Equipo, ¿me copias?",
    "r3": "Base Centinela a Pasión, ¿me copias?",
    "r4": "Base Centinela a Enfoque a Resultados, ¿me copias?",
    "r5": "Unidad Blindaje Centinela: llegó a destino. Cambio y fuera.",
}
dur = {}
for key, txt in LINEAS.items():
    s, sr = k.create(txt, voice="em_alex", speed=1.0, lang="es-419")
    s = radio(np.asarray(s, dtype=np.float32)); sf.write(f"jurado/muestra/aud/{key}.wav", s, SR); dur[key] = round(len(s) / SR, 2)
json.dump(dur, open("jurado/muestra/aud/duraciones.json", "w")); print(dur)
