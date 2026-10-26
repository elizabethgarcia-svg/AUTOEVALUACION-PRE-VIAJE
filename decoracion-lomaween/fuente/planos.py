# Planos de decoración sobre las fotos reales: papel picado, tele y escritorios
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, random
IMG = '/tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/images/'
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def f(n): return ImageFont.truetype(F, n)
COL = [(230, 0, 126), (255, 106, 0), (123, 47, 247), (255, 196, 0), (0, 179, 126), (0, 163, 224)]
PP = [(123, 47, 247), (255, 106, 0), (230, 0, 126), (28, 22, 32)]   # papel picado: morado, naranja, rosa y negro
def etiqueta(d, x, y, lineas, t=26, fondo=(10, 8, 20, 225)):
    fn = f(t); w = max(d.textlength(l, font=fn) for l in lineas); h = int(t * 1.3) * len(lineas)
    d.rounded_rectangle([x - 12, y - 8, x + w + 12, y + h + 4], 12, fill=fondo)
    for i, l in enumerate(lineas): d.text((x, y + i * int(t * 1.3)), l, font=fn, fill='white')
def num(d, n, x, y, r=26):
    d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 90, 0), outline='white', width=4)
    fn = f(int(r * 1.3)); w = d.textlength(str(n), font=fn); d.text((x - w / 2, y - r * .75), str(n), font=fn, fill='white')
def titulo(im, txt, sub):
    W = im.size[0]; barra = Image.new('RGB', (W, 120), (26, 14, 40)); d = ImageDraw.Draw(barra)
    d.text((30, 16), txt, font=f(44), fill=(255, 179, 0)); d.text((30, 72), sub, font=f(26), fill='white')
    out = Image.new('RGB', (W, im.size[1] + 120)); out.paste(barra, (0, 0)); out.paste(im, (0, 120)); return out
def tira(d, p, q, s0, s1, k0=0):
    # cordón con banderitas de papel picado; s0/s1 = tamaño cerca/lejos
    d.line([p, q], fill=(255, 255, 255, 230), width=max(2, int(s0 / 10)))
    L = math.dist(p, q); n = int(L / ((s0 + s1) / 2 * 1.25))
    for i in range(n):
        u = (i + .5) / n; x = p[0] + (q[0] - p[0]) * u; y = p[1] + (q[1] - p[1]) * u; s = s0 + (s1 - s0) * u
        c = PP[(i + k0) % len(PP)]
        d.polygon([(x - s * .45, y), (x + s * .45, y), (x + s * .45, y + s * .95), (x, y + s * 1.1), (x - s * .45, y + s * .95)], fill=c + (235,))
        d.rectangle([x - s * .25, y + s * .3, x + s * .25, y + s * .6], fill=(255, 255, 255, 90))


# ---------- señalética de carretera, lápidas y siluetas (compartido) ----------
def camion_sil(d, x, y, w, fill):
    # silueta de tractocamión con caja, centrada en (x, y)
    h = w * .42; x0 = x - w / 2
    d.rectangle([x0 + w * .33, y - h * .55, x0 + w, y + h * .22], fill=fill)
    d.polygon([(x0, y + h * .22), (x0, y - h * .05), (x0 + w * .07, y - h * .14), (x0 + w * .13, y - h * .5), (x0 + w * .3, y - h * .5), (x0 + w * .3, y + h * .22)], fill=fill)
    for cx in (x0 + w * .12, x0 + w * .56, x0 + w * .84): d.ellipse([cx - h * .2, y + h * .12, cx + h * .2, y + h * .52], fill=fill)
def escudo57(d, x, y, w):
    # escudo de carretera federal MEX 57
    h = w * 1.1
    d.polygon([(x, y), (x + w, y), (x + w, y + h * .55), (x + w / 2, y + h), (x, y + h * .55)], fill='white', outline=(20, 20, 20), width=max(2, int(w / 18)))
    fa = f(max(8, int(w * .2))); fb = f(max(10, int(w * .44)))
    d.text((x + w / 2 - d.textlength('MEX', font=fa) / 2, y + h * .08), 'MEX', font=fa, fill=(20, 20, 20))
    d.text((x + w / 2 - d.textlength('57', font=fb) / 2, y + h * .28), '57', font=fb, fill=(20, 20, 20))
