# Plano del altar como lo están armando (foto armado_12): la estructura blanca es el tracto. Parrilla al centro,
# faros a los lados, calavera arriba, carretera con tractos en el mantel negro, cruz de sal y cempasúchil al frente.
exec(open('deco/planos.py').read().split('# ---------- 1. papel picado ----------')[0])
import numpy as np, cv2
P = 'imprimibles/png/'

def recorte(ruta, caja=None, tol=28):
    """Recorta un imprimible y vuelve transparente el blanco de afuera (relleno desde las esquinas)."""
    im = Image.open(ruta).convert('RGB')
    if caja: im = im.crop(caja)
    a = np.array(im).astype(int); h, w = a.shape[:2]
    blanco = (a.min(axis=2) > 255 - tol)
    vis = np.zeros((h, w), bool); pila = [(0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)]
    while pila:
        y, x = pila.pop()
        if y < 0 or x < 0 or y >= h or x >= w or vis[y, x] or not blanco[y, x]: continue
        vis[y, x] = True; pila += [(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)]
    return Image.fromarray(np.dstack([a, np.where(vis, 0, 255)]).astype(np.uint8), 'RGBA')

def pegar(base, pieza, x, y, ancho, sombra=True, alfa=255):
    """Pega la pieza con su centro inferior en (x, y)."""
    k = ancho / pieza.width; p = pieza.resize((int(pieza.width * k), int(pieza.height * k)), Image.LANCZOS)
    if alfa < 255: p.putalpha(p.split()[3].point(lambda v: v * alfa // 255))
    if sombra:
        s = Image.new('RGBA', p.size, (0, 0, 0, 0)); s.putalpha(p.split()[3].point(lambda v: int(v * .45)))
        base.alpha_composite(s.filter(ImageFilter.GaussianBlur(5)), (int(x - p.width / 2 + 5), int(y - p.height + 5)))
    base.alpha_composite(p, (int(x - p.width / 2), int(y - p.height)))

# la foto sin los cartones ni el paraguas de la izquierda
a = cv2.imread('jurado/material/armado_12.jpg')
m = np.zeros(a.shape[:2], np.uint8)
cv2.fillPoly(m, [np.array([(52, 1060), (120, 1040), (192, 1050), (192, 1372), (52, 1372)])], 255)
cv2.fillPoly(m, [np.array([(130, 940), (175, 935), (222, 1000), (214, 1050), (130, 1060)])], 255)
a = cv2.inpaint(a, cv2.dilate(m, np.ones((9, 9), np.uint8)), 21, cv2.INPAINT_TELEA)
foto = Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB)).convert('RGBA')
brillo = Image.new('RGBA', foto.size, (0, 0, 0, 0)); g = ImageDraw.Draw(brillo)

random.seed(8)
def flor(d, x, y, r, c=None):
    c = c or random.choice([(255, 128, 0), (255, 150, 10), (240, 110, 0), (255, 176, 30)])
    for k in range(10):
        an = k / 10 * 6.283; d.ellipse([x + math.cos(an) * r * .55 - r * .48, y + math.sin(an) * r * .55 - r * .48, x + math.cos(an) * r * .55 + r * .48, y + math.sin(an) * r * .55 + r * .48], fill=c + (255,))
    d.ellipse([x - r * .45, y - r * .45, x + r * .45, y + r * .45], fill=(255, 190, 40, 255))
def ramo(d, x, y, n=9, r=13, alto=40):  # florero con cempasúchil natural
    d.polygon([(x - 16, y), (x - 20, y - 38), (x + 20, y - 38), (x + 16, y)], fill=(40, 26, 50, 255), outline=(90, 70, 110, 255))
    for k in range(n): flor(d, x + random.uniform(-26, 26), y - 46 - random.uniform(0, alto), r + random.uniform(-2, 3))
def vela(d, x, y, h=30):
    d.rounded_rectangle([x - 9, y - h, x + 9, y], 4, fill=(247, 236, 210, 255), outline=(150, 130, 100, 255), width=2)
    d.polygon([(x, y - h - 20), (x - 6, y - h - 5), (x, y - h), (x + 6, y - h - 5)], fill=(255, 190, 40, 255))
    g.ellipse([x - 28, y - h - 44, x + 28, y - h + 10], fill=(255, 200, 90, 120))

