# Fotos de la decoración para el jurado: de cada pieza, el cuadro más nítido de los videos del equipo
# (busca alrededor del instante elegido), con el mismo color del video, más las fotos reales del armado.
import os, subprocess, io, sys, numpy as np
from PIL import Image, ImageFilter
B = '/tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/'
mapa = dict(l.split() for l in open(B + 'jurado_clips/mapa.txt'))
OUT = sys.argv[1]
GRADE = 'hqdn3d=1.2:1.2:3:3,eq=contrast=1.05:saturation=1.08,colorbalance=rs=.008:bs=-.008'

DECO = [  # nombre, clip, instante, ventana, giro
    ('01_El_altar_en_forma_de_tracto', 'c05', 9.4, .6, 0),
    ('02_El_altar_con_la_carretera', 'c26', 5.0, .8, 0),
    ('03_Vista_general_del_altar_y_la_cruz', 'c29', .4, .4, 0),
    ('04_La_carretera_y_sus_senales', 'c26', 15.2, .8, 0),
    ('05_El_altar_de_noche', 'c66', 17.0, .5, 0),
    ('07_La_Catrina_gigante', 'c66', 2.7, .6, 0),
    ('08_El_panteon_de_los_malos_habitos', 'c06', 40.7, .7, 0),
    ('09_Las_lapidas_con_sus_velas', 'c19', 6.5, .4, 0, (445, 110, 579, 466)),
    ('10_La_ofrenda_de_un_escritorio', 'c29', 12.0, .6, 0),
    ('11_Ofrenda_pan_mandarina_y_cacahuate', 'c27', 1.0, .8, 0),
    ('12_Los_letreros_de_la_cabina', 'c22', 28.7, .8, 0),
    ('13_El_877_en_la_tele_de_la_cabina', 'c29', 59.0, 1.0, 0),
    ('14_La_cabina_con_sus_ofrendas', 'c29', 5.4, .6, 0),
    ('15_Calaveras_y_letreros_en_la_pared', 'c66', 6.3, .6, 0),
    ('16_El_equipo_Centinela', 'c41', 4.8, .8, -90),
]
FOTOS = [  # fotos tal cual (recorte opcional en píxeles: x, y, ancho, alto)
    ('06_El_papel_picado_del_techo', 'jurado/material/armado_10.jpg', None),
    ('17_Los_Mini_Centinelas_en_la_cabina', 'jurado_clips/fotos/visita_ninos.jpg', (120, 70, 1040, 418)),
    ('18_Catrinas_el_30_de_octubre', 'jurado_clips/fotos/selfie_catrinas.jpg', (0, 262, 572, 754)),
]
ARMADO = [
    ('01_Antes_la_cabina_sin_decorar', 'images/10.webp'), ('02_Antes_otra_vista', 'images/15.webp'),
    ('03_El_equipo_armando', 'jurado/material/armado_03.jpg'), ('04_Papel_picado_listo', 'jurado/material/armado_04.jpg'),
    ('05_Colgando_el_papel_picado', 'jurado/material/armado_05.jpg'), ('06_Subiendo_la_decoracion', 'jurado/material/armado_07.jpg'),
    ('07_La_base_del_altar', 'jurado_clips/fotos/armado_altar.jpg'), ('08_Pegando_con_silicon', 'jurado_clips/fotos/armado_silicon.jpg'),
]

def ruta(clip):
    return B + 'jurado/material/' + clip[4:] + '.mp4' if clip.startswith('mat:') else B + 'jurado_clips/raw/' + mapa[clip]

def cuadros(f, a, b, giro):
    """Cuadros del tramo [a, b] a 15 fps, como imágenes PIL."""
    vf = ('transpose=2,' if giro == -90 else '') + 'fps=15'
    raw = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-ss', str(max(0, a)), '-to', str(b), '-i', f, '-vf', vf, '-f', 'image2pipe', '-c:v', 'png', '-'], capture_output=True).stdout
    ims, i = [], 0
    while True:
        j = raw.find(b'\x89PNG', i + 1)
        trozo = raw[i:j] if j > 0 else raw[i:]
        if trozo: ims.append(Image.open(io.BytesIO(trozo)).convert('RGB'))
        if j < 0: break
        i = j
    return ims

def nitidez(im):
    g = np.asarray(im.convert('L'), dtype=float)
    lap = g[1:-1, 1:-1] * 4 - g[:-2, 1:-1] - g[2:, 1:-1] - g[1:-1, :-2] - g[1:-1, 2:]
    return lap.var()

os.makedirs(OUT + '/Decoracion', exist_ok=True); os.makedirs(OUT + '/Armado_en_equipo', exist_ok=True)
for nom, clip, t, v, giro, *rc in DECO:
    ims = cuadros(ruta(clip), t - v, t + v, giro)
    mejor = max(ims, key=nitidez)
    if rc: x, y, w, h = rc[0]; mejor = mejor.crop((x, y, x + w, y + h))  # solo la pieza, sin la persona
    tmp = OUT + '/_tmp.png'; mejor.save(tmp)
    w, h = mejor.size
    escala = 'scale=1920:-2:flags=lanczos' if w >= h else 'scale=-2:1920:flags=lanczos'
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', tmp, '-vf', f'{GRADE},{escala},cas=0.5', '-q:v', '2', f'{OUT}/Decoracion/{nom}.jpg'], check=True)
    os.remove(tmp); print(nom, mejor.size, round(nitidez(mejor)))
for nom, f, rc in FOTOS:
    im = Image.open(B + f).convert('RGB')
    if rc: im = im.crop((rc[0], rc[1], rc[0] + rc[2], rc[1] + rc[3]))
    im.save(f'{OUT}/Decoracion/{nom}.jpg', quality=93); print(nom, im.size)
for nom, f in ARMADO:
    base = B + f if not f.startswith('images/') else '/tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/' + f
    im = Image.open(base).convert('RGB'); im.save(f'{OUT}/Armado_en_equipo/{nom}.jpg', quality=93); print(nom, im.size)
