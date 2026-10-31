# Lista de cortes del video final del jurado (versión 2). Arma timeline.json para la composición y la mezcla.
# Tiempos de los clips en segundos del clip original. Las animaciones salen de anim_*.mp4 (render HD de la muestra 4 sin marca).
# Versión 2: sin difuminar pantallas, logo nuevo, tarjetas de los tres objetivos, cámara rápida del armado, más «¡10-4!»,
# sin el conteo «1, 2, 3» de quien graba y con mejores tomas para el tracto y «Hoy terminamos esta misión».
import json

ANIM_M4 = {'A': 0.0, 'B': 26.4, 'PC1': 59.9, 'PC2': 67.9, 'PC3': 75.7, 'LL': 153.6, 'CI': 161.0}
TV877 = '/home/user/AUTOEVALUACION-PRE-VIAJE/video-lomaween-centinela/Centinela_LOMAween_TV_1080p.mp4'
DIFUMINAR = False  # la cabina pidió que las pantallas se vean tal cual

# los tres objetivos de Grupo Loma: color, carta y lema de cada uno
OBJ = {1: dict(nombre='TRABAJO EN EQUIPO', color='#16A394', carta=1, lema='Cada turno suma: aquí nadie llega solo.'),
       2: dict(nombre='ENFOQUE A RESULTADOS', color='#F5B400', carta=2, lema='Cada alerta atendida es alguien que regresa a casa.'),
       3: dict(nombre='PASIÓN', color='#8A3DF0', carta=3, lema='Lo que se hace con el corazón se nota en los detalles.')}

tomas, audio, capas = [], [], []
T = [0.0]

def toma(src, ini, fin, *, sec, aud='voz', gan=1.0, zoom=(1.0, 1.0), centro=(.5, .5), blur=None, grade='0,1.04,1.06,0.15',
         trans='corte', rot=0, vel=1.0, subs=(), aud_ini=None, aud_fin=None, enf=None, datos=None):
    """Agrega una toma al final; aud: voz (diálogo), amb (ambiente bajo), mudo, anim (mezcla de la muestra), 877."""
    dur = (fin - ini) / vel
    t0 = T[0]
    tomas.append(dict(id=f't{len(tomas):03d}', src=src, ini=ini, fin=fin, dur=round(dur, 4), t0=round(t0, 4), sec=sec, zoom=zoom,
                      centro=centro, blur=(blur or []) if DIFUMINAR else [], grade=grade, trans=trans, rot=rot, vel=vel, datos=datos))
    if aud != 'mudo':
        a = aud_ini if aud_ini is not None else ini
        audio.append(dict(t0=round(t0 + (a - ini) / vel, 4), src=src, ini=a, fin=aud_fin or fin, tipo=aud, gan=gan, vel=vel))
    for a, b, txt in subs:  # subtítulos en tiempos del clip
        capas.append(dict(tipo='sub', t0=round(t0 + (a - ini) / vel, 4), t1=round(t0 + (b - ini) / vel, 4), txt=txt, enf=enf))
    T[0] = t0 + dur
    return t0

def voz_suelta(src, ini, fin, t0, gan=1.0, subs=(), enf=None):
    """Diálogo que sigue sonando aunque la imagen cambie (tomas de apoyo encima)."""
    audio.append(dict(t0=round(t0, 4), src=src, ini=ini, fin=fin, tipo='voz', gan=gan, vel=1.0))
    for a, b, txt in subs:
        capas.append(dict(tipo='sub', t0=round(t0 + a - ini, 4), t1=round(t0 + b - ini, 4), txt=txt, enf=enf))

def capa(tipo, t0, t1, **k): capas.append(dict(tipo=tipo, t0=round(t0, 4), t1=round(t1, 4), **k))

def tercio(t0, t1, alias, rol, cartas=(), num=None):
    capa('tercio', t0, t1, alias=alias, rol=rol, cartas=list(cartas), num=num)

def objetivo(n, sec):
    """Tarjeta de pantalla completa del objetivo n, y su insignia en la esquina durante toda la sección."""
    o = OBJ[n]
    toma(f'obj{n}', 0, 3.8, sec=sec, aud='mudo', trans='flash', datos=dict(n=n, **o))
    return T[0]

def insignia(n, t0, t1): capa('insignia', t0, t1, n=n, **OBJ[n])

