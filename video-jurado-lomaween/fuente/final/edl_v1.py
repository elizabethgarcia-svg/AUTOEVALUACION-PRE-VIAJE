# Lista de cortes del video final del jurado. Arma timeline.json (para la composición y la mezcla) y la lista de tramos que hay que extraer.
# Tiempos de los clips en segundos del clip original. Las animaciones salen de anim_*.mp4 (render HD de la muestra 4 sin marca).
import json

ANIM_M4 = {'A': 0.0, 'B': 26.4, 'PC1': 59.9, 'PC2': 67.9, 'PC3': 75.7, 'LL': 153.6, 'CI': 161.0}
TV877 = '/home/user/AUTOEVALUACION-PRE-VIAJE/video-lomaween-centinela/Centinela_LOMAween_TV_1080p.mp4'

tomas, audio, capas = [], [], []
T = [0.0]

def toma(src, ini, fin, *, sec, aud='voz', gan=1.0, zoom=(1.0, 1.0), centro=(.5, .5), blur=None, grade='0,1.04,1.06,0.15',
         trans='corte', rot=0, vel=1.0, capas_rel=(), subs=(), nombre=None, aud_fin=None):
    """Agrega una toma al final; aud: voz (diálogo), amb (ambiente bajo), mudo, anim (mezcla de la muestra), 877."""
    dur = (fin - ini) / vel
    t0 = T[0]
    tomas.append(dict(id=f't{len(tomas):03d}', src=src, ini=ini, fin=fin, dur=round(dur, 4), t0=round(t0, 4), sec=sec, zoom=zoom,
                      centro=centro, blur=blur or [], grade=grade, trans=trans, rot=rot, vel=vel, nombre=nombre))
    if aud != 'mudo':
        audio.append(dict(t0=round(t0, 4), src=src, ini=ini, fin=aud_fin or fin, tipo=aud, gan=gan, vel=vel))
    for c in capas_rel:
        c = dict(c); c['t0'] = round(t0 + c['t0'], 4); c['t1'] = round(t0 + c['t1'], 4); capas.append(c)
    for a, b, txt in subs:  # subtítulos en tiempos del clip
        capas.append(dict(tipo='sub', t0=round(t0 + (a - ini) / vel, 4), t1=round(t0 + (b - ini) / vel, 4), txt=txt))
    T[0] = t0 + dur
    return t0

def voz_suelta(src, ini, fin, t0, gan=1.0, subs=()):
    """Diálogo que sigue sonando aunque la imagen cambie (tomas de apoyo encima)."""
    audio.append(dict(t0=round(t0, 4), src=src, ini=ini, fin=fin, tipo='voz', gan=gan, vel=1.0))
    for a, b, txt in subs:
        capas.append(dict(tipo='sub', t0=round(t0 + a - ini, 4), t1=round(t0 + b - ini, 4), txt=txt))

def capa(tipo, t0, t1, **k): capas.append(dict(tipo=tipo, t0=round(t0, 4), t1=round(t1, 4), **k))

def tercio(t0, t1, alias, rol, cartas=(), num=None):
    capa('tercio', t0, t1, alias=alias, rol=rol, cartas=list(cartas), num=num)

# ---------- 1 · apertura ----------
toma('anim_A', 0, 26.4, sec='apertura', aud='anim')

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

# ---------- 3 · la bitácora y el ¡10-4! ----------
toma('anim_B', 0, 13.9, sec='bitacora', aud='anim', trans='flash')
B09 = [[5.0, 0, 150, 300, 260, 'm'], [5.0, 330, 165, 185, 145, 'm'], [5.0, 500, 140, 85, 105, 'm'], [5.0, 235, 445, 105, 75, 'm'], [5.0, 750, 140, 60, 70, 'm'],
       [6.6, 0, 110, 200, 320, 'm'], [6.6, 235, 125, 230, 180, 'm'], [6.6, 460, 100, 90, 125, 'm'], [6.6, 85, 485, 145, 85, 'm'], [6.6, 725, 105, 85, 60, 'm']]
