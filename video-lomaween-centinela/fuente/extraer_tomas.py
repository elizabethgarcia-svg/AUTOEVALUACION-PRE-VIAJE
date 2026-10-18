# Extrae las tomas reales del video "Proyecto Centinela" (grabación de pantalla por WhatsApp)
# como secuencias JPG a 30 fps para la animación. Uso: python3 extraer_tomas.py video.mp4 img/real
import subprocess, sys, json, os
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
# (id, inicio, duración, velocidad)
CLIPS = {
  "carretera": [("troca", 6.0, 3.2, 1)],
  "equipo": [("m1", 92.1, 3.0, 1), ("m2", 124.0, 3.2, 1), ("m3", 95.6, 1.4, 1), ("m4", 174.4, 2.2, 1),
             ("m5", 180.4, 2.4, 1), ("m6", 17.4, 3.0, 1), ("m7", 183.0, 0.6, .5)],
  "alertas": [("a1", 113.4, 2.0, 1), ("a2", 116.0, 1.9, 1), ("a3", 12.4, 2.9, 1), ("a4", 95.6, 1.4, 1)],
}
# recorte del área del monitor (sin bisel ni barra de tareas), escala a 720p y un poco de color/nitidez
VF = "crop=800:450:100:52,scale=1280:720:flags=lanczos,eq=contrast=1.07:saturation=1.15:brightness=0.01,unsharp=5:5:0.5"
man = {}
for esc, lista in CLIPS.items():
    man[esc] = []
    for cid, ini, dur, vel in lista:
        pts = f"setpts={1/vel}*PTS," if vel != 1 else ""
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", str(ini), "-t", str(dur), "-i", src,
                        "-vf", pts + "fps=30," + VF, "-q:v", "3", f"{out}/{cid}_%04d.jpg"], check=True)
        man[esc].append([cid, len([f for f in os.listdir(out) if f.startswith(cid + "_")])])
open("clips.js", "w").write("const CLIPS = " + json.dumps(man) + ";")
