# Plano de la tele sin el letrero azul (ahora los letreros grandes van sobre los monitores, hoja 3)
src = open('deco/planos.py').read()
cab = src.split('# ---------- 1. papel picado ----------')[0]
sec = src.split('# ---------- 2. la tele ----------')[1].split('# ---------- 3. escritorios ----------')[0]
rep = [("for n, x, y in [(1, 320, 120)", "im.convert('RGB').save('deco/tele_limpio.jpg', quality=93)\nfor n, x, y in [(1, 320, 120)"),
       ("colgar(im, senal('azul', 600, ['ZONA DE', 'DESCANSO']), 705, 438, 236, techo=300)\n", ''),
       ("(5, 705, 360)", "(5, 640, 515)"),
       ("(5, 'Letrero azul \"Zona de descanso\"', 'como la parada del video')", "(5, 'Letreros sobre los monitores', 'colgados con nylon: ver hoja 3')"),
       ("'deco/2_tele.jpg'", "'deco/n2_tele.jpg'"),
       ("'2 · La tele: zona de descanso'", "'2 · La tele: el 877 con ojos'")]
for a, b in rep:
    assert sec.count(a) == 1, a; sec = sec.replace(a, b)
exec(cab + sec)