t = toma('c09', 5.1, 6.7, sec='bitacora', blur=B09, trans='flash', subs=[(5.6, 6.3, '¡10-4!')])
capa('sello', t + .5, t + 1.6, txt='¡10-4!')
B08 = [[4.7, 0, 195, 245, 310, 'o'], [5.5, 95, 215, 225, 280, 'o'], [6.4, 280, 245, 100, 155, 'o'], [4.7, 215, 195, 230, 140, 'm'], [5.5, 275, 205, 195, 120, 'm'], [6.4, 365, 245, 130, 85, 'm'],
       [4.7, 460, 145, 100, 60, 'b'], [5.5, 470, 155, 65, 50, 'b'], [6.4, 490, 210, 75, 55, 'b'], [4.7, 735, 115, 60, 40, 'f'], [5.5, 715, 120, 80, 35, 'f'], [6.4, 725, 185, 60, 45, 'f']]
t = toma('c08', 4.7, 6.4, sec='bitacora', aud='amb', gan=.4, blur=B08)
capa('chip', t + .1, t + 1.7, txt='TODOS LISTOS · ARRANCA EL VIAJE')

# ---------- 4 · punto de control 1 · Trabajo en Equipo ----------
toma('anim_PC1', 0.3, 3.3, sec='pc1', aud='anim', trans='flash')
t = toma('c36', 9.25, 11.92, sec='pc1', aud='mudo', zoom=(1.32, 1.42), centro=(.78, .42))
voz_suelta('c36', 9.25, 17.6, t, subs=[(9.34, 11.6, 'Este altar tiene manos de todos los turnos.'), (11.9, 13.95, 'Uno comienza, otro continúa…'), (14.2, 17.5, '…y al final, todos cuidamos el regreso de alguien a casa.')])
capa('valor', t + .1, t + 4.0, k='PUNTO DE CONTROL 1', v='TRABAJO EN EQUIPO')
toma('c24', 13.75, 14.85, sec='pc1', aud='mudo', grade='0.02,1.05,1.08,0.15', blur=[[0, 650, 60, 330, 110, 'm']])
toma('c02', 3.0, 4.3, sec='pc1', aud='mudo', blur=[[0, 760, 200, 264, 200, 'm']])
t = toma('c36', 14.15, 17.75, sec='pc1', aud='mudo', zoom=(1.42, 1.52), centro=(.78, .42))
tercio(t + .2, T[0] - .1, 'OJO DE HALCÓN', 'Monitorea las unidades en el mapa', [1])
# el armado, entre todos los turnos
t = toma('foto:armado_silicon', 0, 1.7, sec='pc1', aud='mudo', zoom=(1.0, 1.12), centro=(.5, .45), trans='flash')
capa('lema', t + .2, t + 6.6, txt='HECHO A MANO, ENTRE TODOS LOS TURNOS')
toma('c24', 18.2, 19.7, sec='pc1', aud='mudo')
toma('c25', 0.6, 2.0, sec='pc1', aud='mudo', blur=[[0, 310, 360, 175, 125, 'a'], [0, 620, 350, 110, 85, 'b'], [0, 65, 385, 185, 150, 'c'], [0, 890, 330, 134, 65, 'd']])
toma('c05', 10.0, 11.4, sec='pc1', aud='mudo')
toma('foto:armado_altar', 0, 1.3, sec='pc1', aud='mudo', zoom=(1.08, 1.0), centro=(.5, .5))
B18 = [[0, 205, 125, 230, 270, 'o'], [1, 125, 110, 275, 295, 'o'], [1.8, 0, 70, 350, 430, 'o'], [2.5, 0, 45, 325, 380, 'o'], [4.2, 0, 65, 325, 360, 'o'], [5.5, 0, 75, 325, 350, 'o'],
       [0, 425, 145, 205, 130, 'm'], [1, 395, 125, 220, 140, 'm'], [1.8, 340, 90, 255, 230, 'm'], [2.5, 305, 75, 275, 175, 'm'], [4.2, 310, 85, 275, 175, 'm'], [5.5, 315, 85, 275, 175, 'm'],
       [0, 680, 95, 150, 95, 'b'], [1, 675, 85, 160, 95, 'b'], [1.4, 670, 80, 150, 90, 'b']]
