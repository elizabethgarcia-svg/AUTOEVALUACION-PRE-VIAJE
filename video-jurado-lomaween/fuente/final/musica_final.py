# Música y efectos originales del video final (mismos instrumentos sintetizados de la muestra, libres de derechos),
# acomodados a timeline.json: acción en la lotería, swing en Trabajo en Equipo, piano en Resultados y Pasión,
# swing suave en el recorrido, golpe final en la llegada y cumbia en las tomas falsas. Salen dos pistas: música y efectos.
import json, os, numpy as np, soundfile as sf
M = '/tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/jurado/muestra/'
TL = json.load(open('timeline.json'))
TOT = TL['total']
base = open(M + 'musica_m.py').read().split('\n')
exec('\n'.join(base[:236]).replace('TOTAL = 76.5', f'TOTAL = {TOT + 1:.2f}'))
exec('\n'.join(open(M + 'musica_tomas.py').read().split('\n')[6:83]))      # acordeón, güiro, cencerro, congas, cumbia()
exec('\n'.join(open(M + 'musica_m2.py').read().split('\n')[9:46]))         # tom, maraca, staccato, carta, volteo, coro
mus, sfx = Pista(), Pista()

T = TL['tomas']
def sec(nombre):
    xs = [x for x in T if x['sec'] == nombre]; return xs[0]['t0'], xs[-1]['t0'] + xs[-1]['dur']
CAP = TL['capas']

# ---------- lotería: música de acción a 150 BPM ----------
BA = .4
a, b = sec('loteria')
habla = [(c['t0'], c['t1']) for c in CAP if c['tipo'] == 'sub' and a <= c['t0'] < b]
calma = lambda tb: any(x - .2 <= tb < y + .2 for x, y in habla)
ACORDES = [[62, 65, 69], [62, 65, 69], [58, 62, 65], [57, 61, 64]]
OST = [38, 38, 41, 38, 43, 38, 41, 40]
bar = 0
while True:
    t0 = a + bar * 4 * BA
    if t0 >= b - .05: break
    ac = ACORDES[bar % 4]; raiz = {0: 38, 1: 38, 2: 34, 3: 33}[bar % 4]
    for e in range(8):
        tb = t0 + e * BA / 2
        if tb >= b - .05: break
        n = OST[e] + (raiz - 38)
        mus.put(tb, bajo(n, .2), .9 if e % 2 == 0 else .7)
        mus.put(tb, staccato(ac, .12), (.55 if calma(tb) else 1.0) * (1.2 if e % 2 else .9), -.3)
        for s16 in (0, BA / 4): mus.put(tb + s16, maraca(), .8, .4)
        if not calma(tb) or e in (0, 4):
            if e in (0, 3, 4, 7): mus.put(tb, bombo(.4), .8 if not calma(tb) else .5)
            if e in (2, 6) and not calma(tb): mus.put(tb, palmas(), .9); mus.put(tb, tarola(), .6)
    if bar % 2 == 1 and not calma(t0 + 3 * BA):
        for k, n in enumerate((45, 43, 41, 38)): mus.put(t0 + 3 * BA + k * BA / 4, tom(n), .8)
    if bar % 4 == 0 and not calma(t0): mus.put(t0, metales([50, 57, 62], .3), 1.0)
    bar += 1
mus.put(a, platillo(2.0), .8); mus.put(a, timbal(38, 1.2), 1.0)
for k in range(10): sfx.put(a + .5 + k * .05, carta(.8), 1.0, (-1) ** k * .3)       # se barajan
for k in range(8): sfx.put(a + 3.7 + k * .17, carta(1.0), 1.0, (k % 5 - 2) * .2)      # se reparten
golpe_final(b - .05, .7)