# ---------- 1 · apertura: el espacio, la Catrina en brasas y el logo nuevo ----------
toma('anim_A', 0, 19.6, sec='apertura', aud='anim')
audio[-1]['fin'] = 26.4  # la música de la apertura sigue debajo del logo y el título
toma('logo', 0, 4.2, sec='apertura', aud='mudo', trans='corte')
toma('titulo', 0, 2.6, sec='apertura', aud='mudo', trans='fundido')

# ---------- 2 · la lotería ----------
t = toma('c27', 4.1, 7.7, sec='loteria', aud='amb', gan=.5, trans='flash')
capa('seccion', t + .2, t + 5.6, chip='RECLUTAMIENTO', titulo='LA LOTERÍA DE LAS MISIONES', sub='La Base baraja y reparte una carta a cada Centinela')
toma('c28', 10.6, 13.0, sec='loteria', aud='amb', gan=.5)

# cada Centinela recibe su carta, la canta y dice «¡Me tocó…!»
t = toma('c34', 5.8, 10.5, sec='loteria', subs=[(6.3, 8.2, 'Si uno se detiene… nos detenemos todos.'), (8.2, 10.28, '¡A mí me tocó el Trabajo en Equipo!')])
t2 = toma('c34', 12.9, 15.6, sec='loteria', trans='latigo', subs=[(13.08, 14.79, '¡Y también el Papel Picado!')])
tercio(t + .5, t2 + 2.6, 'OJO DE HALCÓN', 'Monitorea las unidades en el mapa', [1, 4], 'CENTINELA 1')
t = toma('c11', 6.0, 10.9, sec='loteria', trans='latigo', subs=[(7.38, 8.95, 'Por ella se va… y por ella se regresa.'), (9.2, 10.5, '¡Me tocó la Carretera!')])
tercio(t + .4, T[0] - .1, 'LA DE LAS ALERTAS', 'Exceso de velocidad y fatiga', [6], 'CENTINELA 2')
t = toma('c44', 4.3, 9.8, sec='loteria', trans='latigo', subs=[(4.73, 7.5, 'Alumbra el camino… de los que se nos adelantaron.'), (7.5, 9.2, '¡Me tocó la Cruz!')])
tercio(t + .4, T[0] - .1, 'LA RESCATISTA', 'Coordina el rescate carretero', [7], 'CENTINELA 3')
t = toma('c16', 12.6, 19.0, sec='loteria', trans='latigo', subs=[(12.98, 15.6, 'Muy elegante y bien peinada… pero en carretera ni la invitamos.'), (16.0, 17.2, '¡Me tocó la Catrina!')])
tercio(t + .4, T[0] - .1, 'CAZA JAMMERS', 'Jammers y desvíos de ruta', [10], 'CENTINELA 4')
t = toma('c60', 6.35, 11.4, sec='loteria', trans='latigo', subs=[(6.7, 8.3, 'Nunca deja sola… a su caja.'), (8.84, 10.6, '¡Me tocó el Tracto!')])
tercio(t + .4, T[0] - .1, 'EL ARQUITECTO', 'Armó el altar', [5], 'CENTINELA 5')
t = toma('c32', 19.3, 24.9, sec='loteria', trans='latigo', subs=[(19.71, 22.1, 'Mandarina, pan… y cacahuate.'), (22.1, 24.3, '¡A mí me tocó la Ofrenda!')])
tercio(t + .4, T[0] - .1, 'MANOS DE CEMPASÚCHIL', 'La ofrenda y las flores', [9], 'CENTINELA 6')
t = toma('c46', 71.6, 77.6, sec='loteria', trans='latigo', aud_fin=76.65, subs=[(71.96, 74.1, 'A tiempo, completos… y sin ningún rasguño.'), (74.1, 75.8, '¡A mí me tocó el Resultado!')])
tercio(t + .4, T[0] - .1, 'EL TURNO DE LA NOCHE', 'Monitorea en el turno nocturno', [2], 'CENTINELA 7')
t = toma('c28', 21.2, 24.4, sec='loteria', aud='amb', gan=.4, trans='latigo')
capa('lema', t + .2, t + 3.2, txt='10 CARTAS · 10 MISIONES · UN SOLO EQUIPO')

