# Bocetos a lápiz sobre los planos: así "empezó" el diseño (para el plan maestro y para el video)
import numpy as np, cv2, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
FN = 'imprimibles/fonts/'
def mano(n): return ImageFont.truetype(FN + 'gochi-hand-latin-400-normal.woff2', n)
def mano2(n): return ImageFont.truetype(FN + 'patrick-hand-latin-400-normal.woff2', n)
GRAFITO, NARANJA = (58, 58, 70), (226, 92, 10)

def papel(w, h, sem=1):
    r = np.random.RandomState(sem)
    base = np.ones((h, w, 3)) * np.array([246, 241, 230])
    ruido = cv2.GaussianBlur(r.randn(h, w), (0, 0), 1.2) * 4 + cv2.GaussianBlur(r.randn(h, w), (0, 0), 18) * 30
    return np.clip(base + ruido[:, :, None], 0, 255)

def lapiz(rgb, sem=1):
    """Convierte una foto en boceto de grafito: trazo por esquivado de color, contornos y achurado en lo oscuro."""
    a = np.array(rgb.convert('RGB'))
    g = cv2.cvtColor(a, cv2.COLOR_RGB2GRAY).astype(np.float32)
    bl = cv2.GaussianBlur(255 - g, (0, 0), 7)
    sk = np.clip(g * 256 / (256 - bl + 1e-3), 0, 255)
    sk = 255 - (255 - sk) * 1.5
    ed = cv2.Canny(cv2.GaussianBlur(g.astype(np.uint8), (0, 0), 1.4), 35, 95).astype(np.float32)
    ed = cv2.GaussianBlur(ed, (0, 0), .7)
    t = np.clip(np.minimum(sk, 255 - ed * .75), 0, 255) / 255
    h, w = g.shape; yy, xx = np.mgrid[0:h, 0:w]
    rayas1 = ((xx + yy) % 9 < 1.6).astype(np.float32); rayas2 = ((xx - yy) % 11 < 1.4).astype(np.float32)
    osc = np.clip((110 - g) / 80, 0, 1); medio = np.clip((150 - g) / 60, 0, 1) * (1 - osc)
    t = t * (1 - rayas1 * (osc * .55 + medio * .25)) * (1 - rayas2 * osc * .45)
    t = np.clip(t, 0, 1)
    p = papel(w, h, sem)
    tinta = np.array(GRAFITO, np.float32)
    out = p * t[:, :, None] + tinta * (1 - t[:, :, None])
    return Image.fromarray(out.astype(np.uint8))

def flecha(d, p, q, col=GRAFITO, ancho=3, curva=.18):
    """Flecha a mano: curva cuadrática con punta."""
    (x0, y0), (x1, y1) = p, q
    mx, my = (x0 + x1) / 2 - (y1 - y0) * curva, (y0 + y1) / 2 + (x1 - x0) * curva
    pts = [((1 - u) ** 2 * x0 + 2 * (1 - u) * u * mx + u * u * x1, (1 - u) ** 2 * y0 + 2 * (1 - u) * u * my + u * u * y1) for u in np.linspace(0, 1, 30)]
    d.line(pts, fill=col, width=ancho, joint='curve')
    ax, ay = pts[-1]; bx, by = pts[-4]; an = math.atan2(ay - by, ax - bx)
    for s in (-1, 1): d.line([(ax, ay), (ax - 16 * math.cos(an + s * .45), ay - 16 * math.sin(an + s * .45))], fill=col, width=ancho)

def nota(d, x, y, txt, t=30, col=GRAFITO, f=mano, fondo=False):
    ls = txt.split('\n')
    if fondo:
        w = max(d.textlength(l, font=f(t)) for l in ls)
        d.rounded_rectangle([x - 8, y - 2, x + w + 8, y + len(ls) * int(t * 1.05) + 8], 8, fill=(250, 246, 236, 225))
    for i, l in enumerate(ls): d.text((x, y + i * int(t * 1.05)), l, font=f(t), fill=col)

def hoja(img, titulo, sub, notas, ancho=1100, margen=(70, 150, 70, 60), sem=1, cinta=True):
    """Pega el boceto en una hoja de libreta con título y notas a mano."""
    k = (ancho - margen[0] - margen[2]) / img.width
    sk = img.resize((int(img.width * k), int(img.height * k)), Image.LANCZOS)
    H = sk.height + margen[1] + margen[3]
    base = Image.fromarray(papel(ancho, H, sem + 7).astype(np.uint8)).convert('RGBA')
    d = ImageDraw.Draw(base, 'RGBA')
    for y in range(margen[1] - 40, H, 40): d.line([(0, y), (ancho, y)], fill=(120, 160, 210, 38), width=1)  # renglones
    d.line([(margen[0] - 22, 0), (margen[0] - 22, H)], fill=(220, 90, 90, 70), width=2)
    base.alpha_composite(sk.convert('RGBA'), (margen[0], margen[1]))
    d = ImageDraw.Draw(base, 'RGBA')
    nota(d, margen[0], 28, titulo, 54, GRAFITO)
    nota(d, margen[0] + 4, 92, sub, 30, NARANJA)
    if cinta:
        for (x, y, a) in [(margen[0] + 30, margen[1] - 14, -8), (ancho - margen[2] - 120, margen[1] - 14, 7)]:
            c = Image.new('RGBA', (130, 36), (250, 232, 160, 150)); c = c.rotate(a, expand=True)
            base.alpha_composite(c, (int(x), int(y)))
    for n in notas:
        kind = n[0]
        if kind == 't': nota(d, n[1], n[2], n[3], n[4] if len(n) > 4 else 30, n[5] if len(n) > 5 else GRAFITO, fondo=True)
        elif kind == 'f': flecha(d, n[1], n[2], n[3] if len(n) > 3 else GRAFITO)
        elif kind == 'o':  # círculo a mano
            x, y, rx, ry = n[1:5]; pts = [(x + rx * math.cos(u) * (1 + .04 * math.sin(3 * u)), y + ry * math.sin(u)) for u in np.linspace(-.3, 2 * math.pi + .2, 60)]
            d.line(pts, fill=NARANJA, width=3)
        elif kind == 'm':  # cota de medida
            (x0, y0), (x1, y1), txt = n[1], n[2], n[3]
            d.line([(x0, y0), (x1, y1)], fill=GRAFITO, width=2)
            for (x, y) in ((x0, y0), (x1, y1)): d.line([(x, y - 10), (x, y + 10)], fill=GRAFITO, width=2)
            nota(d, (x0 + x1) / 2 - 70, y0 + 10, txt, 28, fondo=True)
    return base.convert('RGB')

