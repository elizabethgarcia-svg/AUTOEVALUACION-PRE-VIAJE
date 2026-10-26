# Arma muestra2.html: reutiliza escenas de muestra.html y agrega las nuevas (Catrina, logo, lotería, puente y 877).
L = open('muestra.html').read().split('\n')
blk = lambda a, b: '\n'.join(L[a - 1:b])

CSS = r'''
.carta3d{position:absolute;width:150px;height:220px;transform-style:preserve-3d}
.carta3d .f{position:absolute;left:0;top:0;width:150px;height:220px;backface-visibility:hidden;border-radius:9px;box-shadow:0 8px 16px rgba(0,0,0,.5)}
.carta3d .f svg,#big svg,#kCarta svg,#pCarta svg,.mini svg{width:100%;height:100%;display:block}
.carta3d .cara{transform:rotateY(180deg)}
.tag{position:absolute;width:210px;text-align:center;font-family:M;font-weight:900;font-size:17px;letter-spacing:2px;color:#fff;background:rgba(10,8,20,.82);border:2px solid #FF8A3D;border-radius:10px;padding:6px 0}
.pn{font-family:PF;font-style:italic;font-weight:700;font-size:38px;line-height:1.25;margin-bottom:14px}
.mini{position:absolute;width:150px;height:220px}
'''

CAT_LOGO = r'''
<!-- C2 · Catrina que se deshace en brasas -->
<div class="sc" id="sCat">
  <canvas id="catC" width="1280" height="720" class="full"></canvas>
  <img class="full" id="catHumo" src="img/humo.png" style="opacity:0;mix-blend-mode:screen">
  <div class="full" style="background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 42%,rgba(0,0,0,.72) 100%)"></div>
</div>

<!-- C3 · logo Centinela que se enciende con chispas, y título -->
<div class="sc" id="sLogo">
  <div class="full" style="background:radial-gradient(ellipse at 50% 42%,#1B2130,#06070B 75%)"></div>
  <img class="full" id="humo1" src="img/humo.png" style="opacity:.34;mix-blend-mode:screen">
  <img class="full" id="humo2" src="img/humo.png" style="opacity:.2;mix-blend-mode:screen">
  <div class="full" id="lgGrupo" style="transform-origin:640px 350px">
    <svg class="ab" id="lgSol" width="1280" height="720" style="left:0;top:0;overflow:visible"><g id="lgSolG" transform="translate(640,290) scale(.7)"></g></svg>
    <div class="ab" id="lgMarca" style="left:420px;top:420px;width:440px;height:66px;display:flex;align-items:center;justify-content:center;font-family:M;font-weight:800;font-size:50px;letter-spacing:6px;padding-left:6px;color:#fff;text-shadow:0 0 16px rgba(255,255,255,.55),0 4px 0 rgba(0,0,0,.35)">CENTINELA</div>
  </div>
  <canvas id="logoC" width="1280" height="720" class="full"></canvas>
  <div class="ab" id="tit" style="left:0;width:1280px;top:340px;text-align:center">
    <div class="A glo" id="titA" style="font-size:104px;letter-spacing:3px">LA 57 DE LAS ÁNIMAS</div>
    <div id="titB" style="margin-top:12px;font-family:M;font-weight:900;font-size:22px;letter-spacing:10px;color:#FFB300">MISIÓN LOMAWEEN · ÁREA DE BLINDAJE CENTINELA</div>
  </div>
</div>
<img id="catImg" src="img/catrina_real.jpg" style="display:none" onerror="this.onerror=null;this.src='img/catrina.png'">
'''

SARAPE = ('repeating-linear-gradient(90deg,#B0124F 0 46px,#1C1620 46px 52px,#F3E7CC 52px 56px,#FF6A00 56px 100px,#FFC21A 100px 112px,'
          '#1C1620 112px 116px,#169C8E 116px 160px,#F3E7CC 160px 164px,#6A2BD9 164px 208px,#1C1620 208px 214px,#E6007E 214px 256px,#FFC21A 256px 262px)')