# ---------- 3 · la bitácora y el ¡10-4! de toda la cabina ----------
toma('anim_B', 0, 13.9, sec='bitacora', aud='anim', trans='flash')
DIEZ4 = [('c07', 2.2, 3.4, 'mudo'), ('c09', 1.0, 2.1, 'mudo'), ('c09', 5.25, 6.55, 'voz'), ('c09', 8.15, 9.25, 'voz'), ('c07', 15.0, 16.3, 'mudo'),
         ('c09', 12.3, 13.4, 'mudo'), ('c09', 15.7, 16.9, 'voz'), ('c08', 4.2, 5.4, 'mudo'), ('c07', 18.6, 20.0, 'mudo')]
for k, (c, a, b, au) in enumerate(DIEZ4):
    t = toma(c, a, b, sec='bitacora', aud=au, trans='flash' if k == 0 else 'corte')
    capa('sello', t + .12, t + (b - a) - .05, txt='¡10-4!', lado=[0, 1, 0, 1, 0, 1, 0, 0, 0][k])  # del lado contrario a la cara
capa('chip', T[0] - 2.4, T[0] - .1, txt='TODA LA CABINA LISTA · ARRANCA EL VIAJE')

# ---------- 4 · objetivo 1 · Trabajo en Equipo ----------
toma('anim_PC1', 0.3, 3.3, sec='pc1', aud='anim', trans='flash')
ini1 = objetivo(1, 'pc1')
t = toma('c36', 9.25, 11.92, sec='pc1', aud='mudo', zoom=(1.32, 1.42), centro=(.78, .42), trans='flash')
voz_suelta('c36', 9.25, 17.6, t, enf=1, subs=[(9.34, 11.6, 'Este altar tiene manos de todos los turnos.'), (11.9, 13.95, 'Uno comienza, otro continúa…'), (14.2, 17.5, '…y al final, todos cuidamos el regreso de alguien a casa.')])
toma('c24', 13.75, 14.85, sec='pc1', aud='mudo', grade='0.02,1.05,1.08,0.15')
toma('c02', 3.0, 4.3, sec='pc1', aud='mudo')
t = toma('c36', 14.15, 17.75, sec='pc1', aud='mudo', zoom=(1.42, 1.52), centro=(.78, .42))
tercio(t + .2, T[0] - .1, 'OJO DE HALCÓN', 'Monitorea las unidades en el mapa', [1])
# el armado en cámara rápida: el papel picado, los escritorios y el altar
t = toma('mat:video_armado_2', 0.0, 11.6, sec='pc1', aud='mudo', vel=4.0, trans='flash')
capa('lema', t + .3, t + 7.2, txt='HECHO A MANO, ENTRE TODOS LOS TURNOS')
toma('c25', 0.0, 12.0, sec='pc1', aud='mudo', vel=5.0)
toma('c03', 2.0, 26.0, sec='pc1', aud='mudo', vel=8.0)
toma('c24', 12.0, 24.0, sec='pc1', aud='mudo', vel=5.0)
capa('rapido', t, T[0])
toma('mat:video_armado_3', 0.2, 6.2, sec='pc1', aud='mudo', vel=1.5, trans='latigo')
toma('foto:armado_silicon', 0, 1.4, sec='pc1', aud='mudo', zoom=(1.0, 1.1), centro=(.5, .45))
t = toma('c18', 0.0, 5.45, sec='pc1', trans='flash', enf=1, subs=[(0.0, 2.5, 'Aquí ningún viaje se hace solo:'), (2.5, 5.0, 'aquí trabajamos todos por él.')])
tercio(t + 1.6, T[0] - .1, 'LA DE LAS ALERTAS', 'Exceso de velocidad y fatiga', [6])
toma('c40', 13.6, 15.4, sec='pc1', aud='mudo')  # el choque de manos, sin el conteo de quien graba
insignia(1, ini1, T[0])

# ---------- 5 · objetivo 2 · Enfoque a Resultados ----------
toma('anim_PC2', 0.3, 3.3, sec='pc2', aud='anim', trans='flash')
ini2 = objetivo(2, 'pc2')
t = toma('c49', 3.85, 13.2, sec='pc2', zoom=(1.04, 1.12), centro=(.62, .4), trans='flash', enf=2,
         subs=[(3.97, 8.1, 'Atender cada alerta y estar al pendiente de cada estatus es un propósito:'), (9.0, 11.2, 'para llegar a casa y decir que todo está bien,'), (11.5, 13.1, 'al final de cada viaje.')])