def senal(tipo, S=400, lineas=()):
    # devuelve la señal como RGBA (S = tamaño base); se dibuja grande y se escala en cada plano
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    c = S / 2
    if tipo == 'vel':
        d.ellipse([4, 4, S - 4, S - 4], fill='white', outline=(200, 20, 30), width=int(S * .09))
        fn = f(int(S * .36)); d.text((c - d.textlength('100', font=fn) / 2, c - S * .25), '100', font=fn, fill=(20, 20, 20))
        fn = f(int(S * .085)); t = 'NI LAS ÁNIMAS'; d.text((c - d.textlength(t, font=fn) / 2, c + S * .17), t, font=fn, fill=(20, 20, 20))
    elif tipo == 'alto':
        pts = [(c + math.cos(math.pi / 8 + k * math.pi / 4) * (S / 2 - 4), c + math.sin(math.pi / 8 + k * math.pi / 4) * (S / 2 - 4)) for k in range(8)]
        d.polygon(pts, fill=(200, 20, 30)); pts2 = [(c + (x - c) * .9, c + (y - c) * .9) for x, y in pts]; d.line(pts2 + [pts2[0]], fill='white', width=int(S * .03))
        fn = f(int(S * .27)); d.text((c - d.textlength('ALTO', font=fn) / 2, c - S * .2), 'ALTO', font=fn, fill='white')
        fn = f(int(S * .062)); t = 'A LOS SINIESTROS'; d.text((c - d.textlength(t, font=fn) / 2, c + S * .14), t, font=fn, fill='white')
    elif tipo == 'prev':
        d.polygon([(c, 6), (S - 6, c), (c, S - 6), (6, c)], fill=(255, 196, 0), outline=(20, 20, 20)); 
        d.polygon([(c, 22), (S - 22, c), (c, S - 22), (22, c)], outline=(20, 20, 20), width=int(S * .03))
        r = S * .17; cy = c - S * .06
        d.ellipse([c - r, cy - r, c + r, cy + r * .8], fill=(20, 20, 20)); d.rounded_rectangle([c - r * .55, cy + r * .5, c + r * .55, cy + r * 1.15], 6, fill=(20, 20, 20))
        for sg in (-1, 1): d.ellipse([c + sg * r * .42 - r * .25, cy - r * .2, c + sg * r * .42 + r * .25, cy + r * .3], fill=(255, 196, 0))
        d.polygon([(c, cy + r * .35), (c - r * .1, cy + r * .55), (c + r * .1, cy + r * .55)], fill=(255, 196, 0))
    elif tipo in ('verde', 'azul'):
        W, H = S, int(S * .38); im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        col = (0, 112, 60) if tipo == 'verde' else (0, 82, 160)
        d.rounded_rectangle([0, 0, W - 1, H - 1], int(H * .1), fill=col); d.rounded_rectangle([8, 8, W - 9, H - 9], int(H * .08), outline='white', width=max(3, int(H * .035)))
        x = int(H * .18)
        if tipo == 'verde': escudo57(d, x, int(H * .2), int(H * .52)); x += int(H * .72)
        else:
            # pictograma de taza de café
            cw = int(H * .5); cy0 = int(H * .25)
            d.rounded_rectangle([x, cy0, x + cw, cy0 + cw], 10, fill='white'); d.ellipse([x + cw - 8, cy0 + cw * .2, x + cw + cw * .35, cy0 + cw * .7], outline='white', width=max(3, int(H * .05)))
            x += int(cw * 1.55)
        n = len(lineas); fs = int(H * (.27 if n <= 2 else .2))
        while fs > 8 and max(d.textlength(t, font=f(fs)) for t in lineas) > W - x - H * .16: fs -= 1
        fn = f(fs)
        for i, t in enumerate(lineas): d.text((x, int(H / 2 - n * fs * .6 + i * fs * 1.2)), t, font=fn, fill='white')
    elif tipo == 'km':
        W, H = int(S * .4), S; im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.rectangle([0, 0, W - 1, H - 1], fill='white', outline=(60, 60, 60), width=3); d.rectangle([0, 0, W - 1, int(H * .16)], fill=(20, 20, 20))
        fn = f(int(W * .36)); d.text((W / 2 - d.textlength('KM', font=fn) / 2, H * .24), 'KM', font=fn, fill=(20, 20, 20))
        fs = int(W * .4)
        while d.textlength('10-28', font=f(fs)) > W * .86: fs -= 1
        fn = f(fs); d.text((W / 2 - d.textlength('10-28', font=fn) / 2, H * .46), '10-28', font=fn, fill=(20, 20, 20))
        d.rectangle([0, int(H * .72), W - 1, int(H * .76)], fill=(20, 20, 20))
    return im
