# Plano: los 4 letreros grandes colgados con nylon sobre los monitores (foto 14)
exec(open('deco/planos.py').read().split('# ---------- 1. papel picado ----------')[0])
P = 'imprimibles/png/'
O = 520  # recorte vertical de la foto
foto = Image.open(IMG + '14.webp').convert('RGBA').crop((0, O, 1100, 1240))
d = ImageDraw.Draw(foto, 'RGBA')
mon = [Image.open(P + f'mon-{i}.png').convert('RGBA') for i in range(1, 5)]

def colgar_letrero(im, x0, y0, ancho, techo, k=0):
    p = mon[k].resize((ancho, int(ancho * 672 / 1920)), Image.LANCZOS)
    s = Image.new('RGBA', p.size, (0, 0, 0, 0)); s.putalpha(p.split()[3].point(lambda v: int(v * .5)))
    im.alpha_composite(s.filter(ImageFilter.GaussianBlur(3)), (x0 + 4, y0 + 5))
    dd = ImageDraw.Draw(im, 'RGBA')
    for x in (x0 + int(ancho * .12), x0 + int(ancho * .88)): dd.line([(x, techo), (x, y0 + 2)], fill=(255, 255, 255, 210), width=2)
    im.alpha_composite(p, (x0, y0))
    return p.height

# A–C sobre la fila del cristal (cada vez más lejos), D sobre la isla de la derecha
pos = [(128, 800, 140, 590), (352, 768, 104, 588), (494, 744, 94, 590), (820, 742, 110, 600)]
alto = []
for k, (x, y, w, t) in enumerate(pos): alto.append(colgar_letrero(foto, x, y - O, w, t - O, k))
d = ImageDraw.Draw(foto, 'RGBA')
for k, (x, y, w, t) in enumerate(pos):
    cx = x + w // 2; cy = y - O + alto[k] + 26
    d.ellipse([cx - 20, cy - 20, cx + 20, cy + 20], fill=(255, 90, 0), outline='white', width=3)
    fn = f(24); d.text((cx - d.textlength('ABCD'[k], font=fn) / 2, cy - 15), 'ABCD'[k], font=fn, fill='white')
etiqueta(d, 30, 30, ['Cada letrero mide 2 hojas carta (51 × 18 cm)', 'y cuelga con 2 hilos de nylon de la rejilla,', 'a un palmo arriba del monitor'], 24)
im = foto.convert('RGB')

# leyenda con los 4 letreros en grande
W = im.width; HL = 520
ley = Image.new('RGB', (W, HL), (26, 14, 40)); e = ImageDraw.Draw(ley, 'RGBA')
donde = ['sobre el primer monitor de la fila del cristal', 'sobre el monitor del centro', 'sobre el monitor del fondo', 'sobre la isla de la derecha']
for k in range(4):
    x = 30 + (k % 2) * 535; y = 24 + (k // 2) * 214
    p = mon[k].resize((500, int(500 * 672 / 1920)), Image.LANCZOS); ley.paste(p, (x, y + 4), p)
    e.ellipse([x - 12, y - 8, x + 28, y + 32], fill=(255, 90, 0), outline='white', width=3)
    e.text((x + 8 - e.textlength('ABCD'[k], font=f(22)) / 2, y - 3), 'ABCD'[k], font=f(22), fill='white')
    e.text((x, y + 184), donde[k], font=f(17), fill=(220, 210, 235))
e.rounded_rectangle([20, HL - 70, W - 20, HL - 16], 12, fill=(120, 20, 40))
e.text((38, HL - 58), 'Nada de cinta en los monitores ni en la pared: solo nylon de la rejilla del techo', font=f(20), fill='white')
out = Image.new('RGB', (W, im.height + HL)); out.paste(im, (0, 0)); out.paste(ley, (0, im.height))
titulo(out, '3 · Letreros sobre los monitores', 'Como señales de carretera dentro de la cabina').save('deco/n3_monitores.jpg', quality=88)
print(out.size)