tercio(t + 4.3, T[0] - .2, 'EL TURNO DE LA NOCHE', 'Monitorea en el turno nocturno', [2])
toma('c53', 3.55, 14.5, sec='pc2', zoom=(1.03, 1.1), centro=(.62, .4), aud_ini=3.62, enf=2,
     subs=[(3.82, 5.4, 'Hoy terminamos esta misión…'), (6.1, 8.45, '…con otro deseo: que recordar a quienes se fueron'), (9.3, 14.45, 'nos inspire a cuidar a quienes siguen en el camino.')])
toma('c29', 10.0, 12.6, sec='pc2', aud='mudo', trans='fundido')
insignia(2, ini2, T[0])

# ---------- 6 · objetivo 3 · Pasión y el recorrido ----------
toma('anim_PC3', 0.3, 3.05, sec='pc3', aud='anim', trans='flash')
ini3 = objetivo(3, 'pc3')
t = toma('c29', 4.6, 14.4, sec='pc3', aud='mudo', grade='-0.04,1.0,1.0,0.2', trans='flash')
capa('pasion', t, t + 9.8)

def pieza(t0, t1, n, nombre): capa('pieza', t0, t1, n=n, nombre=nombre)
t = toma('c38', 32.75, 39.6, sec='recorrido', trans='flash', subs=[(32.94, 35.5, 'Cada tira de papel picado es una ruta en el mapa.'), (35.84, 38.9, 'De día y de noche, aquí las seguimos todas, hasta que llegan.')])
pieza(t + .2, T[0] - .2, 1, 'EL PAPEL PICADO'); tercio(t + 2.6, T[0] - .2, 'OJO DE HALCÓN', 'Monitorea las unidades en el mapa', [4])
t = toma('c64', 37.5, 40.15, sec='recorrido', trans='latigo', subs=[(37.7, 40.07, 'Un tracto nunca deja sola a su caja…')])
pieza(t + .2, t + 2.5, 2, 'EL ALTAR EN FORMA DE TRACTO')
t2 = toma('c64', 52.0, 55.0, sec='recorrido', aud='mudo')
voz_suelta('c64', 41.1, 44.1, t2, subs=[(41.19, 44.08, '…y nosotros nunca dejamos sola a una unidad.')])
t3 = toma('c64', 44.45, 47.15, sec='recorrido', subs=[(44.91, 47.0, 'Por eso, nuestro altar es un tracto.')])
pieza(t2, T[0] - .2, 2, 'EL ALTAR EN FORMA DE TRACTO'); tercio(t3 + .1, T[0] - .2, 'EL ARQUITECTO', 'Armó el altar', [5])
t = toma('c26', 10.2, 14.6, sec='recorrido', aud='mudo', trans='latigo')
pieza(t + .2, T[0] - .2, 3, 'LA CARRETERA'); capa('cita', t + .9, T[0] - .3, txt='«Por ella se va… y por ella se regresa.»')
t = toma('c45', 51.0, 58.2, sec='recorrido', trans='latigo', subs=[(51.22, 54.1, 'Cada cruz a la orilla del camino es alguien que no llegó.'), (54.3, 58.05, 'La nuestra, de sal, ilumina los caminos de regreso a casa.')])
pieza(t + .2, T[0] - .2, 4, 'LA CRUZ DE SAL'); tercio(t + 2.8, T[0] - .2, 'LA RESCATISTA', 'Coordina el rescate carretero', [7])
t = toma('c21', 0.05, 3.0, sec='recorrido', trans='latigo', subs=[(0.12, 2.95, 'Aquí la Catrina entierra todos los malos hábitos de la ruta.')])
pieza(t + .2, t + 2.8, 5, 'EL PANTEÓN DE LOS MALOS HÁBITOS'); tercio(t + .5, t + 2.9, 'CAZA JAMMERS', 'Jammers y desvíos de ruta', [10])
t2 = toma('c06', 40.0, 41.9, sec='recorrido', aud='mudo')
voz_suelta('c21', 3.0, 4.45, t2, subs=[(3.44, 4.35, 'Aquí se quedan.')])
pieza(t2, T[0] - .2, 5, 'EL PANTEÓN DE LOS MALOS HÁBITOS')
t = toma('c42', 3.95, 7.15, sec='recorrido', trans='latigo', subs=[(4.07, 6.98, 'Cada escritorio tiene su ofrenda, como una parada en el camino.')])
pieza(t + .2, T[0], 6, 'LAS OFRENDAS DE CADA ESCRITORIO'); tercio(t + .5, T[0] - .1, 'MANOS DE CEMPASÚCHIL', 'La ofrenda y las flores', [9])
t = toma('c06', 47.0, 49.2, sec='recorrido', aud='mudo')
pieza(t, T[0] - .2, 6, 'LAS OFRENDAS DE CADA ESCRITORIO')
t = toma('c23', 4.1, 12.3, sec='recorrido', trans='latigo', subs=[(4.3, 6.5, 'Cada letrero es una alerta que atendemos a diario:'), (7.14, 9.6, 'zona de restricción, parada no autorizada,'), (9.95, 11.7, 'estatus al cliente y zona sin cobertura.')])
pieza(t + .2, T[0] - .2, 7, 'LOS LETREROS DE LA CABINA'); tercio(t + 2.4, t + 6.6, 'LA DE LAS ALERTAS', 'Exceso de velocidad y fatiga', [6])
t = toma('c29', 47.5, 53.0, sec='recorrido', aud='amb', gan=.35, trans='latigo')
capa('tele', t + .3, T[0] + .2)
# el fragmento del 877: bienvenida, la razón más grande y la frase que lo junta todo
toma('877', 0.7, 6.1, sec='877', aud='877', trans='flash')
toma('877', 161.35, 166.95, sec='877', aud='877', trans='fundido')
toma('877', 167.55, 172.9, sec='877', aud='877', trans='fundido')
insignia(3, ini3, T[0] - 16.4)  # la insignia se quita durante el fragmento del 877