LOT = r'''
<!-- E · reclutamiento: la Base reparte las misiones en una mesa de lotería -->
<div class="sc" id="sLot" style="perspective:1300px;perspective-origin:50% 25%">
  <div class="full" style="background:#0C0705"></div>
  <div id="mesa" style="position:absolute;left:-160px;top:-90px;width:1600px;height:1100px;transform-style:preserve-3d;transform-origin:50% 62%">
    <div style="position:absolute;left:0;top:0;width:1600px;height:1100px;background:SARAPE"></div>
    <div style="position:absolute;left:0;top:0;width:1600px;height:1100px;background:url(grano.png);background-size:320px 180px;mix-blend-mode:multiply;opacity:.5"></div>
    <div style="position:absolute;left:0;top:0;width:1600px;height:1100px;background:radial-gradient(ellipse at 50% 55%,rgba(255,225,180,.16),rgba(0,0,0,.05) 38%,rgba(0,0,0,.78) 80%)"></div>
    <div id="cartas" style="position:absolute;left:0;top:0;width:1600px;height:1100px;transform-style:preserve-3d"></div>
  </div>
  <div class="full" id="lotDim" style="background:rgba(4,3,8,.72);opacity:0"></div>
  <div class="ab" id="lotT" style="left:0;width:1280px;top:46px;text-align:center"><span class="chip" style="background:#FF5A00">RECLUTAMIENTO</span><div class="A glo" style="font-size:54px;margin-top:10px">LA BASE REPARTE LAS MISIONES</div></div>
  <div class="ab" id="cantor" style="left:36px;top:30px"><span class="chip" style="background:rgba(10,8,20,.78);border:2px solid #FF8A3D">🎙️ LA BASE CANTA LA LOTERÍA</span></div>
  <div class="ab A glo" id="corre" style="left:0;width:1280px;top:290px;text-align:center;font-size:100px;color:#FFB300">¡CORRE Y SE VA…!</div>
  <div class="ab" id="big" style="left:0;top:0;width:300px;height:440px;transform-origin:50% 50%;filter:drop-shadow(0 30px 40px rgba(0,0,0,.7))"></div>
  <div class="ab" id="canto" style="left:660px;top:200px;width:560px">
    <div class="hud" style="color:#FF8A3D;font-size:15px">LA BASE CANTA:</div>
    <div class="PF sh" id="cantoQ" style="font-size:36px;line-height:1.2;margin-top:10px;font-weight:700;min-height:88px"></div>
    <div class="A glo" id="cantoN" style="font-size:66px;margin-top:14px;white-space:nowrap"></div>
    <div class="hud" id="cantoP" style="margin-top:14px;color:#fff;font-size:15px"></div>
  </div>
  <div class="ab" id="lotFin" style="left:0;width:1280px;top:648px;text-align:center"><div class="A glo" style="font-size:42px">10 TARJETAS · 10 MISIONES · UN SOLO EQUIPO</div></div>
</div>

<!-- tarjeta de Centinela: recibe su misión o la explica -->
<div class="sc card" id="sCard">
  <img id="kBg" class="foto full" style="filter:blur(22px) brightness(.32) saturate(1.2);transform:scale(1.15)">
  <div class="full" style="background:linear-gradient(90deg,rgba(40,10,70,.35),rgba(6,5,12,.2))"></div>
  <div class="marco" id="kMarco" style="left:100px;top:96px;width:360px;height:480px;border:6px solid #fff">
    <img id="kFoto" class="foto" style="left:0;top:0;width:100%;height:100%">
    <div class="ab hud" style="left:14px;top:12px;color:#fff"><span id="kRec" style="color:#FF3B30">●</span> REC</div>
  </div>
  <div class="ab" id="kCarta" style="left:372px;top:392px;width:150px;height:220px;filter:drop-shadow(0 16px 20px rgba(0,0,0,.6))"></div>
  <div class="ab" style="left:575px;top:104px;width:660px">
    <span class="chip" id="kNum" style="background:#FF5A00;color:#fff"></span>
    <div class="alias glo" id="kAlias" style="margin-top:16px"></div>
    <div class="rol" id="kRol"></div>
    <div class="hud" id="kToco" style="margin-top:18px;font-size:16px;color:#FFB300"></div>
    <div class="q" id="kQ"></div>
    <div class="ph" id="kPh" style="margin-top:22px;display:inline-block"></div>
  </div>
  <div class="full" id="kFreeze" style="background:#fff"></div>
</div>
'''.replace('SARAPE', SARAPE)

RESTO = r'''
<!-- el resto del recorrido, cada pieza con su Centinela -->
<div class="sc" id="sResto">
  <div class="full" style="background:radial-gradient(ellipse at 50% 40%,#2A1546,#0A0712 72%)"></div>
  <div class="ab" style="left:0;width:1280px;top:56px;text-align:center"><span class="chip" style="background:rgba(255,90,0,.9)">RECORRIDO · PIEZAS 3 A 7</span><div class="A glo" style="font-size:50px;margin-top:10px">Y CADA PIEZA, CON SU CENTINELA</div></div>
  <div id="restoC"></div>
</div>
'''