if __name__ == '__main__':
    # 1 · el altar
    alt = Image.open('deco/altar_limpio.jpg')
    ska = lapiz(alt, 3); ska.save('deco/boceto_altar_solo.jpg', quality=92)
    k = (1100 - 140) / alt.width; X = lambda x: 70 + x * k; Y = lambda y: 150 + y * k   # coordenadas de la foto recortada → hoja
    N = [('o', X(468), Y(400), 120, 92), ('t', X(600), Y(250), 'calavera impresa\ndetrás, con marco\nde cempasúchil', 30, (226, 92, 10)), ('f', (X(600), Y(320)), (X(560), Y(390)), (226, 92, 10)),
         ('t', X(30), Y(470), 'parrilla\ncon el 877', 30), ('f', (X(120), Y(500)), (X(380), Y(560))),
         ('t', X(20), Y(640), 'faros', 32), ('f', (X(70), Y(660)), (X(235), Y(630))),
         ('t', X(748), Y(650), 'placa AGS =\ndefensa', 28), ('f', (X(748), Y(690)), (X(522), Y(708))),
         ('m', (X(190), Y(936)), (X(760), Y(936)), '1.60 m aprox.'),
         ('t', X(330), Y(865), 'carretera con tractos de juguete', 28), ('f', (X(320), Y(880)), (X(250), Y(815))),
         ('t', X(640), Y(1005), 'cruz de sal', 32, (226, 92, 10)), ('f', (X(640), Y(1030)), (X(500), Y(1030)), (226, 92, 10)),
         ('t', X(250), Y(1172), 'pétalos + cempasúchil natural', 28),
         ('t', X(8), Y(905), 'panteón:\n8 lápidas', 28), ('f', (X(40), Y(960)), (X(70), Y(1000))),
         ('t', X(410), Y(110), 'señales colgadas\ncon nylon', 26), ('f', (X(400), Y(140)), (X(330), Y(185)))]
    hoja(ska, 'Boceto 1 · El altar es el tracto del 877', 'Lo blanco es el tracto: la parrilla al centro, los faros a los lados', N, sem=3).save('deco/boceto_altar.jpg', quality=90)

    # 2 · la cabina: tele y monitores
    tel = Image.open('deco/tele_limpio.jpg'); mon = Image.open('deco/monitores_limpio.jpg')
    skt = lapiz(tel.crop((0, 60, 900, 700)), 5); skm = lapiz(mon.crop((0, 120, 1100, 620)), 6)
    W = 1100; a1 = skt.resize((520, int(520 * skt.height / skt.width))); a2 = skm.resize((W - 140, int((W - 140) * skm.height / skm.width)))
    lienzo = Image.new('RGB', (W - 140, a1.height + 30 + a2.height), (246, 241, 230)); lienzo.paste(a1, (0, 0)); lienzo.paste(a2, (0, a1.height + 30))
    lp = Image.fromarray(papel(lienzo.width, lienzo.height, 9).astype(np.uint8)); lp.paste(a1, (0, 0)); lp.paste(a2, (0, a1.height + 30))
    o = 150; y2 = o + a1.height + 30
    N2 = [('t', 620, o + 20, 'La tele:', 40, (226, 92, 10)), ('t', 620, o + 66, 'el 877 con ojos\nrecibe a los niños,\ncon su marco\nde flores', 32),
          ('f', (610, o + 120), (330, o + 170)),
          ('t', 620, o + 260, 'ojos saltones en\npinzas, no pegados', 28), ('f', (620, o + 285), (380, o + 330)),
          ('t', 90, y2 + 16, 'letreros grandes sobre los monitores,\ncolgados con nylon de la rejilla', 30), ('f', (200, y2 + 84), (215, y2 + 140)),
          ('t', 640, y2 + 20, 'A · B · C · D', 34, (226, 92, 10))]
    hoja(lp, 'Boceto 2 · La cabina', 'La tele con el 877 y los letreros de carretera sobre los monitores', N2, sem=5).save('deco/boceto_cabina.jpg', quality=90)
    print('ok')
