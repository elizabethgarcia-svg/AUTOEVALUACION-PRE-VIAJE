# Cuadros a tamaño real (1024x576) con rejilla cada 100 px para medir dónde difuminar: python3 rejilla.py salida.jpg clip:t ...
import sys, subprocess, io
from PIL import Image, ImageDraw
B = '/tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/jurado_clips/'
mapa = dict(l.split() for l in open(B + 'mapa.txt'))
ims = []
for arg in sys.argv[2:]:
    clip, t = arg.split(':')
    png = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-ss', t, '-i', B + 'raw/' + mapa[clip], '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'], capture_output=True).stdout
    im = Image.open(io.BytesIO(png)).convert('RGB'); d = ImageDraw.Draw(im)
    for x in range(0, im.width, 100): d.line((x, 0, x, im.height), fill=(255, 255, 0), width=1); d.text((x + 2, 2), str(x), fill='yellow')
    for y in range(0, im.height, 100): d.line((0, y, im.width, y), fill=(0, 255, 255), width=1); d.text((2, y + 2), str(y), fill='cyan')
    d.rectangle((0, im.height - 16, 120, im.height), fill='black'); d.text((3, im.height - 14), f'{clip} {t}', fill='white')
    ims.append(im.resize((im.width * 3 // 4, im.height * 3 // 4)))
w = ims[0].width; o = Image.new('RGB', (w * 2, ims[0].height * ((len(ims) + 1) // 2)))
for i, im in enumerate(ims): o.paste(im, ((i % 2) * w, (i // 2) * im.height))
o.save(sys.argv[1], quality=85)
