# Álbum de fotos para el jurado (PDF horizontal tamaño carta): portada, la decoración y el armado en equipo,
# una foto por hoja con su título y una línea que la explica. Arma album.html; pdf.js lo convierte a PDF.
import os, html
R = '/home/user/AUTOEVALUACION-PRE-VIAJE/entrega-jurado-lomaween/04_Fotos_de_la_Decoracion/'
F = '../../build2/fonts/'
DECO = [
    ('El altar en forma de tracto', 'Nuestro altar es un tracto: nunca deja sola a su caja, como nosotros nunca dejamos sola a una unidad.'),
    ('El altar con la carretera', 'Al pie del altar corre la carretera, con su kilómetro 57 y la placa CEN-877-A.'),
    ('Vista general del altar y la cruz', 'Desde el pasillo: el altar, la cruz de sal y el papel picado.'),
    ('La carretera y sus señales', 'La carretera con sus señales y sus tractos: por ella se va… y por ella se regresa.'),
    ('El altar de noche', 'El altar encendido, con sus velas y su cempasúchil.'),
    ('El papel picado del techo', 'Cada tira de papel picado es una ruta del mapa: de día y de noche las seguimos todas.'),
    ('La Catrina gigante', 'La Catrina recibe a quien entra a la cabina.'),
    ('El panteón de los malos hábitos', '«Aquí yace el exceso de velocidad»: la Catrina entierra los malos hábitos de la ruta.'),
    ('Las lápidas con sus velas', 'Cada lápida es un mal hábito que se queda enterrado y no regresa.'),
    ('La ofrenda de un escritorio', 'Cada escritorio tiene su ofrenda, como una parada en el camino.'),
    ('Ofrenda: pan, mandarina y cacahuate', 'Mandarina, pan y cacahuate sobre el sarape.'),
    ('Los letreros de la cabina', 'Zona de restricción, parada no autorizada, estatus al cliente y zona sin cobertura: las alertas que atendemos a diario.'),
    ('El 877 en la tele de la cabina', 'El video que hicimos con nuestra voz para que los Mini Centinelas conozcan la cabina.'),
    ('La cabina con sus ofrendas', 'La cabina completa, decorada entre todos los turnos.'),
    ('Calaveras y letreros en la pared', 'Calaveras de papel junto a los letreros de las alertas.'),
    ('El equipo Centinela', 'Desde la cabina, protegemos cada kilómetro.'),
    ('Los Mini Centinelas en la cabina', 'El 30 de octubre, las familias y los Mini Centinelas visitaron la cabina.'),
    ('Catrinas el 30 de octubre', 'Así vivimos LOMAween en la cabina.'),
]
ARMADO = [
    ('Antes: la cabina sin decorar', 'Así estaba la cabina antes de empezar.'),
    ('Antes: otra vista', 'El mismo espacio, listo para transformarse.'),
    ('El equipo armando', 'Manos de todos los turnos.'),
    ('El papel picado, listo', 'Antes de subirlo al techo.'),
    ('Colgando el papel picado', 'Tira por tira, entre todos.'),
    ('Subiendo la decoración', 'Escalera, paciencia y mucho trabajo en equipo.'),
    ('La base del altar', 'La base del tracto, forrada y lista para su carretera.'),
    ('Pegando con silicón', 'Cada detalle, hecho a mano.'),
]
def fotos(carpeta, datos):
    archivos = sorted(f for f in os.listdir(R + carpeta) if f.endswith('.jpg'))
    assert len(archivos) == len(datos), (carpeta, len(archivos))
    return [(R + carpeta + '/' + a, t, d) for a, (t, d) in zip(archivos, datos)]

def hoja_foto(n, total, ruta, titulo, desc, seccion):
    return f'''<section class="hoja foto"><div class="marco"><img src="file://{ruta}"></div>
  <div class="pie"><div class="num">{n:02d}</div><div class="txt"><div class="t">{html.escape(titulo)}</div><div class="d">{html.escape(desc)}</div></div>
  <div class="sec">{seccion} · {n} de {total}</div></div></section>'''

def separador(chip, titulo, sub):
    return f'''<section class="hoja sep"><div class="chip">{chip}</div><div class="st">{titulo}</div><div class="ss">{sub}</div></section>'''

