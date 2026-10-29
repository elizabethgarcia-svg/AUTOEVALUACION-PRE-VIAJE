# Voz del video "La entrega más importante" (Kokoro TTS, español latino) + línea de tiempo por frase.
import json, os, re, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

V, OUT = sys.argv[1], sys.argv[2]
VOZ = sys.argv[3] if len(sys.argv) > 3 else "ef_dora"
VEL = float(sys.argv[4]) if len(sys.argv) > 4 else 0.92
SR = 24000

# (escena, texto, pausa después en s, voz) — "radio" usa la voz de Base Centinela con filtro de radio
RADIO = "em_alex"
TROCA = "em_santa"
LINEAS = [
    ("bienvenida", "¡Hola, hola, amiguitos! Yo soy el ocho setenta y siete. Bienvenidos al área de Blindaje Centinela, donde desde la cabina cuidamos cada kilómetro. ¡Súbanse conmigo, vamos a dar un recorrido para que conozcan lo que hacemos!", 3.9, TROCA),
    ("radio",   "¡Atención, atención! Aquí Base Centinela, llamando a todas las familias de nuestros diez veintiocho. ¿Nos copian?", 1.6, RADIO),
    ("espera",  "Cada noche, en muchas casas de nuestra gran familia Grupo Loma, alguien mira por la ventana, esperando a que papá o mamá regrese de la carretera.", 1.5, None),
    ("camino",  "En Día de Muertos, los pétalos de cempasúchil marcan el camino de regreso a casa. En la cabina Centinela, nosotros también cuidamos ese camino, kilómetro a kilómetro.", 1.3, None),
    ("equipo",  "Somos los Centinelas: un equipo que, desde una cabina llena de pantallas, acompaña a cada operador en su viaje, de día y de noche. Centinelas de Ruta, Centinelas de Seguridad y Rescates Carreteros: siempre atentos, siempre listos.", 1.2, None),
    ("descanso", "Y para manejar seguro, lo más importante es descansar. Dormir sus horas completas, hacer pausas en el camino, y si le da sueño, detenerse en un lugar seguro. Porque un operador descansado es un operador seguro.", 1.2, None),
    ("alertas", "Nuestras pantallas nos avisan si un tráiler va demasiado rápido, y si el operador tiene sueño, o si se distrae con el celular.", 1.0, None),
    ("cabina",  "Entonces llamamos: ¿cómo vas, compañero? A veces, solo necesita descansar un poco. Y eso también es cuidarlo.", 1.3, None),
    ("rescate", "Y si algo pasa en el camino, nuestros Rescates Carreteros salen de inmediato a ayudar. Porque en esta familia, nadie se queda solo en la carretera.", 1.3, None),
    ("mensaje", "Pero el cuidado más importante empieza en casa. Por eso hoy te pedimos algo muy especial: cuando abraces a papá o a mamá, recuérdale tres cosas. Maneja con calma. Descansa cuando tengas sueño. Y el celular, guárdalo.", 1.2, None),
    ("mini",    "Desde hoy, tú también eres un Mini Centinela. Tu misión es recordárselo cada vez que salga de casa.", 1.2, None),
    ("razon",   "Y dile que tú eres su razón más grande para regresar.", 1.6, None),
    ("cierre",  "Recordemos a quienes se fueron, y cuidemos a quienes regresan. Desde la cabina, protegemos cada kilómetro, para que cada noche, la familia esté completa.", 1.6, None),
    ("despedida", "¡Gracias por acompañarme, Mini Centinelas! No olviden su misión: con calma, con descanso, y el celular, guardado. ¡Nos vemos en la carretera!", 2.2, TROCA),
    ("cambio",  "Base Centinela a todas las familias: gracias por cuidarlos con nosotros. Cambio y fuera.", 2.0, RADIO),
    ("final",   "Porque el viaje más importante es el regreso a casa, donde pueden sentir el calor de quienes más los necesitan.", 0.0, None),
]

# Grabaciones reales de la Narradora (voces/frase_NN.wav, preparadas con voces_preparar.py): reemplazan a la voz sintética
GRAB = json.load(open(OUT + "/voces/narradora.json")) if os.path.exists(OUT + "/voces/narradora.json") else {}
FRASE = {"espera": 3, "camino": 4, "equipo": 5, "descanso": 6, "alertas": 7, "cabina": 8, "rescate": 9, "mensaje": 10, "mini": 11, "razon": 12, "cierre": 13, "final": 16}

def efecto_radio(x):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= ((f > 350) & (f < 3200)).astype(float)
    y = np.fft.irfft(X, len(x))
    return np.tanh(y * 2.0) / np.tanh(2.0) * 0.70  # un poco abajo de la Narradora, con menos saturación
PAUSA = {".": .75, "!": .6, "?": .7, ":": .35}
INICIO, COLA = 1.6, 9.0

k = Kokoro(V + "/kokoro-v1.0.onnx", V + "/voices-v1.0.bin")
partes, tl, t = [np.zeros(int(INICIO * SR))], [], INICIO
for escena, texto, pausa, voz_l in LINEAS:
    g = GRAB.get(str(FRASE.get(escena))) if voz_l is None else None
    if g:
        s, sr = sf.read(OUT + "/voces/" + g["archivo"], dtype="float32"); assert sr == SR
        segs = [{"texto": f["texto"], "inicio": round(t + f["inicio"], 3), "fin": round(t + f["fin"], 3)} for f in g["frases"]]
        partes.append(s); ini = t; t += len(s) / SR
        tl.append({"escena": escena, "inicio": round(ini, 3), "fin": round(t, 3), "texto": texto, "frases": segs, "voz": "narradora", "grabada": True})
        pausa *= .65  # entre frases de la Narradora, respiros más cortos para que el video no se alargue
        partes.append(np.zeros(int(pausa * SR))); t += pausa
        continue
    frases = [f.strip() for f in re.findall(r"[^.!?:]+[.!?:]+", texto)]
    ini, segs = t, []
    for j, frase in enumerate(frases):
        s, sr = k.create(frase, voice=voz_l or VOZ, speed=(0.98 if voz_l == TROCA else 1.0) if voz_l else VEL, lang="es-419")
        s = s.astype(np.float32)
        idx = np.where(np.abs(s) > 0.01)[0]
        s = s[max(idx[0] - 240, 0): idx[-1] + 600]
        if voz_l == RADIO: s = efecto_radio(s)
        if voz_l == TROCA: s = s * 1.13  # ~-21.5 LUFS
        dur = len(s) / SR
        segs.append({"texto": frase, "inicio": round(t, 3), "fin": round(t + dur, 3)})
        partes.append(s); t += dur
        if j < len(frases) - 1:
            p = PAUSA[frase[-1]]; partes.append(np.zeros(int(p * SR))); t += p
    tl.append({"escena": escena, "inicio": round(ini, 3), "fin": round(t, 3), "texto": texto, "frases": segs, "voz": "radio" if voz_l == RADIO else "troca" if voz_l == TROCA else "narradora"})
    partes.append(np.zeros(int(pausa * SR))); t += pausa
partes.append(np.zeros(int(COLA * SR)))
voz = np.concatenate(partes); voz = voz / np.max(np.abs(voz)) * 0.89
sf.write(OUT + "/voz.wav", voz, SR)
total = len(voz) / SR
json.dump({"total": round(total, 3), "lineas": tl}, open(OUT + "/timeline.json", "w"), indent=1, ensure_ascii=False)
print("total", round(total, 2))
for l in tl: print(l["escena"], l["inicio"], l["fin"], [(f["inicio"], f["texto"][:22]) for f in l["frases"]])