t = toma('c18', 0.0, 5.45, sec='pc1', blur=B18, trans='flash', subs=[(0.0, 2.5, 'Aquí ningún viaje se hace solo:'), (2.5, 5.0, 'aquí trabajamos todos por él.')])
tercio(t + 1.6, T[0] - .1, 'LA DE LAS ALERTAS', 'Exceso de velocidad y fatiga', [6])
toma('c40', 13.6, 15.4, sec='pc1', aud='amb', gan=.55)

# ---------- 5 · punto de control 2 · Enfoque a Resultados ----------
toma('anim_PC2', 0.3, 3.3, sec='pc2', aud='anim', trans='flash')
B49 = [[0, 0, 120, 215, 380, 'm'], [0, 225, 35, 190, 125, 'b']]
t = toma('c49', 3.85, 13.2, sec='pc2', blur=B49, zoom=(1.04, 1.12), centro=(.62, .4),
         subs=[(3.97, 8.1, 'Atender cada alerta y estar al pendiente de cada estatus es un propósito:'), (9.0, 11.2, 'para llegar a casa y decir que todo está bien,'), (11.5, 13.1, 'al final de cada viaje.')])
capa('valor', t + .1, t + 4.0, k='PUNTO DE CONTROL 2', v='ENFOQUE A RESULTADOS')
tercio(t + 4.3, T[0] - .2, 'EL TURNO DE LA NOCHE', 'Monitorea en el turno nocturno', [2])
B55 = [[0, 0, 75, 185, 375, 'w'], [0, 150, 80, 295, 225, 'm'], [0, 935, 75, 89, 140, 'b']]
toma('c55', 30.95, 38.5, sec='pc2', blur=B55, zoom=(1.03, 1.1), centro=(.6, .4),
     subs=[(31.2, 33.3, 'Hoy terminamos esta misión con otro deseo:'), (33.5, 35.7, 'que recordar a quienes se fueron'), (35.7, 38.3, 'nos inspire a cuidar a quienes siguen en el camino.')])
toma('c29', 10.0, 12.6, sec='pc2', aud='mudo', trans='fundido')

# ---------- 6 · punto de control 3 · Pasión y el recorrido ----------
toma('anim_PC3', 0.3, 3.05, sec='pc3', aud='anim', trans='flash')
t = toma('c29', 4.6, 14.4, sec='pc3', aud='mudo', grade='-0.04,1.0,1.0,0.2')
capa('pasion', t, t + 9.8)

def pieza(t0, t1, n, nombre): capa('pieza', t0, t1, n=n, nombre=nombre)
t = toma('c38', 32.75, 39.6, sec='recorrido', trans='flash', subs=[(32.94, 35.5, 'Cada tira de papel picado es una ruta en el mapa.'), (35.84, 38.9, 'De día y de noche, aquí las seguimos todas, hasta que llegan.')])
pieza(t + .2, T[0] - .2, 1, 'EL PAPEL PICADO'); tercio(t + 2.6, T[0] - .2, 'OJO DE HALCÓN', 'Monitorea las unidades en el mapa', [4])
t = toma('c62', 3.35, 5.9, sec='recorrido', trans='latigo', subs=[(3.45, 5.8, 'Un tracto nunca deja sola a su caja…')])
pieza(t + .2, t + 2.4, 2, 'EL ALTAR EN FORMA DE TRACTO')
t2 = toma('c05', 9.7, 13.0, sec='recorrido', aud='mudo')
voz_suelta('c62', 7.0, 10.3, t2, subs=[(7.07, 9.6, '…y nosotros nunca dejamos sola a una unidad.')])
t3 = toma('c62', 10.3, 13.6, sec='recorrido', subs=[(10.3, 13.55, 'Por eso, nuestro altar es un tracto.')])
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
B29 = [[47.5, 0, 430, 1024, 146, 'm'], [53.0, 0, 470, 1024, 106, 'm']]
t = toma('c29', 47.5, 53.0, sec='recorrido', aud='amb', gan=.35, blur=B29, trans='latigo')
capa('tele', t + .3, T[0] + .2)
# el fragmento del 877: bienvenida, la razón más grande y la frase que lo junta todo
toma('877', 0.7, 6.1, sec='877', aud='877', trans='flash')
toma('877', 161.35, 166.95, sec='877', aud='877', trans='fundido')
toma('877', 167.55, 172.9, sec='877', aud='877', trans='fundido')

