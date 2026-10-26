# Arma muestra4.html: la muestra 3 (muestra2.html) con el recorrido del plan intercalado en la bitácora (plan.js)
s = open('muestra2.html').read()
css = '''<style>
@font-face{font-family:G;src:url(../../imprimibles/fonts/gochi-hand-latin-400-normal.woff2)}
#plan{position:absolute;left:0;top:0;width:1280px;height:720px;visibility:hidden;overflow:hidden}
#plOsc{position:absolute;left:0;top:0;width:1280px;height:720px;background:radial-gradient(ellipse at 50% 50%,rgba(14,8,26,.72),rgba(3,2,8,.96))}
#plDoc{position:absolute;left:470px;top:112px;width:380px;height:492px;transform-origin:50% 50%}
.plPag,#plUnder,#plSombra{position:absolute;left:0;top:0;width:380px;height:492px;border-radius:4px}
.plPag{box-shadow:0 24px 60px rgba(0,0,0,.6);transform-origin:0 50%;backface-visibility:hidden;overflow:hidden;background:#fff}
#plUnder{box-shadow:0 24px 60px rgba(0,0,0,.6)}
.plPag .sh{position:absolute;left:0;top:0;width:100%;height:100%;background:linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,.55));opacity:0}
#plSombra{background:linear-gradient(90deg,rgba(0,0,0,.6),rgba(0,0,0,0) 65%);opacity:0}
#plBoc{background:#f6f1e6 repeating-linear-gradient(0deg,transparent 0 23px,rgba(120,160,210,.25) 23px 24px)}
#plBoc .ttl{position:absolute;left:32px;top:12px;font-family:G;font-size:25px;color:#3a3a46;white-space:nowrap}
#plBoc .sub{position:absolute;left:33px;top:40px;font-family:G;font-size:14.5px;color:#e25c0a;white-space:nowrap}
#plBoc .marg{position:absolute;left:22px;top:0;bottom:0;width:2px;background:rgba(220,90,90,.45)}
#plImgBoc,#plImgCol{position:absolute;left:38px;top:66px;width:304px;height:412px;object-fit:cover}
#plImgCol{clip-path:circle(0% at 50% 55%)}
#plBrillo{position:absolute;left:40px;top:120px;width:300px;height:300px;background:radial-gradient(circle,rgba(255,224,150,.95),rgba(255,160,40,0) 62%);mix-blend-mode:screen;opacity:0}
#plLapiz{position:absolute;left:0;top:0;width:0;height:0;transform-origin:0 0}
#plLetra{position:absolute;left:62px;top:180px;width:390px;font-family:G;color:#fff;text-shadow:0 3px 14px #000}
#plT1{font-size:48px;color:#ffb300;min-height:56px}
#plT2,#plT3,#plT4{font-size:33px;line-height:1.12;margin-top:10px}
#plChips{position:absolute;left:900px;top:168px;width:330px}
.plC{font-family:M;font-weight:900;font-size:19px;color:#fff;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.28);border-radius:30px;padding:8px 18px;margin-bottom:12px;opacity:0;letter-spacing:1px;width:max-content}
.plC b{color:#2ED573;margin-right:8px}
.plC.act{background:#ff6a00;border-color:#ff6a00}
.plC.act b{color:#fff}
#plGrano{position:absolute;left:0;top:0;width:1280px;height:720px;background:url(grano.png);background-size:640px 360px;mix-blend-mode:overlay;opacity:.12}
</style>
'''
lapiz = '''<svg width="160" height="26" style="position:absolute;left:0;top:-13px;overflow:visible">
  <polygon points="0,13 9,9.5 9,16.5" fill="#333"/><polygon points="9,9.5 26,3 26,23 9,16.5" fill="#e8c08a"/>
  <rect x="26" y="3" width="104" height="20" fill="#ffc21a"/><rect x="26" y="3" width="104" height="6" fill="#ffd95c"/><rect x="26" y="17" width="104" height="6" fill="#e0a200"/>
  <rect x="130" y="2" width="12" height="22" fill="#b9c0c9"/><rect x="142" y="2" width="16" height="22" rx="4" fill="#f28da0"/></svg>'''
chips = ''.join(f'<div class="plC" id="plC{j}"><b>✓</b>{t}</div>' for j, t in enumerate(['Las bases', 'Los objetivos', 'El plan', 'El boceto', 'El diseño', 'Las ilustraciones']))
over = f'''<div id="plan">
  <div id="plOsc"></div>
  <div id="plLetra"><div id="plT1"></div><div id="plT2"></div><div id="plT3"></div><div id="plT4"></div></div>
  <div id="plChips">{chips}</div>
  <div id="plDoc">
    <img id="plUnder" src="plan/pg-01.jpg"><div id="plSombra"></div>
    <div class="plPag" id="plTop"><img id="plTopImg" src="plan/pg-01.jpg" style="width:100%;height:100%;display:block"><div class="sh"></div></div>
    <div class="plPag" id="plBoc"><div class="marg"></div><div class="ttl">Boceto 1 · El altar es el tracto</div><div class="sub">lo blanco es el tracto: parrilla al centro y faros a los lados</div>
      <img id="plImgBoc" src="plan/boceto.jpg"><img id="plImgCol" src="plan/color.jpg"><div id="plBrillo"></div><div class="sh"></div><div id="plLapiz">{lapiz}</div></div>
  </div>
  <div id="plGrano"></div>
</div>
'''
a = '<div class="full" id="grano"'
assert s.count(a) == 1 and s.count('</head>') == 1 and s.count('<script src="m2.js"></script>') == 1
s = s.replace('</head>', css + '</head>').replace(a, over + a).replace('<script src="m2.js"></script>', '<script src="m2.js"></script>\n<script src="plan.js"></script>')
s = s.replace('MUESTRA · VERSIÓN 2', 'MUESTRA · VERSIÓN 4')
open('muestra4.html', 'w').write(s); print('ok')