# ---------- 7 · los tres objetivos, juntos, y la llegada ----------
toma('resumen', 0, 6.4, sec='resumen', aud='mudo', trans='flash')
toma('anim_LL', 0.35, 4.0, sec='llegada', aud='anim', trans='flash')
t = toma('c39', 0.0, 7.6, sec='llegada', aud_ini=2.62)  # el grito, sin el «una, dos, tres» de quien graba
capa('grito', t + 2.75, t + 7.2, txt='¡DESDE LA CABINA, PROTEGEMOS CADA KILÓMETRO!')
toma('anim_CI', 0.35, 6.4, sec='cierre', aud='anim', trans='flash')

# ---------- 8 · detrás de cámaras ----------
t = toma('vhs', 0, 2.2, sec='tomas', aud='mudo', trans='corte')
TF = T[0]
toma('c56', 16.8, 18.7, sec='tomas', trans='rebobina', subs=[(16.9, 18.6, '¿Ya se me olvidó…?')])
toma('c56', 24.1, 26.7, sec='tomas')
toma('c46', 41.2, 47.0, sec='tomas', trans='rebobina', subs=[(41.25, 45.0, '…trata de agarrarla así, que se vea la esquina…'), (45.6, 46.95, '¡CORTE!')])
toma('c22', 6.3, 9.9, sec='tomas', trans='rebobina', subs=[(6.4, 9.8, '¡Fuerte, fuerte, fuerte!')])
toma('c50', 8.6, 12.5, sec='tomas', trans='rebobina', subs=[(8.74, 10.45, '¿Qué tan nervioso…?'), (11.9, 12.4, 'Respira.')])
toma('c19', 5.9, 9.5, sec='tomas', trans='rebobina')
toma('c61', 1.6, 5.4, sec='tomas', trans='rebobina')
capa('chip', T[0] - 3.6, T[0] - .2, txt='¡SE CAYÓ EL CELULAR!')
toma('c20', 9.5, 11.2, sec='tomas', trans='rebobina')
toma('c41', 3.5, 6.1, sec='tomas', rot=-90, trans='rebobina')
capa('vhs', TF, T[0])
toma('fin', 0, 5.0, sec='fin', aud='mudo', trans='fundido')

total = T[0]
json.dump(dict(total=round(total, 4), tomas=tomas, audio=audio, capas=capas, anim_m4=ANIM_M4, tv877=TV877, obj=OBJ),
          open('timeline.json', 'w'), ensure_ascii=False, indent=1)
secs = {}
for x in tomas: secs[x['sec']] = secs.get(x['sec'], 0) + x['dur']
print(f'total {total:.1f} s ({int(total // 60)}:{total % 60:04.1f})', {k: round(v, 1) for k, v in secs.items()})