L = Image.new('RGBA', foto.size, (0, 0, 0, 0))
# 1 · la calavera parada sobre la parrilla, con su marco de cempasúchil
pegar(L, Image.open(P + 'tr-calavera.png').convert('RGBA'), 468, 850, 182)
d = ImageDraw.Draw(L, 'RGBA')
for k in range(34):  # marco de flores: lados y arco de arriba
    t = k / 33
    if t < .3: x, y = 372, 848 - t / .3 * 96
    elif t < .7: an = math.pi * (t - .3) / .4; x, y = 468 - 96 * math.cos(an), 752 - 34 * math.sin(an)
    else: x, y = 564, 752 + (t - .7) / .3 * 96
    flor(d, x, y, 12)
# 2 · la parrilla al frente del bloque de en medio
pegar(L, Image.open(P + 'tr-parrilla.png').convert('RGBA'), 468, 1044, 212, sombra=False, alfa=250)
# 3 · los faros en los bloques de los lados
pegar(L, recorte(P + 'tr-faroIzq.png'), 287, 1038, 104, sombra=False)
pegar(L, recorte(P + 'tr-faroDer.png'), 645, 1036, 104, sombra=False)
d = ImageDraw.Draw(L, 'RGBA')
# floreros y velas sobre los bloques de los lados
ramo(d, 250, 936); ramo(d, 690, 926); vela(d, 300, 940); vela(d, 330, 942, 24); vela(d, 610, 932); vela(d, 640, 930, 24)
for x in (392, 544): vela(d, x, 850, 22)
# 4 · placa de Aguascalientes como defensa, sobre el mantel
pegar(L, recorte(P + 'sen-2.png', (15, 55, 513, 323)), 468, 1104, 92, sombra=False)
# 5 · la carretera con tractos en el mantel negro
car = Image.open(P + 'tr-carretera.png').convert('RGBA'); pegar(L, car, 475, 1200, 548, sombra=False)
d = ImageDraw.Draw(L, 'RGBA')

# 6 · la cruz de sal en el piso, sobre cartulina negra (en perspectiva)
d.polygon([(352, 1342), (588, 1342), (622, 1548), (318, 1548)], fill=(14, 12, 16, 255))
sal = Image.new('RGBA', foto.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sal)
ds.polygon([(460, 1356), (480, 1356), (485, 1532), (455, 1532)], fill=(246, 246, 242, 255))
ds.polygon([(392, 1400), (548, 1400), (551, 1414), (389, 1414)], fill=(246, 246, 242, 255))
ns = np.array(sal); ruido = np.random.RandomState(3).randint(-28, 10, ns.shape[:2])
for c in range(3): ns[:, :, c] = np.clip(ns[:, :, c].astype(int) + ruido * (ns[:, :, 3] > 0), 0, 255)
L.alpha_composite(Image.fromarray(ns, 'RGBA'))
d = ImageDraw.Draw(L, 'RGBA')
# 7 · pétalos alrededor y cempasúchil natural a los costados
rng = random.Random(4)
for k in range(900):
    t = rng.random()
    if t < .55:  # borde de pétalos alrededor de la cartulina
        u = rng.random(); lado = rng.choice(['i', 'd', 'f'])
        if lado == 'i': x, y = 338 - u * 40 + rng.uniform(-14, 4) - 6, 1338 + u * 214
        elif lado == 'd': x, y = 602 + u * 40 + rng.uniform(-4, 14) + 6, 1338 + u * 214
        else: x, y = 298 + u * 344, 1556 + rng.uniform(0, 16)
    else:  # alfombra hacia los costados
        x = rng.choice([rng.uniform(205, 300), rng.uniform(640, 735)]); y = rng.uniform(1330, 1590)
    r = rng.uniform(2, 4.2); c = rng.choice([(255, 128, 0), (255, 150, 10), (240, 100, 0), (255, 176, 30)])
    d.ellipse([x - r, y - r * .6, x + r, y + r * .6], fill=c + (255,))
random.seed(11)
ramo(d, 250, 1452, 13, 15, 50); ramo(d, 690, 1452, 13, 15, 50)
for x, y in [(320, 1330), (620, 1330), (300, 1570), (640, 1570)]: vela(d, x, y, 26)

# 8 · el panteón: 4 lápidas de cada lado, en el piso
lap = [recorte(P + f'lap-{i}.png', (45, 36, 363, 518)) for i in range(1, 9)]
for i, (x, y, w) in enumerate([(52, 1418, 74), (140, 1410, 72), (762, 1410, 72), (850, 1418, 74),
                               (70, 1590, 94), (170, 1580, 90), (742, 1580, 90), (842, 1590, 94)]):
    pegar(L, lap[i], x, y, w)
d = ImageDraw.Draw(L, 'RGBA')

# 9 · letreros: Destinos y Parador colgados como señales de autopista; KM 57 y Cruce de ánimas en palitos
for x0, x1, top in [(262, 398, 405), (560, 696, 405)]:
    for x in (x0 + 18, x1 - 18): d.line([(x, top), (x, 528)], fill=(255, 255, 255, 210), width=2)