# ---------- 7 · llegada ----------
toma('anim_LL', 0.35, 4.0, sec='llegada', aud='anim', trans='flash')
t = toma('c39', 0.0, 7.6, sec='llegada', gan=1.0)
capa('grito', t + 2.75, t + 7.2, txt='¡DESDE LA CABINA, PROTEGEMOS CADA KILÓMETRO!')
toma('anim_CI', 0.35, 6.4, sec='cierre', aud='anim', trans='flash')

# ---------- 8 · tomas falsas ----------
t = toma('vhs', 0, 2.2, sec='tomas', aud='mudo', trans='corte')
TF = T[0]
toma('c56', 16.8, 18.7, sec='tomas', trans='rebobina', blur=[[0, 640, 170, 200, 150, 'l'], [0, 855, 190, 169, 245, 'y']], subs=[(16.9, 18.6, '¿Ya se me olvidó…?')])
toma('c56', 24.1, 26.7, sec='tomas', blur=[[0, 575, 140, 195, 165, 'l']])
toma('c46', 41.2, 47.0, sec='tomas', trans='rebobina', blur=[[0, 650, 275, 374, 125, 'm']], subs=[(41.25, 45.0, '…trata de agarrarla así, que se vea la esquina…'), (45.6, 46.95, '¡CORTE!')])
toma('c22', 6.3, 9.9, sec='tomas', trans='rebobina', blur=[[7, 555, 335, 215, 145, 'l'], [9.5, 590, 200, 175, 145, 'l'], [7, 1000, 380, 24, 150, 'r'], [9.5, 890, 365, 134, 170, 'r']], subs=[(6.4, 9.8, '¡Fuerte, fuerte, fuerte!')])
toma('c50', 8.6, 12.5, sec='tomas', trans='rebobina', blur=[[0, 0, 160, 200, 275, 'a'], [0, 200, 90, 115, 85, 'b'], [0, 680, 95, 95, 65, 'c'], [0, 880, 75, 144, 100, 'd']], subs=[(8.74, 10.45, '¿Qué tan nervioso…?'), (11.9, 12.4, 'Respira.')])
toma('c19', 5.9, 9.5, sec='tomas', trans='rebobina')
toma('c61', 1.6, 5.4, sec='tomas', trans='rebobina', blur=[[1.6, 625, 205, 310, 135, 'm'], [3.0, 625, 205, 310, 135, 'm']])
capa('chip', T[0] - 3.6, T[0] - .2, txt='¡SE CAYÓ EL CELULAR!')
toma('c20', 9.5, 11.2, sec='tomas', trans='rebobina', blur=[[0, 15, 145, 285, 100, 'm']])
toma('c41', 3.5, 6.1, sec='tomas', rot=-90, trans='rebobina')
capa('vhs', TF, T[0])
toma('fin', 0, 4.0, sec='fin', aud='mudo', trans='fundido')

total = T[0]
json.dump(dict(total=round(total, 4), tomas=tomas, audio=audio, capas=capas, anim_m4=ANIM_M4, tv877=TV877),
          open('timeline.json', 'w'), ensure_ascii=False, indent=1)
secs = {}
for x in tomas: secs[x['sec']] = secs.get(x['sec'], 0) + x['dur']
print(f'total {total:.1f} s ({int(total // 60)}:{total % 60:04.1f})', {k: round(v, 1) for k, v in secs.items()})
