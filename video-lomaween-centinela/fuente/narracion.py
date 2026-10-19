# Voz del video "La entrega más importante" (Kokoro TTS, español latino) + línea de tiempo por frase.
import json, re, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

V, OUT = sys.argv[1], sys.argv[2]
VOZ = sys.argv[3] if len(sys.argv) > 3 else "ef_dora"  # una voz o mezcla, p. ej. "ef_dora:0.6+if_sara:0.4"
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
    ("alertas", "Nuestras pantallas nos avisan si un tráiler va demasiado rápido, si el operador tiene sueño, o si se distrae con el celular.", 1.0, None),
    ("cabina",  "Entonces llamamos: ¿cómo vas, compañero? A veces, solo necesita descansar un poco. Y eso también es cuidarlo.", 1.3, None),
    ("rescate", "Y si algo pasa en el camino, nuestros Rescates Carreteros salen de inmediato a ayudar. Porque en esta familia, nadie se queda solo en la carretera.", 1.3, None),
    ("mensaje", "Pero el cuidado más importante empieza en casa. Por eso hoy te pedimos algo muy especial: cuando abraces a papá o a mamá, recuérdale tres cosas. Maneja con calma. Descansa cuando tengas sueño. Y el celular, guardado.", 1.2, None),
    ("mini",    "Desde hoy, tú también eres un Mini Centinela. Tu misión es recordárselo cada vez que salga de casa.", 1.2, None),
    ("razon",   "Y dile que tú eres su razón más grande para regresar.", 1.6, None),
    ("cierre",  "Recordamos a quienes se fueron, y cuidamos a quienes regresan. Desde la cabina, protegemos cada kilómetro, para que cada noche, la familia esté completa.", 1.6, None),
    ("despedida", "¡Gracias por acompañarme, Mini Centinelas! No olviden su misión: con calma, con descanso, y el celular, guardado. ¡Nos vemos en la carretera!", 2.2, TROCA),
    ("cambio",  "Base Centinela a todas las familias: gracias por cuidarlos con nosotros. Cambio y fuera.", 2.0, RADIO),
    ("final",   "Porque el viaje más importante es el regreso a casa, donde pueden sentir el calor de quienes más los necesitan.", 0.0, None),
]

def efecto_radio(x):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= ((f > 350) & (f < 3200)).astype(float)
    y = np.fft.irfft(X, len(x))
    return np.tanh(y * 3.2) / np.tanh(3.2) * 0.9

# Tratamiento de locución para la Narradora: calidez, presencia, compresión suave y un poco de sala
from scipy.signal import lfilter, butter, sosfilt
def biquad(tipo, f0, g_db, q=.8):
    A, w = 10 ** (g_db / 40), 2 * np.pi * f0 / SR; al = np.sin(w) / (2 * q); c = np.cos(w)
    if tipo == "pico":
        b = [1 + al * A, -2 * c, 1 - al * A]; a = [1 + al / A, -2 * c, 1 - al / A]
    else:  # estante agudo
        r = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) + (A - 1) * c + r), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - r)]
        a = [(A + 1) - (A - 1) * c + r, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - r]
    return np.array(b) / a[0], np.array(a) / a[0]
EQ = [biquad("pico", 180, 2.0), biquad("pico", 450, -1.5, 1.0), biquad("pico", 3200, 2.5, .9), biquad("estante", 9000, 1.5)]
HP = butter(2, 80, "highpass", fs=SR, output="sos")
def comprimir(x, umbral_db=-22, ratio=2.6, ataque=.006, suelta=.09):
    e = np.abs(x); a1, a2 = np.exp(-1 / (ataque * SR)), np.exp(-1 / (suelta * SR)); env = np.zeros_like(e); g = 0.0
    for i, v in enumerate(e):
        g = a1 * g + (1 - a1) * v if v > g else a2 * g + (1 - a2) * v
        env[i] = g
    exceso = np.maximum(0, 20 * np.log10(env + 1e-9) - umbral_db)
    return x * 10 ** (-(exceso - exceso / ratio) / 20)
def locutora(x):
    y = sosfilt(HP, x)
    for b, a in EQ: y = lfilter(b, a, y)
    return (comprimir(y) * 1.25).astype(np.float32)
_r = np.random.default_rng(7); _n = int(.38 * SR)
IR = _r.standard_normal(_n) * np.exp(-np.arange(_n) / (.075 * SR)); IR = np.concatenate([np.zeros(int(.012 * SR)), IR / np.sqrt(np.sum(IR ** 2))])

def voz_kokoro(v):
    if "+" not in v and ":" not in v: return v
    return sum(float(p.split(":")[1]) * k.get_voice_style(p.split(":")[0]) for p in v.split("+"))

PAUSA = {".": .75, "!": .6, "?": .7, ":": .35}
INICIO, COLA = 1.6, 9.0

k = Kokoro(V + "/kokoro-v1.0.onnx", V + "/voices-v1.0.bin")
VOZN = voz_kokoro(VOZ)
partes, tl, t = [np.zeros(int(INICIO * SR))], [], INICIO
narr = []  # (muestra inicial, audio) de la Narradora, para la sala
for escena, texto, pausa, voz_l in LINEAS:
    frases = [f.strip() for f in re.findall(r"[^.!?:]+[.!?:]+", texto)]
    ini, segs = t, []
    for j, frase in enumerate(frases):
        s, sr = k.create(frase, voice=voz_l or VOZN, speed=(0.98 if voz_l == TROCA else 1.0) if voz_l else VEL, lang="es-419")
        s = s.astype(np.float32)
        idx = np.where(np.abs(s) > 0.01)[0]
        s = s[max(idx[0] - 240, 0): idx[-1] + 600]
        if voz_l == RADIO: s = efecto_radio(s)
        if voz_l is None: s = locutora(s); narr.append((int(round(t * SR)), s))
        dur = len(s) / SR
        segs.append({"texto": frase, "inicio": round(t, 3), "fin": round(t + dur, 3)})
        partes.append(s); t += dur
        if j < len(frases) - 1:
            p = PAUSA[frase[-1]]; partes.append(np.zeros(int(p * SR))); t += p
    tl.append({"escena": escena, "inicio": round(ini, 3), "fin": round(t, 3), "texto": texto, "frases": segs, "voz": "radio" if voz_l == RADIO else "troca" if voz_l == TROCA else "narradora"})
    partes.append(np.zeros(int(pausa * SR))); t += pausa
partes.append(np.zeros(int(COLA * SR)))
voz = np.concatenate(partes)
if narr:  # sala corta solo para la Narradora
    seca = np.zeros_like(voz)
    for i0, s in narr: seca[i0:i0 + len(s)] += s[:len(seca) - i0]
    voz = voz + np.convolve(seca, IR)[:len(voz)] * 0.09
voz = voz / np.max(np.abs(voz)) * 0.89
sf.write(OUT + "/voz.wav", voz, SR)
total = len(voz) / SR
json.dump({"total": round(total, 3), "lineas": tl}, open(OUT + "/timeline.json", "w"), indent=1, ensure_ascii=False)
print("total", round(total, 2))
for l in tl: print(l["escena"], l["inicio"], l["fin"], [(f["inicio"], f["texto"][:22]) for f in l["frases"]])