def lapida(lineas, w, pizarra=False):
    # lápida de cartón con la punta redonda; pizarra = la de "Días sin siniestro"
    h = int(w * 1.25); im = Image.new('RGBA', (w + 12, h + 30), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.ellipse([0, h - 4, w + 12, h + 22], fill=(0, 0, 0, 70))
    piedra, sombra, letra = ((40, 46, 44), (24, 28, 27), (240, 240, 235)) if pizarra else ((168, 168, 172), (120, 120, 126), (55, 55, 62))
    d.rounded_rectangle([8, 10, w + 8, h + 8], int(w * .48), fill=sombra); d.rectangle([8, int(w * .5) + 10, w + 8, h + 8], fill=sombra)
    d.rounded_rectangle([0, 0, w, h], int(w * .48), fill=piedra); d.rectangle([0, int(w * .5), w, h], fill=piedra)
    d.rounded_rectangle([int(w * .1), int(w * .1), int(w * .9), h - int(w * .12)], int(w * .4), outline=sombra, width=max(1, w // 40))
    n = len(lineas); fs = max(7, int(w * (.15 if n <= 3 else .12)))
    while fs > 6 and max(d.textlength(t, font=f(fs)) for t in lineas) > w * .74: fs -= 1
    for i, t in enumerate(lineas):
        grande = pizarra and i == n - 1
        fn = f(int(fs * 2.3) if grande else fs); y = int(h * .26 + i * fs * 1.3); d.text((w / 2 - d.textlength(t, font=fn) / 2, y), t, font=fn, fill=(255, 196, 0) if grande else letra)
    for k in range(5):
        x = w * (.12 + .19 * k); r = w * .07
        for q in range(8): a = q / 8 * 2 * math.pi; d.ellipse([x + math.cos(a) * r * .5 - r * .45, h - r + math.sin(a) * r * .5 - r * .45, x + math.cos(a) * r * .5 + r * .45, h - r + math.sin(a) * r * .5 + r * .45], fill=(255, 140, 0))
        d.ellipse([x - r * .35, h - r * 1.35, x + r * .35, h - r * .65], fill=(255, 196, 0))
    return im
def colgar(im, sig, x, y, w, d=None, techo=0, ang=0):
    # pega la señal escalada a w de ancho, centrada en (x, y), con dos hilos de nylon al techo
    s = sig.resize((int(w), int(w * sig.size[1] / sig.size[0])), Image.LANCZOS)
    if ang: s = s.rotate(ang, resample=Image.BICUBIC, expand=True)
    x0, y0 = int(x - s.size[0] / 2), int(y - s.size[1] / 2)
    dd = ImageDraw.Draw(im, 'RGBA')
    for xx in (x0 + s.size[0] * .25, x0 + s.size[0] * .75): dd.line([(xx, techo), (xx, y0 + 4)], fill=(255, 255, 255, 150), width=1)
    im.alpha_composite(s, (x0, y0))

# ---------- 1. papel picado ----------
im = Image.open(IMG + '16.webp').convert('RGB'); d = ImageDraw.Draw(im, 'RGBA')
L0, L3, R0, R3 = (225, 435), (690, 592), (1045, 455), (940, 592)
Lp = lambda t: (L0[0] + (L3[0] - L0[0]) * t, L0[1] + (L3[1] - L0[1]) * t)
Rp = lambda t: (R0[0] + (R3[0] - R0[0]) * t, R0[1] + (R3[1] - R0[1]) * t)
sz = lambda t: 46 * (1 - t) + 12 * t
segs = [(Lp(0), Rp(1), 0, 1), (Rp(0), Lp(1), 0, 1), (Lp(0), Rp(.5), 0, .5), (Rp(0), Lp(.5), 0, .5), (Lp(.5), Rp(1), .5, 1), (Rp(.5), Lp(1), .5, 1)]
for k, (p, q, a, b) in enumerate(segs): tira(d, p, q, sz(a), sz(b), k)
for t in (0, .5, 1):
    for P in (Lp(t), Rp(t)): d.ellipse([P[0] - 9, P[1] - 9, P[0] + 9, P[1] + 9], fill=(255, 255, 255), outline=(255, 90, 0), width=4)
etiqueta(d, 40, 140, ['Tiras cruzadas de esquina a esquina', 'a lo largo de todo el techo'], 28)
etiqueta(d, 40, 236, ['○ = amarre a la rejilla del techo', '    (cordón o cincho, nunca a lámparas', '    ni al aire acondicionado)'], 23)
# plano visto desde arriba
pw, ph = 330, 520; px, py = 840, 1040
ins = Image.new('RGBA', (pw, ph), (18, 12, 30, 235)); e = ImageDraw.Draw(ins)
x0, y0, x1, y1 = 70, 70, pw - 40, ph - 80
e.rectangle([x0, y0, x1, y1], outline='white', width=3)
e.text((x0, 18), 'VISTO DESDE ARRIBA', font=f(20), fill=(255, 179, 0))
e.text((x0 + 10, y0 - 30), 'Ventanas', font=f(18), fill='white'); e.text((x0 + 10, y1 + 8), 'Entrada', font=f(18), fill='white')
tv = Image.new('RGBA', (200, 30)); ImageDraw.Draw(tv).text((0, 0), 'Pared tele', font=f(18), fill='white'); ins.alpha_composite(tv.rotate(90, expand=True), (30, 230))
cr = Image.new('RGBA', (200, 30)); ImageDraw.Draw(cr).text((0, 0), 'Cristal', font=f(18), fill='white'); ins.alpha_composite(cr.rotate(-90, expand=True), (pw - 34, 250))
ym = (y0 + y1) / 2
for k, (p, q) in enumerate([((x0, y1), (x1, y0)), ((x1, y1), (x0, y0)), ((x0, y1), (x1, ym)), ((x1, y1), (x0, ym)), ((x0, ym), (x1, y0)), ((x1, ym), (x0, y0))]):
    e.line([p, q], fill=COL[k % 6], width=5)
for P in [(x0, y1), (x1, y1), (x0, ym), (x1, ym), (x0, y0), (x1, y0)]: e.ellipse([P[0] - 8, P[1] - 8, P[0] + 8, P[1] + 8], fill='white', outline=(255, 90, 0), width=3)
e.text((x0 - 20, y1 + 40), '6 tiras · 3 amarres por lado', font=f(17), fill=(255, 220, 180))
im = im.convert('RGBA'); im.alpha_composite(ins, (px, py)); im = im.convert('RGB')
titulo(im, '1 · Papel picado', 'Cruzado en contra esquina, de la entrada a las ventanas').save('deco/1_papel_picado.jpg', quality=88)

# ---------- 2. la tele ----------
import numpy as np, cv2
a = cv2.cvtColor(np.array(Image.open(IMG + '12.webp').convert('RGB')), cv2.COLOR_RGB2BGR)
m = np.zeros(a.shape[:2], np.uint8); cv2.rectangle(m, (416, 580), (450, 604), 255, -1); cv2.rectangle(m, (476, 646), (516, 712), 255, -1)
a = cv2.inpaint(a, m, 9, cv2.INPAINT_TELEA)
# en la tele, el 877 como arranca el video
fr = cv2.imread('deco/tv/inicio.png'); h, w = fr.shape[:2]
Hs = cv2.getPerspectiveTransform(np.float32([(0, 0), (w, 0), (w, h), (0, h)]), np.float32([(201, 446), (419, 500), (403, 666), (185, 668)]))
pant = cv2.warpPerspective(fr, Hs, (a.shape[1], a.shape[0]), flags=cv2.INTER_AREA)
mk = cv2.warpPerspective(np.full((h, w), 255, np.uint8), Hs, (a.shape[1], a.shape[0]))[:, :, None] / 255.0
a = (a * (1 - mk) + pant * .93 * mk).astype(np.uint8)
im = Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB)).crop((0, 220, 900, 1000)); d = ImageDraw.Draw(im, 'RGBA')
o = 220
def flor(d, x, y, r, c1=(255, 140, 0), c2=(255, 196, 0)):
    for i in range(12):
        a = i / 12 * 2 * math.pi; d.ellipse([x + math.cos(a) * r * .55 - r * .5, y + math.sin(a) * r * .55 - r * .5, x + math.cos(a) * r * .55 + r * .5, y + math.sin(a) * r * .55 + r * .5], fill=c1 + (255,))
    d.ellipse([x - r * .55, y - r * .55, x + r * .55, y + r * .55], fill=c2 + (255,)); d.ellipse([x - r * .2, y - r * .2, x + r * .2, y + r * .2], fill=(200, 80, 0, 255))
# arco de flores alrededor de la tele (sigue la perspectiva de la pantalla)
pts = []
for i in range(0, 9): pts.append((150, 760 - o - i * 40))
for i in range(0, 11): pts.append((160 + i * 29, 400 - o + i * 7))
for i in range(0, 8): pts.append((455, 480 - o + i * 36))
random.seed(3)
for i, (x, y) in enumerate(pts): flor(d, x + random.uniform(-4, 4), y + random.uniform(-4, 4), 17 if i % 3 else 22, (255, 140, 0) if i % 2 else (255, 170, 20))
for (x, y) in [(150, 440 - o), (455, 470 - o)]:
    flor(d, x, y, 46, (255, 120, 0), (255, 200, 40))
# hilos de nylon a la rejilla
for x in (175, 300, 430): d.line([(x, 310 - o), (x, 405 - o + (x - 160) * .24)], fill=(255, 255, 255, 200), width=2)
tira(d, (175, 690 - o), (440, 685 - o), 26, 26, 2)
im = im.convert('RGBA')
colgar(im, senal('azul', 600, ['ZONA DE', 'DESCANSO']), 705, 438, 236, techo=300)
d = ImageDraw.Draw(im, 'RGBA')
# los ojos del 877 en los monitores (ojos saltones pegados a una pinza, no al monitor)
for (x, y, r) in [(285, 657, 10), (308, 657, 10), (424, 640, 9), (445, 640, 9), (522, 622, 7), (538, 622, 7)]:
    d.ellipse([x - r, y - r, x + r, y + r], fill='white', outline=(30, 30, 30), width=2); d.ellipse([x - r * .45 + 2, y - r * .45 + 1, x + r * .45 + 2, y + r * .45 + 1], fill=(20, 20, 20))
for n, x, y in [(1, 320, 120), (2, 105, 220), (3, 490, 480), (4, 222, 262), (5, 705, 360), (6, 360, 610)]: num(d, n, x, y)
im = im.convert('RGB')
LEY = [(1, 'Arco de cempasúchil de papel', 'colgado con nylon de la rejilla'), (2, 'Flores gigantes de papel', 'en las esquinas de arriba'),
       (3, 'Papel picado bajo la tele', 'en lugar del banderín actual'), (4, 'En la pantalla, el 877', 'como arranca el video'),
       (5, 'Letrero azul "Zona de descanso"', 'como la parada del video'), (6, 'Los ojos del 877', 'ojos saltones en una pinza')]
HL = 3 * 80 + 110; ley = Image.new('RGB', (900, HL), (26, 14, 40)); e = ImageDraw.Draw(ley, 'RGBA')
for i, (n, t1, t2) in enumerate(LEY):
    x = 20 + (i // 3) * 445; y = 20 + (i % 3) * 80
    num(e, n, x + 24, y + 24, 22); e.text((x + 58, y + 4), t1, font=f(20), fill='white'); e.text((x + 58, y + 34), t2, font=f(17), fill=(220, 210, 235))
e.rounded_rectangle([16, HL - 76, 884, HL - 18], 12, fill=(120, 20, 40)); e.text((34, HL - 64), 'Nada pegado a la pared, a la pantalla ni a los monitores', font=f(21), fill='white')
out = Image.new('RGB', (900, im.size[1] + HL)); out.paste(im, (0, 0)); out.paste(ley, (0, im.size[1]))
titulo(out, '2 · La tele: zona de descanso', 'El 877 recibe a los niños; los monitores "miran" la ruta').save('deco/2_tele.jpg', quality=88)

# ---------- 3. escritorios ----------
im = Image.open(IMG + '16.webp').convert('RGB'); d = ImageDraw.Draw(im, 'RGBA')
def borde(d, ptos, s0, s1):
    n = len(ptos) - 1
    for i in range(n):
        (xa, ya), (xb, yb) = ptos[i], ptos[i + 1]
        m = int(math.dist(ptos[i], ptos[i + 1]) / 14) + 1
        for j in range(m):
            u = j / m; t = (i + u) / n; s = s0 + (s1 - s0) * t
            x = xa + (xb - xa) * u; y = ya + (yb - ya) * u + math.sin((i + u) * 9) * s * .25 + s * .5
            flor(d, x, y, s * .55, (255, 140, 0) if j % 2 else (255, 175, 20))
            if j % 3 == 0: d.ellipse([x - s * .5, y - s * .9, x + s * .5, y + s * .1], fill=(255, 230, 150, 70))
borde(d, [(0, 995), (130, 962), (262, 928)], 34, 26)
borde(d, [(300, 912), (470, 885), (650, 858)], 22, 14)
borde(d, [(690, 965), (780, 900), (860, 820)], 24, 16)
num(d, 1, 240, 860); etiqueta(d, 30, 1050, ['Fila de la pared de la tele'], 26)
num(d, 2, 780, 860); etiqueta(d, 560, 1050, ['Isla junto al cristal'], 26)
im = im.crop((0, 600, 1200, 1250))
# diagrama de cómo se pone
dg = Image.new('RGB', (1200, 700), (245, 240, 232)); e = ImageDraw.Draw(dg, 'RGBA')
e.text((30, 20), 'Así se pone en el borde de cada escritorio', font=f(32), fill=(40, 20, 50))
e.rectangle([80, 150, 1120, 185], fill=(214, 200, 180)); e.rectangle([80, 185, 1120, 195], fill=(170, 150, 130))
e.rectangle([130, 195, 160, 330], fill=(60, 60, 66)); e.rectangle([1040, 195, 1070, 330], fill=(60, 60, 66))
for i, x in enumerate(range(80, 1120, 26)): e.rectangle([x, 138, x + 26, 150], fill=COL[i % 6])
e.rectangle([80, 150, 1120, 230], fill=(0, 0, 0, 0))
for i, x in enumerate(range(80, 1120, 26)): e.rectangle([x, 186, x + 26, 236], fill=COL[i % 6] + (230,))
for x in range(100, 1110, 34):
    y = 262 + 22 * math.sin((x - 100) / 1010 * math.pi * 4)
    flor(e, x, y, 19, (255, 140, 0) if (x // 34) % 2 else (255, 175, 20))
for x in range(115, 1100, 68):
    y = 262 + 22 * math.sin((x - 100) / 1010 * math.pi * 4)
    e.ellipse([x - 14, y - 14, x + 14, y + 14], fill=(255, 240, 170, 110)); e.ellipse([x - 4, y - 4, x + 4, y + 4], fill=(255, 250, 210, 255))
for x in (210, 470, 730, 990):
    e.rectangle([x - 16, 172, x + 16, 214], fill=(25, 25, 30)); e.polygon([(x - 12, 172), (x - 4, 150), (x + 4, 150), (x + 12, 172)], outline=(160, 160, 170), width=4)
e.rectangle([985, 290, 1030, 330], fill=(70, 70, 80)); e.text((900, 300), 'pilas', font=f(18), fill=(60, 60, 60))
e.text((80, 370), '① Camino de sarape a lo largo del frente, caído unos 10 cm', font=f(24), fill=(40, 20, 50))
e.text((80, 410), '② Pinzas de papelería (tipo mariposa) cada 50–60 cm sujetan todo', font=f(24), fill=(40, 20, 50))
e.text((80, 450), '③ Guirnalda de cempasúchil de papel crepé en ondas', font=f(24), fill=(40, 20, 50))
e.text((80, 490), '④ Luces LED cálidas de pilas, enredadas en la guirnalda', font=f(24), fill=(40, 20, 50))
e.text((80, 555), 'Sin cinta · sin pegamento · teclados y monitores libres para trabajar', font=f(22), fill=(200, 60, 0))
e.text((80, 600), 'Cálculo: unas 10 flores por metro; 1 rollo de crepé ≈ 20 flores', font=f(22), fill=(90, 70, 90))
out = Image.new('RGB', (1200, im.size[1] + dg.size[1])); out.paste(im, (0, 0)); out.paste(dg, (0, im.size[1]))
titulo(out, '3 · Escritorios', 'En lugar de cempasúchil natural: flores de papel, sarape y luces').save('deco/3_escritorios.jpg', quality=88)