D, A = fotos('Decoracion', DECO), fotos('Armado_en_equipo', ARMADO)
cuerpo = [f'''<section class="hoja portada"><img class="logo" src="file:///tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/jurado_clips/fotos/logo_nuevo.webp">
  <div class="pt">LA 57 DE LAS ÁNIMAS</div><div class="ps">FOTOS DE LA DECORACIÓN</div>
  <div class="pg">ÁREA DE BLINDAJE CENTINELA · EQUIPO 2 · TROB · LOMAWEEN 2026</div></section>''']
cuerpo.append(separador('PARTE 1', 'LA DECORACIÓN', 'Un altar en forma de tracto, su carretera y una cabina que cuida cada kilómetro'))
cuerpo += [hoja_foto(i + 1, len(D), *x, 'LA DECORACIÓN') for i, x in enumerate(D)]
cuerpo.append(separador('PARTE 2', 'EL ARMADO EN EQUIPO', 'Del antes al después, entre todos los turnos'))
cuerpo += [hoja_foto(i + 1, len(A), *x, 'EL ARMADO EN EQUIPO') for i, x in enumerate(A)]
css = f'''
@font-face{{font-family:Anton;src:url({F}anton-latin-400-normal.woff2)}}
@font-face{{font-family:M;font-weight:800;src:url({F}montserrat-latin-800-normal.woff2)}}
@font-face{{font-family:M;font-weight:900;src:url({F}montserrat-latin-900-normal.woff2)}}
@font-face{{font-family:M;font-weight:700;src:url({F}montserrat-latin-700-normal.woff2)}}
@font-face{{font-family:PF;font-style:italic;font-weight:400;src:url({F}playfair-display-latin-400-italic.woff2)}}
@page{{size:11in 8.5in;margin:0}}
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{background:#0C0810}}
.hoja{{width:11in;height:8.5in;position:relative;overflow:hidden;page-break-after:always;background:radial-gradient(ellipse at 50% 35%,#1C1128,#08060C 78%);color:#fff}}
.foto .marco{{position:absolute;left:.45in;right:.45in;top:.4in;height:6.55in;display:flex;align-items:center;justify-content:center}}
.foto img{{max-width:100%;max-height:100%;border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,.6);border:4px solid #F3E7CC}}
.pie{{position:absolute;left:.45in;right:.45in;bottom:.32in;height:1.05in;display:flex;align-items:center;gap:.22in;border-top:3px solid #FF6A00;padding-top:.12in}}
.num{{font-family:Anton;font-size:46px;color:#FF6A00;line-height:1}}
.txt{{flex:1}}
.t{{font-family:Anton;font-size:30px;letter-spacing:.5px;line-height:1.1}}
.d{{font-family:PF;font-style:italic;font-size:18px;color:#FFE2CC;margin-top:4px;line-height:1.3}}
.sec{{font-family:M;font-weight:800;font-size:11px;letter-spacing:3px;color:#B9A9C9;align-self:flex-end;white-space:nowrap}}
.portada{{text-align:center}}
.portada .logo{{width:4.7in;height:4.7in;margin-top:.3in;-webkit-mask-image:radial-gradient(circle,#000 52%,transparent 71%)}}
.pt{{font-family:Anton;font-size:64px;letter-spacing:2px;color:#fff;text-shadow:0 0 22px rgba(255,90,0,.8)}}
.ps{{font-family:M;font-weight:900;font-size:22px;letter-spacing:10px;color:#FFB300;margin-top:8px}}
.pg{{font-family:M;font-weight:800;font-size:13px;letter-spacing:5px;color:#C9D3EA;margin-top:22px}}
.sep{{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}}
.chip{{font-family:M;font-weight:900;font-size:16px;letter-spacing:5px;background:#FF5A00;padding:8px 22px;border-radius:999px}}
.st{{font-family:Anton;font-size:84px;letter-spacing:2px;margin-top:22px;text-shadow:0 0 26px rgba(255,90,0,.75)}}
.ss{{font-family:PF;font-style:italic;font-size:24px;color:#FFE2CC;margin-top:14px}}
'''
open(os.path.join(os.path.dirname(__file__), 'album.html'), 'w').write(f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>La 57 de las Ánimas · Fotos de la decoración</title><style>{css}</style></head><body>{"".join(cuerpo)}</body></html>')
print('hojas', len(cuerpo))