pegar(L, recorte(P + 'sen-5.png', (15, 31, 513, 349)), 330, 612, 150)
pegar(L, recorte(P + 'sen-4.png', (15, 31, 513, 349)), 628, 612, 150)
d = ImageDraw.Draw(L, 'RGBA')
def palito(x, y0, y1): d.rectangle([x - 4, y0, x + 4, y1], fill=(140, 96, 52, 255), outline=(80, 50, 24, 255))
palito(186, 1180, 1330); palito(778, 1200, 1336)
pegar(L, recorte(P + 'sen-1.png', (65, 26, 343, 474)), 186, 1210, 66)
pegar(L, recorte(P + 'sen-6.png', (10, 0, 398, 500)), 778, 1236, 98)
pegar(L, recorte(P + 'sen-3.png', (15, 55, 513, 323)), 714, 1334, 78)

foto.alpha_composite(brillo.filter(ImageFilter.GaussianBlur(12)))
foto.alpha_composite(L)
d = ImageDraw.Draw(foto, 'RGBA')
for n, (x, y) in enumerate([(468, 700), (468, 930), (287, 1000), (548, 1080), (868, 1168), (470, 1450), (250, 1350), (100, 1290), (464, 560)], 1): num(d, n, x, y, 22)
im = foto.convert('RGB').crop((0, 380, 900, 1600))

lado = Image.new('RGB', (650, im.height), (20, 14, 32)); e = ImageDraw.Draw(lado)
items = [('Calavera arriba de la parrilla', 'Tracto_Altar.pdf, hojas 1 a 4; sobre cartón,\nparada con un atril y su marco de cempasúchil'),
         ('Parrilla al centro', 'hojas 5 a 10, empalmadas; sobre cartón y\nsujeta a la sábana con alfileres'),
         ('Faros en los dos bloques de los lados', 'hojas 11 y 12; arriba, floreros y velas LED'),
         ('Placa de Aguascalientes como defensa', 'Letreros_Carretera.pdf, sobre el mantel'),
         ('Carretera con tractos en el mantel', 'Carretera_Mantel.pdf, 6 hojas en una sola línea,\ncon alfileres o seguritos al mantel'),
         ('Cruz de sal al centro', 'en el piso, sobre cartulina negra:\nse ve más y se recoge fácil'),
         ('Cempasúchil natural y pétalos', 'a los costados de la cruz, con velas LED'),
         ('Panteón de los malos hábitos', 'las 8 lápidas en el piso, 4 de cada lado'),
         ('Letreros de la carretera', 'Destinos y Parador colgados con nylon; KM 57,\nCruce de ánimas y placa de Saltillo al pie')]
y = 28
for k, (t1, t2) in enumerate(items, 1):
    num(e, k, 44, y + 20, 21); e.text((82, y), t1, font=f(23), fill='white'); y += 33
    for l in t2.split('\n'): e.text((82, y), l, font=f(18), fill=(200, 190, 220)); y += 24
    y += 16
e.rounded_rectangle([24, y + 4, 626, y + 110], 14, fill=(120, 20, 40))
for i, l in enumerate(['Nada clavado, pegado ni pintado en paredes, cristales,', 'pisos ni muebles: los imprimibles van sobre cartón,', 'sujetos a la sábana o al mantel con alfileres.']):
    e.text((44, y + 20 + i * 28), l, font=f(18), fill='white')
y += 150; e.text((30, y), 'MEDIDAS YA IMPRESAS Y EMPALMADAS', font=f(21), fill=(255, 179, 0)); y += 36
for t1, t2 in [('Calavera', '51 × 36 cm'), ('Parrilla', '57 × 51 cm'), ('Cada faro', '27 × 20 cm'), ('Carretera', '152 × 18 cm')]:
    e.text((44, y), t1, font=f(20), fill='white'); e.text((300, y), t2, font=f(20), fill=(255, 200, 120)); y += 30
y += 8
for l in ['Mide el bloque de en medio: si es más chico que la', 'parrilla, recorta parejo el marco blanco de la orilla.']:
    e.text((30, y), l, font=f(17), fill=(200, 190, 220)); y += 24
out = Image.new('RGB', (im.width + lado.width, im.height)); out.paste(im, (0, 0)); out.paste(lado, (im.width, 0))
titulo(out, '1 · El altar: el tracto del 877', 'Lo blanco es el tracto: parrilla al centro, faros a los lados y la calavera arriba').save('deco/n1_altar_esquina.jpg', quality=88)
print(out.size, y)