PUENTE_EXC = r'''
<!-- el puente: los días difíciles y por qué nació el 877 -->
<div class="sc" id="sPuente">
  <img id="pnFoto" class="ab" src="../material/armado_14.jpg" style="width:900px;height:1600px;transform-origin:0 0;filter:grayscale(1) brightness(.42) contrast(1.25)">
  <div class="full" style="background:linear-gradient(90deg,rgba(0,0,0,.85),rgba(0,0,0,.35))"></div>
  <div class="ab" style="left:90px;top:160px;width:960px">
    <div class="pn sh" id="pn1">En la cabina también hemos vivido días difíciles.</div>
    <div class="pn sh" id="pn2">Días que nos enseñaron a reinventarnos, todos los días.</div>
    <div class="pn sh" id="pn3" style="color:#FFB300">Por eso nació el 877: para hacer equipo desde casa,</div>
    <div class="pn sh" id="pn4" style="color:#FFB300">porque ahí empieza la prevención.</div>
    <div class="hud" id="pnPh" style="margin-top:24px;color:#fff">▶ AQUÍ ENTRA SU VIDEO: EL DE LA LLAMADA, EN VOZ BAJA Y MIRANDO A CÁMARA</div>
  </div>
</div>

<!-- fragmento del video del 877 -->
<div class="sc" id="sExc">
  <img id="ex0" class="full"><img id="ex1" class="full">
  <div class="ab" id="exTag" style="left:30px;top:84px"><span class="chip" style="background:rgba(10,8,20,.78);border:2px solid #FF8A3D">▶ VIDEO DEL 877 · LO HICIMOS NOSOTROS, CON NUESTRA VOZ</span></div>
</div>
'''

CIERRE = r'''
<!-- cierre: cambio y fuera, con el tracto y el claxon -->
<div class="sc" id="sCierre">
  <img id="ciFoto" class="ab" src="img/troca501.jpg" style="width:1836px;height:1040px;transform-origin:0 0">
  <div class="full" style="background:linear-gradient(180deg,rgba(24,10,60,.35),rgba(10,5,24,0) 55%,rgba(0,0,0,.45))"></div>
  <div class="full" style="background:radial-gradient(ellipse 720px 420px at 300px 200px,rgba(5,4,12,.82),rgba(5,4,12,.35) 60%,rgba(5,4,12,0) 100%)"></div>
  <canvas id="ciC" class="full" width="1280" height="720"></canvas>
  <svg class="ab" id="ciLogo" width="1280" height="720" style="left:0;top:0;overflow:visible"><g id="ciLogoG" transform="translate(300,118) scale(.36)"></g></svg>
  <div class="ab" style="left:20px;width:560px;top:205px;text-align:center">
    <div class="A glo" id="ciT1" style="font-size:76px;white-space:nowrap">CAMBIO Y FUERA</div>
    <div id="ciT2" style="font-family:M;font-weight:900;font-size:18px;letter-spacing:5px;color:#FF8A3D;margin-top:10px">10-28 · EQUIPO CENTINELA</div>
    <div id="ciT3" style="font-family:M;font-weight:800;font-size:18px;letter-spacing:2px;margin-top:18px;line-height:1.45">DESDE LA CABINA,<br><span style="color:#FF8A3D">PROTEGEMOS CADA KILÓMETRO.</span></div>
    <div id="ciT4" class="hud" style="margin-top:22px;color:#A9B0C2">GRUPO LOMA · OCTUBRE 2026</div>
  </div>
</div>
'''
END = r'''
<!-- tarjeta final -->
<div class="sc" id="sEnd">
  <div class="full" style="background:radial-gradient(ellipse at 50% 45%,#1E1033,#050409 70%)"></div>
  <div class="ab" style="left:0;width:1280px;top:200px;text-align:center">
    <span class="chip" style="background:#E5392F">MUESTRA · VERSIÓN 2</span>
    <div class="A glo" style="font-size:72px;margin-top:18px">ASÍ ENTRAN EN ACCIÓN LOS CENTINELAS</div>
    <div style="font-family:M;font-weight:700;font-size:21px;color:#DCE4F5;margin-top:18px;line-height:1.5">Cada recuadro <b style="color:#FFB300">“AQUÍ ENTRA SU VIDEO”</b> se reemplaza con su grabación.<br>Cada Centinela recibe su tarjeta de lotería en cámara, la lee y la explica.</div>
    <div class="hud" style="margin-top:26px;font-size:15px;color:#FF8A3D">VERSIÓN FINAL · JUEVES 29 DE OCTUBRE, 12:00 h</div>
  </div>
</div>
'''

pieza = blk(198, 209).replace('<div class="ph ab" id="pPh"', '<div class="ab" id="pCarta" style="right:60px;top:44px;width:120px;height:176px;transform:rotate(6deg);filter:drop-shadow(0 12px 16px rgba(0,0,0,.6))"></div>\n  <div class="ph ab" id="pPh"')
mont = blk(182, 196)
END = CIERRE + END
html = (blk(1, 54) + CSS + '</style>\n<script src="logo.js"></script><script src="loteria.js"></script>\n</head><body>\n<div id="v">\n'
        + blk(60, 116) + CAT_LOGO + blk(129, 162) + LOT + mont + '\n' + pieza + RESTO + blk(231, 259) + PUENTE_EXC + blk(261, 268) + END
        + blk(281, 288) + '\n<script src="m2.js"></script>\n</body></html>\n')
open('muestra2.html', 'w').write(html)
print(len(html))
