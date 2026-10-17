# Genera la voz del video (Kokoro TTS, español latino) y la línea de tiempo.
import json, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

V = sys.argv[1]          # carpeta con el modelo
OUT = sys.argv[2]        # carpeta de salida
VOZ = sys.argv[3] if len(sys.argv) > 3 else "em_alex"
SR = 24000

# (id de escena, texto para la voz, pausa después en s)
LINEAS = [
    ("radio",   "¡Atención, atención! Aquí Base Centinela, llamando a todos los diez veintiocho. ¿Me copian?", 0.9),
    ("dona",    "Esta temporada de Jálouin y Día de Muertos, les dejé algo dulce: una dona para cada uno. ¡Disfrútenla, se la ganaron!", 0.6),
    ("cero",    "Pero fíjense bien: una dona tiene forma de cero. Y ese es nuestro número este mes: ¡cero siniestros!", 0.7),
    ("altar",   "Este octubre vamos por dos victorias: ganar el concurso de decoración de oficinas de Grupo Loma, ¡y cerrar el mes sin un solo siniestro!", 0.6),
    ("cabina",  "Cada alerta atendida a tiempo, cada llamada al operador, cada descanso respetado, es un diez veintiocho que regresa a casa con su familia.", 0.6),
    ("sustos",  "En la carretera, los únicos sustos permitidos son los de Jálouin. Trabajemos con apego a la seguridad vial: prevención, protocolo y cero excesos.", 0.7),
    ("lema",    "Porque un Centinela nunca descansa: siempre vigila, siempre protege. Desde la cabina, protegemos cada kilómetro.", 0.6),
    ("final",   "¡Vamos, equipo Centinela! ¡Este octubre, triunfamos!", 0.45),
    ("cambio",  "Cambio y fuera.", 0.0),
]

INICIO = 1.6   # segundos de intro (estática de radio) antes de la primera palabra
COLA = 3.2     # música después de la última palabra

k = Kokoro(V + "/kokoro-v1.0.onnx", V + "/voices-v1.0.bin")

def radio(x):
    # efecto de radio CB: pasa banda 350-3200 Hz + saturación suave
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= ((f > 350) & (f < 3200)).astype(float)
    y = np.fft.irfft(X, len(x))
    y = np.tanh(y * 3.2) / np.tanh(3.2)
    return y * 0.9

import re
PAUSA = {".": .32, "!": .32, "?": .38, ":": .16}
partes, linea_tiempo, t = [np.zeros(int(INICIO * SR))], [], INICIO
for escena, texto, pausa in LINEAS:
    # se sintetiza frase por frase para conocer el tiempo exacto de cada una
    frases = [f.strip() for f in re.findall(r"[^.!?:]+[.!?:]+", texto)]
    inicio_linea, segs = t, []
    for j, frase in enumerate(frases):
        s, sr = k.create(frase, voice=VOZ, speed=1.04, lang="es-419")
        s = s.astype(np.float32)
        idx = np.where(np.abs(s) > 0.01)[0]
        s = s[max(idx[0] - 240, 0): idx[-1] + 480]
        if escena in ("radio", "cambio"):
            s = radio(s)
        dur = len(s) / SR
        segs.append({"texto": frase, "inicio": round(t, 3), "fin": round(t + dur, 3)})
        partes.append(s); t += dur
        if j < len(frases) - 1:
            p = PAUSA[frase[-1]]
            partes.append(np.zeros(int(p * SR))); t += p
    linea_tiempo.append({"escena": escena, "inicio": round(inicio_linea, 3), "fin": round(t, 3), "texto": texto, "frases": segs})
    partes.append(np.zeros(int(pausa * SR))); t += pausa
partes.append(np.zeros(int(COLA * SR)))
voz = np.concatenate(partes)
voz = voz / np.max(np.abs(voz)) * 0.89
sf.write(OUT + "/voz.wav", voz, SR)
total = len(voz) / SR
json.dump({"total": round(total, 3), "lineas": linea_tiempo}, open(OUT + "/timeline.json", "w"), indent=1, ensure_ascii=False)
print("total", round(total, 2))
for l in linea_tiempo: print(l["escena"], l["inicio"], l["fin"], [(f["inicio"], f["texto"][:18]) for f in l["frases"]])
