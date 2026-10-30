# Hace una hoja con 5 cuadros por toma: python3 tiras.py salida.jpg clip:ini:fin ...
import sys, subprocess, io
from PIL import Image, ImageDraw
B = '/tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/jurado_clips/'
mapa = dict(l.split() for l in open(B + 'mapa.txt'))
filas = []
for arg in sys.argv[2:]:
    clip, a, b = arg.split(':'); a, b = float(a), float(b)
    fila = Image.new('RGB', (256 * 5, 144))
    for k in range(5):
        t = a + (b - a) * k / 4
        png = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-ss', str(t), '-i', B + 'raw/' + mapa[clip], '-frames:v', '1', '-vf', 'scale=256:144', '-f', 'image2pipe', '-c:v', 'png', '-'], capture_output=True).stdout
        im = Image.open(io.BytesIO(png)).convert('RGB'); d = ImageDraw.Draw(im); d.rectangle((0, 0, 92, 14), fill='black'); d.text((3, 1), f'{clip} {t:.1f}', fill='yellow')
        fila.paste(im, (256 * k, 0))
    filas.append(fila)
o = Image.new('RGB', (1280, 144 * len(filas)))
for i, f in enumerate(filas): o.paste(f, (0, 144 * i))
o.save(sys.argv[1], quality=88)