# ---------- el ¡10-4! ----------
a2, b2 = [x for x in T if x['sec'] == 'bitacora' and not x['src'].startswith('anim')][0]['t0'], sec('bitacora')[1]
for c in range(int((b2 - a2) / (4 * BEAT)) + 1): compas(a2 + c * 4 * BEAT, TEMA['A'][c % 4], TEMA['A'][(c + 1) % 4], 'full', 'A', c % 4, relleno=(c % 4 == 3))
golpe_final(b2 - .05, .6)

# ---------- Trabajo en Equipo: swing (suave mientras hablan, completo en el armado) ----------
a, b = sec('pc1'); a += 3.0  # después del mapa
arm = [x for x in T if x['src'] == 'mat:video_armado_2'][0]['t0']; f = [x for x in T if x['src'] == 'foto:armado_silicon'][0]; arm1 = f['t0'] + f['dur']
sfx.put(arm - .1, subida(.6), .9)  # la cinta se acelera
n_c = int((b - a) / (4 * BEAT)) + 1
plan = []
for c in range(n_c):
    tc = a + c * 4 * BEAT
    nivel = 'full' if arm - .2 <= tc < arm1 else ('soft' if tc < arm else 'med')
    plan.append((c, 'A' if (c // 4) % 2 == 0 else 'B', nivel, arm - .2 <= tc < arm1))
tramo(a, plan)
shout(arm + 2 * 4 * BEAT - (arm - a) % (4 * BEAT), 'A', 0, .8)
sfx.put(b - 1.6, subida(1.6), .9)

# ---------- Enfoque a Resultados y Pasión: piano y cuerdas ----------
a, b = sec('pc2'); a += 3.0
piano_ac = int((b - a) / 2.2)
exec('\n'.join(open(M + 'musica_m2.py').read().split('\n')[139:147]))  # PIANO y piano_tramo()
piano_tramo(a, piano_ac, 2.2, .85)
a, b = sec('pc3'); a += 2.75
piano_tramo(a, int((b - a) / 2.0) + 1, 2.0, 1.0)
for n in (50, 57, 62, 66): mus.put(a, cuerdas(n, b - a + 1.0, 1.5, 1.2), .9)
mus.put(a + .4, cajita(81, 2.0), .5); mus.put(a + 1.1, cajita(86, 2.0), .45)

# ---------- recorrido: swing suave con melodía, sube entre piezas ----------
a, b = sec('recorrido')
habla = [(c['t0'], c['t1']) for c in CAP if c['tipo'] == 'sub' and a <= c['t0'] < b]
n_c = int((b - a) / (4 * BEAT)) + 1
plan = [(c, 'A' if (c // 4) % 2 == 0 else 'B', 'soft', True) for c in range(n_c)]
tramo(a, plan)
mus.put(a, platillo(1.6), .5)
sfx.put(b - 1.2, subida(1.2), .8)

# ---------- llegada: el grito de todos y el golpe final ----------
g = [x for x in T if x['src'] == 'c39'][0]
for c in range(int(g['dur'] / (4 * BEAT)) + 1): compas(g['t0'] + c * 4 * BEAT, TEMA['A'][c % 4], TEMA['A'][(c + 1) % 4], 'full', 'A', c % 4, relleno=(c % 4 == 3))
golpe_final(g['t0'] + 6.4, 1.0)

# ---------- tomas falsas: cumbia con la cinta ----------
a, b = sec('tomas')
cumbia(a + .9, b, True, .9)
mus.put(a + .9, platillo(1.2), .5)
sfx.put(a, zumbido_cinta(b - a), 1.4)
for x in T:
    if x['trans'] == 'rebobina':
        sfx.put(x['t0'] - .05, rayon(1.0), 1.0); sfx.put(x['t0'] + .1, zumbido(.35, False), .8)
sfx.put(b - .3, trombon_triste(), 1.0)

# ---------- 30 de octubre: la visita, con piano y cuerdas ----------
a, b = sec('visita')
piano_tramo(a, int((b - a) / 2.1) + 1, 2.1, .95)
mus.put(a, platillo(1.8), .5); mus.put(a + .3, cajita(86, 2.2), .5); mus.put(a + 4.5, cajita(81, 2.2), .45)

# ---------- los tres objetivos, juntos ----------
a, b = sec('resumen')
for n in (50, 57, 62, 66, 69): mus.put(a, cuerdas(n, b - a + 1.2, .8, 1.4), 1.0)
for j in range(3): mus.put(a + .5 + j * .5, campana(74 + 5 * j, 2.4), .45, (j - 1) * .4); sfx.put(a + .5 + j * .5, volteo(1.0), .9)
mus.put(a, timbal(38, 1.6), .9); mus.put(a, platillo(2.2), .6)

# ---------- final: acorde y cajita ----------
a, b = sec('fin')
for n in (50, 57, 62, 66, 69): mus.put(a, cuerdas(n, b - a + .5, .6, 1.6), 1.1)
mus.put(a + .3, cajita(74, 2.5), .6); mus.put(a + .8, cajita(81, 2.5), .5); mus.put(a + 1.4, campana(74, 3.0), .4)

# ---------- efectos en cortes y gráficos ----------
for x in T:
    if x['trans'] == 'latigo': sfx.put(x['t0'] - .14, zumbido(.3), 1.0, .2)
    if x['trans'] == 'flash' and x['sec'] not in ('apertura',): sfx.put(x['t0'] - .25, zumbido(.32), .8); sfx.put(x['t0'], boom(1.0), .35)
for c in CAP:
    if c['tipo'] == 'tercio':
        for i in range(len(c['cartas'])): sfx.put(c['t0'] + .1 + i * .18, volteo(1.0), .9, .3)
    if c['tipo'] == 'sello': sfx.put(c['t0'] + .15, sello(), 1.3); sfx.put(c['t0'] + .15, platillo(1.2), .5)
    if c['tipo'] == 'pieza' and not any(o['tipo'] == 'pieza' and o['n'] == c['n'] and o is not c and o['t0'] < c['t0'] for o in CAP):
        sfx.put(c['t0'], campana(86, 1.2), .35, -.3)
    if c['tipo'] in ('valor', 'seccion'): sfx.put(c['t0'], timbal(38, 1.0), .9); sfx.put(c['t0'], platillo(1.4), .45)
for x in T:
    if x['src'].startswith('obj'):  # tarjeta de cada objetivo: golpe, carta que se voltea y campanita
        sfx.put(x['t0'], timbal(38, 1.4), 1.1); sfx.put(x['t0'], platillo(1.8), .6); sfx.put(x['t0'] + .2, volteo(1.2), 1.0)
        mus.put(x['t0'] + .6, campana(81, 2.0), .45); sfx.put(x['t0'] + .55, zumbido(.4), .7)
    if c['tipo'] == 'pasion':
        sfx.put(c['t0'] + .3, volteo(1.2), 1.0); sfx.put(c['t0'] + .3, zumbido(.6), .6)

def reverb(x, dur=2.0, mezcla=.22):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros_like(x)
    L = 1 << int(np.ceil(np.log2(len(x) + n)))
    for ch in range(2):
        ir = rng.normal(0, 1, n) * np.exp(-t * 3.2); ir[0] = 0; ir = filtro(ir, hi=5000); ir /= np.sqrt(np.sum(ir ** 2))
        y[:, ch] = np.fft.irfft(np.fft.rfft(x[:, ch], L) * np.fft.rfft(ir, L), L)[: len(x)]
    return x * (1 - mezcla) + y * mezcla
m = reverb(mus.x, 2.2, .24); m = np.tanh(m / (np.percentile(np.abs(m), 99.9) + 1e-9) * .9) * .6
s = reverb(sfx.x, 1.2, .18)
sf.write('musica_final.wav', m.astype(np.float32), SR, subtype='FLOAT')
sf.write('sfx_final.wav', s.astype(np.float32), SR, subtype='FLOAT')
print('ok', len(m) / SR)
