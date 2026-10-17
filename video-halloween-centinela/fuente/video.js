// Animación cuadro por cuadro: window.render(t) dibuja el instante t (segundos).
const W = 720, H = 1280, FPS = 30;
const $ = id => document.getElementById(id);
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, x) => a + (b - a) * x;
const pr = (t, a, d) => cl((t - a) / d);
const eOut = x => 1 - Math.pow(1 - x, 3);
const eIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const eBack = x => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const eElas = x => x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * 2 * Math.PI / 3) + 1;
let semilla = 11;
const rnd = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
const LN = {}; TL.lineas.forEach(l => LN[l.escena] = l);
// momento en que la voz dice "frag" (frase exacta + proporción dentro de la frase)
function tw(esc, frag) {
  for (const f of LN[esc].frases) {
    const i = f.texto.indexOf(frag);
    if (i >= 0) return f.inicio + (f.fin - f.inicio) * (i / f.texto.length) - 0.1;
  }
  throw new Error(esc + ':' + frag);
}
const envAt = t => TL.env[cl(Math.round(t * FPS), 0, TL.env.length - 1)] || 0;
const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function svgIn(parent, html) { const g = el('g', {}, parent); g.innerHTML = html; return g; }
function setT(e, x, y, s = 1, r = 0, sy) { e.setAttribute('transform', `translate(${x},${y}) rotate(${r}) scale(${s},${sy === undefined ? s : sy})`); }
function op(e, o) { e.style.opacity = o; e.style.visibility = o <= 0.002 ? 'hidden' : 'visible'; }
function css(e, o, x, y, s = 1, r = 0) {
  e.style.opacity = o; e.style.visibility = o <= 0.002 ? 'hidden' : 'visible';
  e.style.transform = `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg)`;
}
// aparición de un elemento HTML a partir del tiempo a (y salida opcional en fin)
function rv(e, t, a, o = {}) {
  const { d = .45, dy = 36, dx = 0, s0 = 1, fin = null, fd = .3, tipo = 'out', r0 = 0 } = o;
  const k = pr(t, a, d);
  const f = tipo === 'back' ? eBack(k) : tipo === 'elas' ? eElas(k) : eOut(k);
  let a1 = cl(k * 2.2), sal = 0;
  if (fin !== null) { sal = pr(t, fin, fd); a1 *= 1 - sal; }
  css(e, a1, (1 - f) * dx, (1 - f) * dy - sal * 30, lerp(s0, 1, f), (1 - f) * r0);
}
function rvS(e, t, a, x, y, o = {}) { // lo mismo para un grupo SVG (con pop de escala)
  const { d = .5, s = 1, fin = null, fd = .3, tipo = 'back', dy = 0, r = 0 } = o;
  const k = pr(t, a, d), f = tipo === 'back' ? eBack(k) : tipo === 'elas' ? eElas(k) : eOut(k);
  let a1 = cl(k * 2.5); if (fin !== null) a1 *= 1 - pr(t, fin, fd);
  op(e, a1); setT(e, x, y + (1 - f) * dy, Math.max(0.001, s * f), r);
}

// ---------- arte reutilizable ----------
const defs = $('defs');
function circuloAnillo(ro, ri) {
  return `M${ro},0 A${ro},${ro} 0 1 0 ${-ro},0 A${ro},${ro} 0 1 0 ${ro},0 Z M${ri},0 A${ri},${ri} 0 1 1 ${-ri},0 A${ri},${ri} 0 1 1 ${ri},0 Z`;
}
function rueda(cx) {
  return `<g transform="translate(${cx},222)"><circle r="28" fill="#0D0D10"/><circle r="22" fill="#27282D"/>
    <g class="rim"><circle r="15" fill="url(#gRim)"/><path d="M0,-14V14M-14,0H14M-10,-10L10,10M-10,10L10,-10" stroke="#7F8690" stroke-width="2.6"/><circle r="5" fill="#59606A"/></g></g>`;
}
let costillas = '';
for (let x = 40; x < 400; x += 40) costillas += `<rect x="${x}" y="52" width="2" height="114" fill="#000" opacity=".05"/>`;
let marcadores = '';
for (let x = 22; x < 400; x += 62) marcadores += `<circle cx="${x}" cy="46" r="3.2" fill="#FFB300"/>`;
svgIn(defs, `<g id="logoC">${logoSVG('lgT')}</g>`);
svgIn(defs, `<g id="trailer">
  <ellipse cx="320" cy="252" rx="335" ry="11" fill="#000" opacity=".5"/>
  <rect x="0" y="40" width="402" height="152" rx="6" fill="url(#gTrailer)"/>
  <rect x="0" y="40" width="402" height="9" rx="4" fill="#fff" opacity=".6"/>${costillas}${marcadores}
  <rect x="5" y="46" width="3" height="140" fill="#B4BAC2"/>
  <rect x="0" y="166" width="402" height="10" fill="#FF5A00"/>
  <rect x="0" y="186" width="402" height="14" fill="#25272C"/>
  <g transform="translate(86,114) scale(.27)"><use href="#logoC"/></g>
  <text x="146" y="100" font-family="Anton" font-size="30" fill="#1C1C22" letter-spacing="2">EQUIPO</text>
  <text x="144" y="152" font-family="Anton" font-size="58" fill="#FF5A00" letter-spacing="1">CENTINELA</text>
  <rect x="292" y="198" width="7" height="34" fill="#3A3D44"/><rect x="286" y="230" width="19" height="5" fill="#3A3D44"/>
  <rect x="152" y="196" width="10" height="44" rx="2" fill="#141414"/>
  ${rueda(62)}${rueda(122)}
  <rect x="392" y="196" width="240" height="12" fill="#1C1D21"/>
  <rect x="474" y="-8" width="9" height="162" rx="3" fill="url(#gChrome)"/><rect x="472" y="-12" width="13" height="8" rx="2" fill="#7D838C"/>
  <path d="M410,200 L410,64 Q410,38 436,36 L478,31 L478,200 Z" fill="url(#gCab)"/>
  <path d="M478,31 Q502,8 548,14 L557,40 L478,46 Z" fill="#E04F00"/>
  <path d="M478,40 L548,38 Q560,38 562,52 L572,112 L572,200 L478,200 Z" fill="url(#gCab)"/>
  <path d="M492,54 L546,52 Q553,52 555,60 L563,108 L492,108 Z" fill="#141B28"/>
  <path d="M500,58 L528,57 L506,100 L498,100 Z" fill="#fff" opacity=".13"/>
  <path d="M486,48 L486,192 L560,192" stroke="#C04200" stroke-width="2" fill="none"/>
  <rect x="536" y="122" width="17" height="4" rx="2" fill="#2a2a2a"/>
  <rect x="566" y="60" width="6" height="36" rx="2" fill="#1E1E22"/>
  <path d="M562,112 L616,116 Q628,118 630,132 L632,192 L562,192 Z" fill="url(#gCab)"/>
  <path d="M566,114 L616,118" stroke="#FF9550" stroke-width="2" opacity=".8"/>
  <rect x="624" y="128" width="12" height="62" rx="2" fill="url(#gChrome)"/>
  <path d="M626,138H634M626,148H634M626,158H634M626,168H634M626,178H634" stroke="#6E747D" stroke-width="2"/>
  <ellipse cx="629" cy="158" rx="6" ry="7" fill="#FFF7D0"/>
  <rect x="596" y="186" width="46" height="18" rx="4" fill="url(#gChrome)"/>
  <rect x="508" y="170" width="54" height="30" rx="12" fill="url(#gChrome)"/>
  <path d="M520,172V198M548,172V198" stroke="#80868F" stroke-width="2"/>
  <path d="M560,226 A38,38 0 0 1 632,226" stroke="#121214" stroke-width="9" fill="none"/>
  ${rueda(420)}${rueda(476)}${rueda(596)}
</g>`);
// donas como las que se compraron: glaseada clásica y calaverita con corona de flores
svgIn(defs, `<radialGradient id="gGlaseada"><stop offset=".3" stop-color="#9C5520"/><stop offset=".42" stop-color="#C9792F"/><stop offset=".62" stop-color="#F4BE72"/><stop offset=".8" stop-color="#E9A453"/><stop offset="1" stop-color="#B9692A"/></radialGradient>
  <radialGradient id="gBlanco" cx=".45" cy=".4"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".75" stop-color="#FAF7FA"/><stop offset="1" stop-color="#E2DAE6"/></radialGradient>`);
svgIn(defs, `<g id="dona">
  <ellipse cx="10" cy="206" rx="170" ry="22" fill="#000" opacity=".2"/>
  <path fill-rule="evenodd" d="${circuloAnillo(190, 62)}" fill="url(#gGlaseada)"/>
  <circle r="64" fill="none" stroke="#7E4216" stroke-width="5" opacity=".45"/>
  <path d="M-150,-58 A160,160 0 0 1 -62,-148" stroke="#FFF3D6" stroke-width="18" stroke-linecap="round" fill="none" opacity=".5"/>
  <path d="M-118,-30 A124,124 0 0 1 -96,-78" stroke="#FFF3D6" stroke-width="7" stroke-linecap="round" fill="none" opacity=".45"/>
  <path d="M60,74 A96,96 0 0 0 92,22" stroke="#FFF3D6" stroke-width="8" stroke-linecap="round" fill="none" opacity=".3"/>
  <circle cx="-40" cy="-120" r="6" fill="#fff" opacity=".6"/><circle cx="120" cy="-60" r="4" fill="#fff" opacity=".4"/>
</g>`);
(function () {
  const ros = (x, y, c, c2) => `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><circle r="15" fill="${c2}"/>${[...Array(8)].map((_, i) => { const a = i * 45 * Math.PI / 180; return `<circle cx="${(9 * Math.cos(a)).toFixed(1)}" cy="${(9 * Math.sin(a)).toFixed(1)}" r="6.5" fill="${c}"/>`; }).join('')}<circle r="5" fill="${c2}"/></g>`;
  let corona = '';
  [-158, -128, -98, -68, -38].forEach((g, i) => {
    const a = g * Math.PI / 180, mor = i % 2 === 0;
    corona += ros(64 * Math.cos(a), 64 * Math.sin(a) + 4, mor ? '#BC93DE' : '#FF6A1A', mor ? '#9C6CC6' : '#E25200');
  });
  const puntadas = [-26, -15, -4, 7, 18, 29].map(x => `<path d="M${x},31 L${x + 1},49"/>`).join('');
  svgIn(defs, `<g id="donaCal">
    <ellipse cx="6" cy="92" rx="76" ry="10" fill="#000" opacity=".18"/>
    <circle cx="3" cy="6" r="88" fill="#CF9150"/>
    <circle r="86" fill="url(#gBlanco)"/>
    <ellipse cx="-28" cy="-2" rx="16" ry="21" fill="#141016" transform="rotate(-14 -28 -2)"/>
    <ellipse cx="28" cy="-2" rx="16" ry="21" fill="#141016" transform="rotate(14 28 -2)"/>
    <circle cx="-4" cy="20" r="3.4" fill="#141016"/><circle cx="4" cy="20" r="3.4" fill="#141016"/>
    <g stroke="#141016" stroke-width="3.6" stroke-linecap="round" fill="none"><path d="M-34,40 Q-17,33 0,40 T34,40"/>${puntadas}</g>
    <circle cx="-57" cy="18" r="8" fill="#D9BCE8"/><circle cx="57" cy="18" r="8" fill="#D9BCE8"/>
    ${corona}
  </g>`);
})();
svgIn(defs, `<g id="murcielago"><path d="M0,0 C-6,-6 -12,-8 -18,-4 C-22,-10 -30,-12 -38,-6 C-33,-5 -31,0 -31,3 C-25,-1 -21,1 -19,5 C-13,1 -6,3 0,9 C6,3 13,1 19,5 C21,1 25,-1 31,3 C31,0 33,-5 38,-6 C30,-12 22,-10 18,-4 C12,-8 6,-6 0,0 Z M-4,-1 L-5,-8 L-1,-3 L1,-3 L5,-8 L4,-1 Z" fill="#0A0610"/></g>`);
svgIn(defs, `<g id="calabaza">
  <ellipse cx="0" cy="-80" rx="112" ry="82" fill="#D85300"/>
  <ellipse cx="-52" cy="-80" rx="58" ry="80" fill="#FF7A1A"/><ellipse cx="52" cy="-80" rx="58" ry="80" fill="#FF7A1A"/>
  <ellipse cx="0" cy="-80" rx="46" ry="82" fill="#FF8C2E"/>
  <path d="M-8,-158 Q-4,-182 14,-190 L20,-183 Q6,-172 9,-158 Z" fill="#4E6B1F"/>
  <g class="cara" fill="#FFD34D"><path d="M-66,-96 L-26,-96 L-46,-130 Z"/><path d="M26,-96 L66,-96 L46,-130 Z"/><path d="M-10,-74 L10,-74 L0,-92 Z"/>
  <path d="M-72,-54 Q0,-14 72,-54 L60,-36 L44,-46 L30,-26 L14,-40 L0,-20 L-14,-40 L-30,-26 L-44,-46 L-60,-36 Z"/></g>
  <ellipse class="brillo" cx="0" cy="-70" rx="150" ry="110" fill="url(#gGlowY)" opacity=".35"/>
</g>`);
svgIn(defs, `<g id="flor"><circle r="17" fill="#F57C00"/>${[...Array(10)].map((_, i) => { const a = i * 36 * Math.PI / 180; return `<circle cx="${(12 * Math.cos(a)).toFixed(1)}" cy="${(12 * Math.sin(a)).toFixed(1)}" r="7.5" fill="#FF9800"/>`; }).join('')}${[...Array(6)].map((_, i) => { const a = (i * 60 + 20) * Math.PI / 180; return `<circle cx="${(6 * Math.cos(a)).toFixed(1)}" cy="${(6 * Math.sin(a)).toFixed(1)}" r="6" fill="#FFB300"/>`; }).join('')}<circle r="3.5" fill="#E65100"/></g>`);
svgIn(defs, `<g id="vela"><rect x="-10" y="-60" width="20" height="60" rx="3" fill="url(#gVela)"/><path d="M0,-60 V-66" stroke="#333" stroke-width="2"/>
  <g class="llama"><ellipse cx="0" cy="-84" rx="34" ry="38" fill="url(#gGlowY)" opacity=".7"/><path d="M0,-96 C8,-84 8,-74 0,-68 C-8,-74 -8,-84 0,-96 Z" fill="#FFB300"/><path d="M0,-88 C4,-80 4,-74 0,-71 C-4,-74 -4,-80 0,-88 Z" fill="#FFF3B0"/></g></g>`);
svgIn(defs, `<g id="fantasma">
  <ellipse cx="0" cy="0" rx="190" ry="190" fill="url(#gGlowP)" opacity=".8"/>
  <path d="M-90,40 C-90,-60 -50,-120 0,-120 C50,-120 90,-60 90,40 L90,110 Q75,90 60,110 Q45,130 30,110 Q15,90 0,110 Q-15,130 -30,110 Q-45,90 -60,110 Q-75,130 -90,110 Z" fill="url(#gFantasma)"/>
  <path d="M-90,10 C-120,0 -130,-30 -122,-48 C-110,-30 -100,-20 -88,-22 Z M90,10 C120,0 130,-30 122,-48 C110,-30 100,-20 88,-22 Z" fill="#EDE8FA"/>
  <ellipse cx="-32" cy="-42" rx="13" ry="19" fill="#120A1E"/><ellipse cx="32" cy="-42" rx="13" ry="19" fill="#120A1E"/>
  <ellipse cx="0" cy="12" rx="17" ry="24" fill="#120A1E"/><ellipse cx="-56" cy="-10" rx="12" ry="7" fill="#FF9AC2" opacity=".55"/><ellipse cx="56" cy="-10" rx="12" ry="7" fill="#FF9AC2" opacity=".55"/>
</g>`);
svgIn(defs, `<g id="escudo57"><rect x="-5" y="40" width="10" height="150" fill="#8B9099"/>
  <path d="M-46,-52 L-30,-60 L0,-52 L30,-60 L46,-52 L46,-8 C46,26 24,46 0,60 C-24,46 -46,26 -46,-8 Z" fill="#fff" stroke="#111" stroke-width="5"/>
  <text x="0" y="-28" text-anchor="middle" font-family="M" font-weight="900" font-size="15" fill="#111">MEX</text>
  <text x="0" y="30" text-anchor="middle" font-family="Anton" font-size="56" fill="#111">57</text></g>`);
svgIn(defs, `<g id="letrero"><rect x="-6" y="40" width="12" height="150" fill="#8B9099"/><rect x="114" y="40" width="12" height="150" fill="#8B9099"/>
  <rect x="-60" y="-70" width="240" height="120" rx="10" fill="#0B6B3A" stroke="#fff" stroke-width="4"/>
  <text x="60" y="-22" text-anchor="middle" font-family="M" font-weight="800" font-size="30" fill="#fff">SALTILLO</text>
  <text x="60" y="26" text-anchor="middle" font-family="M" font-weight="800" font-size="26" fill="#fff">S.L.P.  ·  MEX 57 ↑</text></g>`);
function yuca(x, base, h, s) {
  let p = `<path d="M${x - 4},${base} L${x - 2},${base - h} L${x + 3},${base - h} L${x + 5},${base} Z"/>`;
  const rama = (bx, by, len, ang) => {
    const ex = bx + len * Math.cos(ang), ey = by - len * Math.sin(ang);
    let r = `<path d="M${bx},${by} L${ex},${ey}" stroke-width="${5 * s}"/>`;
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2, l = (16 + rnd() * 14) * s;
      r += `<path d="M${ex},${ey} L${(ex + l * Math.cos(a)).toFixed(1)},${(ey - l * Math.sin(a) * .9).toFixed(1)}" stroke-width="${2.4 * s}"/>`;
    }
    return r;
  };
  p += rama(x, base - h, 6, Math.PI / 2);
  if (rnd() > .3) p += rama(x, base - h * .7, 26 * s, Math.PI * .25);
  if (rnd() > .4) p += rama(x, base - h * .6, 22 * s, Math.PI * .8);
  return p;
}
function cordillera(y0, amps, periodo) {
  let d = `M0,1280 L0,${y0}`;
  for (let x = 0; x <= periodo * 2; x += 8) {
    let y = y0;
    amps.forEach(([a, k, f]) => { y -= a * (.5 + .5 * Math.sin(2 * Math.PI * x / periodo * k + f)); });
    d += ` L${x},${y.toFixed(1)}`;
  }
  return d + ` L${periodo * 2},1280 Z`;
}
// carretera vista de lado con paralaje (escenas 0 y 7)
function carretera(svg, paleta) {
  const g = {};
  g.lejos = el('path', { d: cordillera(820, [[90, 2, 1], [40, 5, 2.2]], 720), fill: paleta.lejos }, svg);
  g.cerca = el('path', { d: cordillera(880, [[60, 3, .3], [24, 7, 1.7]], 720), fill: paleta.cerca }, svg);
  g.yucas = el('g', { fill: paleta.yuca, stroke: paleta.yuca, 'stroke-linecap': 'round' }, svg);
  let y = '';
  [[60, 120], [210, 80], [360, 140], [520, 95], [650, 125]].forEach(([x, h]) => { y += yuca(x, 902, h, h / 120); y += yuca(x + 720, 902, h, h / 120); });
  g.yucas.innerHTML = y;
  g.escudo = svgIn(svg, '<use href="#escudo57"/>');
  g.letrero = svgIn(svg, '<use href="#letrero"/>');
  el('rect', { x: 0, y: 898, width: 720, height: 200, fill: paleta.asfalto }, svg);
  el('rect', { x: 0, y: 900, width: 720, height: 5, fill: '#fff', opacity: .75 }, svg);
  el('rect', { x: 0, y: 1084, width: 720, height: 6, fill: '#FFC400', opacity: .85 }, svg);
  g.postes = el('g', {}, svg);
  let p = '';
  for (let x = 0; x < 1440; x += 240) p += `<rect x="${x}" y="866" width="10" height="36" fill="#EDEDED"/><rect x="${x}" y="866" width="10" height="8" fill="#111"/>`;
  g.postes.innerHTML = p;
  g.rayas = el('g', { fill: '#fff', opacity: .85 }, svg);
  let r = '';
  for (let x = -120; x < 960; x += 120) r += `<rect x="${x}" y="1042" width="64" height="7" rx="2"/>`;
  g.rayas.innerHTML = r;
  el('rect', { x: 0, y: 1090, width: 720, height: 190, fill: paleta.tierra }, svg);
  g.matas = el('g', { fill: paleta.yuca }, svg);
  let m = '';
  for (let x = 20; x < 1440; x += 150) m += `<ellipse cx="${x}" cy="${1150 + (x % 300) / 6}" rx="${30 + (x % 70)}" ry="16"/>`;
  g.matas.innerHTML = m;
  g.haz = el('polygon', { points: '666,928 980,850 980,1030', fill: 'url(#gBeam)' }, svg);
  g.troca = svgIn(svg, '<use href="#trailer"/>');
  g.faro = el('circle', { cx: 667, cy: 928, r: 40, fill: 'url(#gGlowW)' }, svg);
  return g;
}
function moverCarretera(g, t, vel = 1) {
  setT(g.lejos, -((t * 14 * vel) % 720), 0);
  setT(g.cerca, -((t * 36 * vel) % 720), 0);
  setT(g.yucas, -((t * 170 * vel) % 720), 0);
  setT(g.matas, -((t * 520 * vel) % 750), 0);
  setT(g.postes, -((t * 430 * vel) % 240), 0);
  setT(g.rayas, -((t * 650 * vel) % 120), 0);
  const bote = Math.sin(t * 9) * 1.2 + Math.sin(t * 23) * .5;
  setT(g.troca, 38, 770 + bote);
  setT(g.faro, 0, bote); g.haz.setAttribute('transform', `translate(0,${bote})`);
  op(g.faro, .75 + .25 * Math.sin(t * 40) * .2);
}
function estrellas(svg, n, ymax) {
  const g = el('g', {}, svg), lista = [];
  for (let i = 0; i < n; i++) lista.push([el('circle', { cx: rnd() * 720, cy: rnd() * ymax, r: .6 + rnd() * 1.8, fill: '#fff' }, g), rnd() * 6, 1 + rnd() * 3]);
  return { g, mover: t => lista.forEach(([c, f, v]) => op(c, .35 + .65 * Math.abs(Math.sin(t * v + f)))) };
}
function murcielagos(svg, n, yb) {
  const lista = [];
  for (let i = 0; i < n; i++) lista.push({ e: svgIn(svg, '<use href="#murcielago"/>'), x0: -80 - rnd() * 400, y: yb + rnd() * 380, v: 120 + rnd() * 140, s: .7 + rnd() * .9, f: rnd() * 6, dir: i % 2 ? 1 : -1 });
  return t => lista.forEach(b => {
    const x = b.dir > 0 ? b.x0 + t * b.v : 720 - b.x0 - t * b.v;
    const aleteo = .35 + .65 * Math.abs(Math.sin(t * 14 + b.f));
    setT(b.e, ((x % 1300) + 1300) % 1300 - 160, b.y + Math.sin(t * 2 + b.f) * 26, b.s * b.dir, 0, b.s * aleteo);
  });
}
function iconoTrofeo(svg) {
  svg.innerHTML = `<circle r="31" fill="#FFC400"/><path d="M-14,-17 H14 V-4 C14,8 7,13 0,13 C-7,13 -14,8 -14,-4 Z" fill="#7A4A00"/>
  <path d="M-14,-12 C-24,-12 -24,2 -12,3 M14,-12 C24,-12 24,2 12,3" stroke="#7A4A00" stroke-width="4" fill="none"/><rect x="-3" y="12" width="6" height="7" fill="#7A4A00"/><rect x="-11" y="18" width="22" height="5" rx="2" fill="#7A4A00"/>`;
}
function iconoEscudo(svg) {
  svg.innerHTML = `<circle r="31" fill="#2ED573"/><path d="M0,-20 L17,-13 V0 C17,11 9,18 0,22 C-9,18 -17,11 -17,0 V-13 Z" fill="#0B3D22"/><path d="M-8,0 L-2,6 L9,-6" stroke="#2ED573" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// ---------- ESCENA 0: radio en la 57 de noche ----------
const g0 = $('g0');
el('rect', { width: 720, height: 1280, fill: 'url(#gNoche)' }, g0);
const est0 = estrellas(g0, 110, 820);
el('circle', { cx: 560, cy: 470, r: 260, fill: 'url(#gGlowW)', opacity: .35 }, g0);
const luna0 = svgIn(g0, `<circle r="92" fill="url(#gLuna)"/><circle cx="-30" cy="-18" r="16" fill="#E9D3A0" opacity=".55"/><circle cx="26" cy="22" r="22" fill="#E9D3A0" opacity=".5"/><circle cx="34" cy="-36" r="9" fill="#E9D3A0" opacity=".5"/><circle cx="-18" cy="40" r="10" fill="#E9D3A0" opacity=".45"/>`);
setT(luna0, 560, 470);
const murc0 = murcielagos(g0, 5, 330);
const ca0 = carretera(g0, { lejos: '#2B1650', cerca: '#170C2C', yuca: '#0A0614', asfalto: '#18171E', tierra: '#0D0A12' });
const eq = $('eq'), barras = [];
for (let i = 0; i < 26; i++) { const b = document.createElement('div'); b.style.cssText = 'width:8px;border-radius:4px;background:#FF5A00'; eq.appendChild(b); barras.push(b); }

function R0(t) {
  est0.mover(t); murc0(t); moverCarretera(ca0, t);
  setT(ca0.escudo, 820 - 170 * t, 760, 1); setT(ca0.letrero, 1000 - 170 * t, 740, 1);
  const enc = pr(t, .15, .5);
  css($('radio'), enc, 0, (1 - eOut(enc)) * -40, lerp(.92, 1, eOut(enc)));
  const e = envAt(t), habla = t > 1.5 && t < LN.radio.fin;
  barras.forEach((b, i) => { const v = habla ? e * (.35 + .65 * Math.abs(Math.sin(i * 1.7 + t * 18))) : .05 + .05 * Math.abs(Math.sin(i + t * 3)); b.style.height = (6 + v * 50).toFixed(1) + 'px'; b.style.opacity = habla ? 1 : .5; });
  $('led').setAttribute('fill', habla && e > .08 ? '#FF2D2D' : '#4A1010');
  $('txt').style.opacity = habla ? (e > .08 ? 1 : .35) : .25;
  const tLl = tw('radio', 'llamando'), tDiez = tw('radio', 'diez'), tCop = tw('radio', '¿Me copian');
  const k = pr(t, 1.5, .35), sacudida = t < 2.1 && t > 1.5 ? Math.sin(t * 90) * 8 * (1 - pr(t, 1.5, .6)) : 0;
  const sal = pr(t, tLl - .05, .3);
  css($('h0a'), cl(k * 2) * (1 - sal), sacudida, -sal * 40, lerp(1.6, 1, eOut(k)));
  rv($('h0b'), t, tLl, { dy: 30 });
  rv($('h0c'), t, tDiez, { d: .8, tipo: 'elas', s0: .3, dy: 0 });
  rv($('h0d'), t, tCop, { d: .5, tipo: 'back', s0: .4, dy: 0, r0: -12 });
  if (t > tCop) $('h0d').style.transform += ' rotate(-4deg)';
}

// ---------- ESCENA 1: la dona ----------
const g1 = $('g1');
el('rect', { width: 720, height: 1280, fill: 'url(#gFondoMorado)' }, g1);
const est1 = estrellas(g1, 50, 700);
el('ellipse', { cx: 360, cy: 1300, rx: 520, ry: 380, fill: 'url(#gGlowO)', opacity: .65 }, g1);
const tela1 = svgIn(g1, `<g stroke="#fff" stroke-width="1.6" opacity=".22" fill="none">${[0, 15, 30, 45, 60, 75, 90].map(a => `<path d="M720,0 L${720 - 300 * Math.cos(a * Math.PI / 180)},${300 * Math.sin(a * Math.PI / 180)}"/>`).join('')}${[60, 110, 160, 210, 260].map(r => `<path d="${[0, 15, 30, 45, 60, 75, 90].map((a, i) => `${i ? 'Q' + (720 - (r - 14) * Math.cos((a - 7.5) * Math.PI / 180)).toFixed(0) + ',' + ((r - 14) * Math.sin((a - 7.5) * Math.PI / 180)).toFixed(0) + ' ' : 'M'}${(720 - r * Math.cos(a * Math.PI / 180)).toFixed(0)},${(r * Math.sin(a * Math.PI / 180)).toFixed(0)}`).join(' ')}"/>`).join('')}</g>
  <path d="M640,0 V170" stroke="#fff" stroke-width="1.5" opacity=".4"/><g transform="translate(640,186)"><ellipse rx="14" ry="17" fill="#0A0610"/><circle cy="-15" r="9" fill="#0A0610"/><path d="M-12,-6 L-30,-16 M-12,2 L-32,4 M-12,8 L-28,22 M12,-6 L30,-16 M12,2 L32,4 M12,8 L28,22" stroke="#0A0610" stroke-width="3"/><circle cx="-4" cy="-17" r="2.4" fill="#FF5A00"/><circle cx="4" cy="-17" r="2.4" fill="#FF5A00"/></g>`);
const murc1 = murcielagos(g1, 6, 380);
const niebla1 = svgIn(g1, `<ellipse cx="200" cy="1120" rx="420" ry="90" fill="#fff" opacity=".05"/><ellipse cx="600" cy="1080" rx="380" ry="80" fill="#fff" opacity=".05"/>`);
const brillo1 = el('circle', { cx: 0, cy: 0, r: 420, fill: 'url(#gGlowO)', opacity: .5 }, g1);
const caja1 = el('g', {}, g1);
caja1.innerHTML = `<rect x="-268" y="-358" width="536" height="716" rx="16" fill="#000" opacity=".35" transform="translate(10,16)"/>
  <rect x="-268" y="-358" width="536" height="716" rx="16" fill="#5E1F86"/><rect x="-252" y="-342" width="504" height="684" rx="9" fill="#F7F1F6"/>
  <rect x="-252" y="-342" width="504" height="28" rx="9" fill="#E3D6E6"/>`;
const donas1 = [];
for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
  const cal = c === 0 || (c === 1 && r % 2 === 0);
  const d = svgIn(caja1, cal ? '<use href="#donaCal"/>' : '<g transform="scale(.465)"><use href="#dona"/></g>');
  donas1.push({ e: d, x: -164 + c * 164, y: -252 + r * 168, k: r * 3 + c });
}
const chispas1 = [];
for (let i = 0; i < 9; i++) chispas1.push(svgIn(g1, '<path d="M0,-22 L5,-5 L22,0 L5,5 L0,22 L-5,5 L-22,0 L-5,-5 Z" fill="#FFE58A"/>'));
const cal1 = [[84, 1296, .7], [636, 1296, .7]].map(([x, y, s]) => { const c = svgIn(g1, '<use href="#calabaza"/>'); setT(c, x, y, s); return c; });
function R1(t) {
  est1.mover(t); murc1(t); setT(niebla1, Math.sin(t * .6) * 40, 0);
  const t0 = LIM[1], sube = pr(t, t0 + .05, .8);
  const y = lerp(1700, 650, eBack(sube)) + (sube >= 1 ? Math.sin((t - t0) * 2) * 6 : 0);
  setT(caja1, 360, y, .88, lerp(14, -5, eOut(sube)) + 1.2 * Math.sin(t * 1.2));
  setT(brillo1, 360, y); op(brillo1, .2 + .3 * pr(t, t0 + .7, .5));
  donas1.forEach(d => {
    const k = pr(t, t0 + .55 + d.k * .07, .4);
    op(d.e, k > 0 ? 1 : 0);
    const bob = k >= 1 ? Math.sin(t * 3 + d.k) * 1.5 : 0;
    setT(d.e, d.x, d.y + bob, Math.max(.001, .92 * eBack(k)), (1 - k) * 40 + (k >= 1 ? Math.sin(t * 2.5 + d.k) * 3 : 0));
  });
  chispas1.forEach((c, i) => {
    const a = i / 9 * Math.PI * 2 + .3, k = pr(t, t0 + 1.4 + i * .06, .8);
    const s = Math.sin(k * Math.PI) * (.6 + (i % 3) * .25);
    op(c, k > 0 && k < 1 ? 1 : 0); setT(c, 360 + Math.cos(a) * (270 + 40 * k), 650 + Math.sin(a) * (350 + 40 * k), Math.max(.001, s), k * 90);
  });
  // brillo parpadeante de las calabazas
  document.querySelectorAll('#calabaza .brillo').forEach(e => e.setAttribute('opacity', (.25 + .18 * Math.sin(t * 13) * Math.sin(t * 7.3)).toFixed(3)));
  const tDul = tw('dona', 'algo dulce'), tUna = tw('dona', 'una dona'), tDis = tw('dona', '¡Disfrútenla');
  rv($('h1a'), t, t0 + .1, { fin: tDul - .1, d: .5 });
  rv($('h1b'), t, tDul, { tipo: 'back', s0: .6, dy: 0 });
  rv($('h1c'), t, tUna, { fin: tDis - .1 });
  rv($('h1d'), t, tDis, { tipo: 'back', s0: .5, dy: 0, r0: 6 });
}

// ---------- ESCENA 2: la dona es un cero ----------
const g2 = $('g2');
el('rect', { width: 720, height: 1280, fill: '#0B0614' }, g2);
const rayos2 = el('g', {}, g2);
for (let i = 0; i < 24; i++) {
  const a0 = i * 15 * Math.PI / 180, a1 = (i * 15 + 7.5) * Math.PI / 180;
  el('path', { d: `M0,0 L${1400 * Math.cos(a0)},${1400 * Math.sin(a0)} L${1400 * Math.cos(a1)},${1400 * Math.sin(a1)} Z`, fill: i % 2 ? '#1D0B30' : '#2A0E3A' }, rayos2);
}
const brillo2 = el('circle', { cx: 360, cy: 600, r: 420, fill: 'url(#gGlowO)', opacity: .55 }, g2);
const aro2 = el('ellipse', { cx: 0, cy: 0, rx: 232, ry: 232, fill: 'none', stroke: '#FF5A00', 'stroke-width': 9, 'stroke-dasharray': '30 18', 'stroke-linecap': 'round' }, g2);
const dona2 = svgIn(g2, '<use href="#dona"/>');
const conf2 = [];
const colC = ['#FF5A00', '#7B2FF7', '#FFD400', '#2ED573', '#FFFFFF'];
for (let i = 0; i < 70; i++) conf2.push({ e: el('rect', { x: -7, y: -3, width: 14, height: 6, rx: 3, fill: colC[i % 5] }, g2), a: rnd() * Math.PI * 2, v: 380 + rnd() * 520, r: rnd() * 720 });
function R2(t) {
  const t0 = LIM[2];
  setT(rayos2, 360, 600, 1, t * 12);
  const tFor = tw('cero', 'forma de cero'), tNum = tw('cero', 'nuestro número'), tCero = tw('cero', '¡cero siniestros');
  const kc = pr(t, tCero, .6);
  const pulso = 1 + .08 * Math.sin(kc * Math.PI) ;
  const sx = lerp(1, .84, eOut(kc)) * pulso, sy = lerp(1, 1.1, eOut(kc)) * pulso;
  const yD = lerp(640, 590, eIO(pr(t, tNum - .2, .6)));
  setT(dona2, 360, yD + Math.sin(t * 2.2) * 6, sx, Math.sin(t * 1.3) * 2, sy);
  op(brillo2, .45 + .35 * kc);
  const ka = pr(t, tFor, .9);
  op(aro2, cl(ka * 3) * (1 - pr(t, tCero, .3)));
  aro2.setAttribute('stroke-dashoffset', (-t * 60).toFixed(1));
  setT(aro2, 360, yD, lerp(.6, 1, eBack(ka)));
  conf2.forEach(c => {
    const k = t - tCero;
    if (k < 0 || k > 2.6) { op(c.e, 0); return; }
    const d = c.v * (1 - Math.exp(-k * 2.2)) / 1.2;
    op(c.e, 1 - pr(k, 1.8, .8));
    setT(c.e, 360 + Math.cos(c.a) * d, yD + Math.sin(c.a) * d + 160 * k * k, 1, c.r + k * 400);
  });
  rv($('h2a'), t, t0 + .15, { fin: tNum - .4 });
  rv($('h2b'), t, tFor, { tipo: 'back', s0: .5, dy: 0, fin: tNum - .4 });
  rv($('h2c'), t, tNum, { d: .5, dy: -30 });
  rv($('h2d'), t, tCero, { tipo: 'elas', d: .9, s0: .2, dy: 0 });
  rv($('h2e'), t, tCero + .5, { tipo: 'back', s0: .5, dy: 0 });
}

// ---------- ESCENA 3: altar de muertos ----------
const g3 = $('g3');
el('rect', { width: 720, height: 1280, fill: 'url(#gFondoMorado)' }, g3);
el('ellipse', { cx: 360, cy: 860, rx: 460, ry: 420, fill: 'url(#gGlowO)', opacity: .45 }, g3);
// máscara del papel picado (coordenadas locales de cada bandera)
$('mPicadoG').innerHTML = `<path d="M0,0 H100 V108 ${[...Array(12)].map((_, i) => `L${(100 - (i + .5) * 100 / 12).toFixed(1)},${i % 2 ? 108 : 120}`).join(' ')} L0,108 Z" fill="#fff"/>
  <g fill="#000">${[...Array(6)].map((_, i) => { const a = i * 60 * Math.PI / 180; return `<circle cx="${(50 + 15 * Math.cos(a)).toFixed(1)}" cy="${(60 + 15 * Math.sin(a)).toFixed(1)}" r="8"/>`; }).join('')}<circle cx="50" cy="60" r="6"/>
  ${[18, 34, 50, 66, 82].map(x => `<circle cx="${x}" cy="16" r="3"/>`).join('')}${[[20, 36], [80, 36], [20, 88], [80, 88]].map(([x, y]) => `<path d="M${x},${y - 9} L${x + 7},${y} L${x},${y + 9} L${x - 7},${y} Z"/>`).join('')}<path d="M10,100 H90" stroke="#000" stroke-width="3" stroke-dasharray="6 5"/></g>`;
const banderas = [];
const colP = ['#E6007E', '#FF6A00', '#7B2FF7', '#FFC400', '#00B37E', '#00A3E0'];
[[34, 0], [168, 3]].forEach(([yy, off], fila) => {
  el('path', { d: `M-10,${yy} Q360,${yy + 26} 730,${yy}`, stroke: '#ddd', 'stroke-width': 2, fill: 'none', opacity: .6 }, g3);
  for (let i = 0; i < 6; i++) {
    const x = 26 + i * 113 + (fila ? 0 : 0), yb = yy + 26 * (1 - Math.pow((x + 50 - 360) / 370, 2)) * .9;
    const gg = el('g', {}, g3);
    el('path', { d: 'M0,0 H100 V120 H0 Z', fill: colP[(i + off) % 6], mask: 'url(#mPicado)' }, gg);
    banderas.push({ e: gg, x, y: yb, f: i * .8 + fila * 2 });
  }
});
const arco3 = el('g', {}, g3), flores3 = [];
for (let i = 0; i <= 26; i++) {
  const a = Math.PI + i / 26 * Math.PI, x = 360 + 300 * Math.cos(a), y = 1060 + 460 * Math.sin(a);
  const f = svgIn(arco3, '<use href="#flor"/>'); flores3.push({ e: f, x, y, s: 1 + (i % 3) * .2 });
}
const altar3 = svgIn(g3, `
  <rect x="60" y="1060" width="600" height="160" fill="#FF6A00"/><rect x="60" y="1060" width="600" height="18" fill="#FFB27A"/>
  <rect x="140" y="940" width="440" height="130" fill="#6A1B9A"/><rect x="140" y="940" width="440" height="16" fill="#A45BD6"/>
  <rect x="215" y="818" width="290" height="130" fill="#C2185B"/><rect x="215" y="818" width="290" height="14" fill="#F06292"/>
  ${[[60, 1078, 600], [140, 956, 440], [215, 832, 290]].map(([x, y, w]) => [...Array(Math.floor(w / 20))].map((_, i) => `<circle cx="${x + 10 + i * 20}" cy="${y}" r="9" fill="#fff" opacity=".92"/>`).join('')).join('')}
  <rect x="0" y="1220" width="720" height="60" fill="#12061C"/>
  <g transform="translate(360,1002)"><path d="M-62,0 C-62,-50 62,-50 62,0 Z" fill="url(#gPan)"/><path d="M-40,-14 L40,-26 M-40,-26 L40,-14" stroke="#9A541C" stroke-width="9" stroke-linecap="round"/><circle cy="-38" r="9" fill="#9A541C"/></g>
  <g transform="translate(360,742)">
    <path d="M-70,-30 C-70,-110 70,-110 70,-30 C70,4 52,22 42,30 L42,62 Q0,78 -42,62 L-42,30 C-52,22 -70,4 -70,-30 Z" fill="#FFF8EE"/>
    <circle cx="-30" cy="-22" r="23" fill="#7B2FF7"/><circle cx="30" cy="-22" r="23" fill="#7B2FF7"/>
    ${[-30, 30].map(cx => [...Array(8)].map((_, i) => { const a = i * 45 * Math.PI / 180; return `<circle cx="${(cx + 26 * Math.cos(a)).toFixed(1)}" cy="${(-22 + 26 * Math.sin(a)).toFixed(1)}" r="6" fill="${i % 2 ? '#FF5A00' : '#FFD400'}"/>`; }).join('')).join('')}
    <circle cx="-26" cy="-26" r="6" fill="#fff"/><circle cx="34" cy="-26" r="6" fill="#fff"/>
    <path d="M0,4 C-12,-8 -14,10 0,20 C14,10 12,-8 0,4 Z" fill="#E6007E"/>
    <path d="M-34,44 H34 M-24,34 V58 M-12,34 V60 M0,34 V61 M12,34 V60 M24,34 V58" stroke="#3A2A3E" stroke-width="3" stroke-linecap="round"/>
    ${[...Array(6)].map((_, i) => { const a = i * 60 * Math.PI / 180; return `<circle cx="${(13 * Math.cos(a)).toFixed(1)}" cy="${(-72 + 13 * Math.sin(a)).toFixed(1)}" r="8" fill="#FF5A00"/>`; }).join('')}<circle cy="-72" r="6" fill="#FFD400"/>
    <path d="M-62,6 q8,-10 16,0 M46,6 q8,-10 16,0" stroke="#00B37E" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>`);
const velas3 = [[240, 818, .9], [480, 818, .9], [175, 940, 1], [545, 940, 1], [270, 940, .8], [450, 940, .8], [95, 1060, 1.1], [625, 1060, 1.1], [220, 1060, .9], [500, 1060, .9]].map(([x, y, s], i) => { const v = svgIn(g3, '<use href="#vela"/>'); setT(v, x, y, s); return { e: v, i }; });
const floresAltar = [[150, 1150, 1.6], [290, 1160, 1.4], [430, 1160, 1.4], [570, 1150, 1.6], [210, 1030, 1.2], [510, 1030, 1.2], [360, 1140, 1.7], [255, 905, 1], [465, 905, 1]].map(([x, y, s]) => { const f = svgIn(g3, '<use href="#flor"/>'); setT(f, x, y, s); return f; });
const petalos3 = [];
for (let i = 0; i < 46; i++) petalos3.push({ e: el('ellipse', { rx: 6, ry: 3.5, fill: i % 3 ? '#FF9800' : '#FFB300' }, g3), x: rnd() * 720, v: 70 + rnd() * 90, f: rnd() * 10, y0: rnd() * 1280 });
iconoTrofeo($('icoTrofeo')); iconoEscudo($('icoEscudo'));
function R3(t) {
  const t0 = LIM[3];
  banderas.forEach(b => setT(b.e, b.x, b.y, 1, 4 * Math.sin(t * 2.1 + b.f)));
  flores3.forEach((f, i) => { const k = pr(t, t0 + .1 + i * .035, .45); op(f.e, k > 0 ? 1 : 0); setT(f.e, f.x, f.y, Math.max(.001, eBack(k) * f.s)); });
  velas3.forEach(v => { const llama = v.e.querySelector ? null : null; });
  document.querySelectorAll('#vela .llama').forEach(e => e.setAttribute('transform', `translate(0,-66) scale(${(1 + .08 * Math.sin(t * 17) + .05 * Math.sin(t * 31)).toFixed(3)},${(1 + .12 * Math.sin(t * 13)).toFixed(3)}) translate(0,66)`));
  petalos3.forEach(p => { const y = ((p.y0 + t * p.v) % 1380) - 60; setT(p.e, p.x + 30 * Math.sin(t * 1.5 + p.f), y, 1, t * 120 + p.f * 40); });
  const tGan = tw('altar', 'ganar el concurso'), tCer = tw('altar', '¡y cerrar');
  rv($('h3a'), t, t0 + .2, { tipo: 'back', s0: .6, dy: 0, fin: tGan - .1 });
  rv($('c3a'), t, tGan, { dx: -700, dy: 0, d: .5 });
  rv($('c3b'), t, tCer, { dx: 700, dy: 0, d: .5 });
}

// ---------- ESCENA 4: cabina de monitoreo ----------
const g4 = $('g4');
el('rect', { width: 720, height: 1280, fill: '#06080E' }, g4);
el('ellipse', { cx: 360, cy: 380, rx: 520, ry: 380, fill: 'url(#gGlowO)', opacity: .18 }, g4);
svgIn(g4, `<text x="40" y="96" font-family="M" font-weight="800" font-size="19" letter-spacing="3" fill="#FF8A3D">COMMAND CENTER · CABINA CENTINELA</text>
  <circle cx="610" cy="88" r="8" fill="#FF2D2D" class="vivo"/><text x="626" y="96" font-family="M" font-weight="900" font-size="22" fill="#fff">VIVO</text>
  <rect x="34" y="122" width="652" height="510" rx="20" fill="#14171E" stroke="#262A33" stroke-width="2"/>
  <rect x="50" y="138" width="620" height="478" rx="10" fill="#0A1322"/>`);
const mapa = el('g', {}, g4);
let grid = '';
for (let x = 50; x <= 670; x += 40) grid += `<path d="M${x},138 V616" stroke="#11203A" stroke-width="1"/>`;
for (let y = 138; y <= 616; y += 40) grid += `<path d="M50,${y} H670" stroke="#11203A" stroke-width="1"/>`;
const otras = ['M60,300 C160,320 260,250 380,290 S560,330 660,280', 'M120,610 C150,500 110,400 170,300 S200,180 240,140', 'M60,520 C200,500 330,560 460,520 S600,470 668,500', 'M420,612 C430,520 520,470 560,380 S620,250 660,220', 'M60,200 C150,230 240,180 330,210'];
mapa.innerHTML = grid + otras.map(d => `<path d="${d}" stroke="#1F2D47" stroke-width="5" fill="none"/>`).join('');
const RUTA = 'M170,585 C215,520 250,490 290,440 S340,360 395,330 S470,250 520,205 S580,170 610,160';
el('path', { d: RUTA, stroke: '#FF5A00', 'stroke-width': 18, fill: 'none', opacity: .18, 'stroke-linecap': 'round' }, g4);
const ruta4 = el('path', { d: RUTA, stroke: '#FF5A00', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, g4);
const LARGO = ruta4.getTotalLength();
ruta4.setAttribute('stroke-dasharray', LARGO);
[[170, 585, 'QUERÉTARO', 'start', 14, 6], [290, 440, 'SAN LUIS POTOSÍ', 'start', 16, 4], [395, 330, 'MATEHUALA', 'end', -16, 4], [610, 160, 'SALTILLO', 'end', -10, -16]].forEach(([x, y, n, an, dx, dy]) => {
  el('circle', { cx: x, cy: y, r: 7, fill: '#fff' }, g4);
  const tx = el('text', { x: x + dx, y: y + dy + 6, 'font-family': 'M', 'font-weight': 800, 'font-size': 18, fill: '#AFC0DA', 'text-anchor': an }, g4); tx.textContent = n;
});
const esc4 = svgIn(g4, '<use href="#escudo57"/>'); setT(esc4, 120, 420, .55);
const pings = [0, 1, 2].map(() => el('circle', { r: 10, fill: 'none', stroke: '#FF5A00', 'stroke-width': 3 }, g4));
const unidad = el('g', {}, g4); el('circle', { r: 13, fill: '#FF5A00', stroke: '#fff', 'stroke-width': 3 }, unidad);
const otrasU = [.18, .52, .86].map(() => el('circle', { r: 7, fill: '#2ED573', stroke: '#06331C', 'stroke-width': 2 }, g4));
svgIn(g4, `<rect x="64" y="152" width="270" height="34" rx="17" fill="#0F1C33"/><text x="80" y="175" font-family="M" font-weight="800" font-size="17" fill="#AFC0DA">RUTA 57 · UNIDADES EN TRÁNSITO</text>
  <rect x="468" y="574" width="188" height="30" rx="15" fill="#0D3A23"/><text x="562" y="595" text-anchor="middle" font-family="M" font-weight="900" font-size="17" fill="#2ED573">ALERTAS 100% ✓</text>`);
const casa4 = svgIn(g4, `<ellipse cx="0" cy="40" rx="150" ry="120" fill="url(#gGlowY)" opacity=".35"/>
  <path d="M-80,10 L0,-62 L80,10 Z" fill="#FF5A00"/><rect x="-62" y="6" width="124" height="96" fill="#2A2238"/>
  <rect x="-44" y="26" width="34" height="30" rx="3" fill="#FFC94D"/><rect x="12" y="26" width="34" height="30" rx="3" fill="#FFC94D"/>
  <rect x="-14" y="60" width="28" height="42" rx="3" fill="#1A1424"/><rect x="40" y="-48" width="16" height="36" fill="#2A2238"/>
  <g class="corazon"><path d="M0,-78 C-14,-96 -38,-88 -36,-68 C-34,-52 -12,-42 0,-30 C12,-42 34,-52 36,-68 C38,-88 14,-96 0,-78 Z" fill="#FF2D55"/></g>`);
document.querySelectorAll('.chk').forEach(s => s.innerHTML = '<circle r="27" fill="#2ED573"/><path class="pal" d="M-12,0 L-3,9 L13,-9" stroke="#06331C" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="40" stroke-dashoffset="40"/>');
function R4(t) {
  const t0 = LIM[4];
  const kr = eIO(pr(t, t0 + .1, 1.4));
  ruta4.setAttribute('stroke-dashoffset', (LARGO * (1 - kr)).toFixed(1));
  const pos = .1 + ((t - t0) * .09) % .8, P = ruta4.getPointAtLength(LARGO * pos);
  setT(unidad, P.x, P.y, 1); op(unidad, kr > .2 ? 1 : 0);
  pings.forEach((p, i) => { const k = ((t - t0) * .9 + i / 3) % 1; p.setAttribute('cx', P.x); p.setAttribute('cy', P.y); p.setAttribute('r', 12 + k * 46); op(p, (1 - k) * (kr > .2 ? 1 : 0)); });
  otrasU.forEach((u, i) => { const Q = ruta4.getPointAtLength(LARGO * ([.18, .52, .86][i] + (t - t0) * .02 * (i % 2 ? 1 : -1))); u.setAttribute('cx', Q.x); u.setAttribute('cy', Q.y); op(u, kr > .5 ? 1 : 0); });
  document.querySelectorAll('#g4 .vivo').forEach(e => op(e, .4 + .6 * (Math.sin(t * 6) > 0)));
  const ts = [tw('cabina', 'Cada alerta'), tw('cabina', 'cada llamada'), tw('cabina', 'cada descanso')];
  ['c4a', 'c4b', 'c4c'].forEach((id, i) => {
    rv($(id), t, ts[i], { dx: -60, dy: 0, d: .4 });
    $(id).querySelector('.pal').setAttribute('stroke-dashoffset', (40 * (1 - eOut(pr(t, ts[i] + .25, .35)))).toFixed(1));
  });
  const tCasa = tw('cabina', 'es un diez');
  rvS(casa4, t, tCasa, 150, 1150, { s: 1 });
  const lat = 1 + .1 * Math.max(0, Math.sin(t * 7)) ** 6;
  casa4.querySelector('.corazon').setAttribute('transform', `translate(0,-60) scale(${lat}) translate(0,60)`);
  rv($('h4a'), t, tCasa + .15, { dx: 60, dy: 0 });
}

// ---------- ESCENA 5: sustos y seguridad vial ----------
const g5 = $('g5');
el('rect', { width: 720, height: 1280, fill: 'url(#gNoche)' }, g5);
const est5 = estrellas(g5, 80, 620);
el('circle', { cx: 580, cy: 430, r: 200, fill: 'url(#gGlowW)', opacity: .3 }, g5);
svgIn(g5, '<circle cx="580" cy="430" r="64" fill="url(#gLuna)"/>');
el('path', { d: cordillera(650, [[70, 2, .6], [26, 6, 2]], 360), fill: '#1A0D30' }, g5);
el('polygon', { points: '332,650 388,650 980,1280 -260,1280', fill: '#16151C' }, g5);
el('polygon', { points: '334,650 340,650 -120,1280 -150,1280', fill: '#fff', opacity: .75 }, g5);
el('polygon', { points: '380,650 386,650 870,1280 840,1280', fill: '#fff', opacity: .75 }, g5);
const rayas5 = [...Array(9)].map(() => el('polygon', { fill: '#FFC400' }, g5));
el('ellipse', { cx: 360, cy: 660, rx: 520, ry: 70, fill: '#C9B8FF', opacity: .08 }, g5);
const cal5 = [[80, 1290, .7], [650, 1270, .62]].map(([x, y, s]) => { const c = svgIn(g5, '<use href="#calabaza"/>'); setT(c, x, y, s); return c; });
const murc5 = murcielagos(g5, 4, 360);
const fant5 = svgIn(g5, '<use href="#fantasma"/>');
const boo5 = svgIn(g5, '<text text-anchor="middle" font-family="Creep" font-size="150" fill="#FF5A00" stroke="#000" stroke-width="6" paint-order="stroke">¡BOO!</text>');
const senal5 = [
  svgIn(g5, `<rect x="-5" y="40" width="10" height="200" fill="#8B9099"/><path d="M0,-80 L80,0 L0,80 L-80,0 Z" fill="#FFC400" stroke="#111" stroke-width="6"/><rect x="-7" y="-44" width="14" height="52" rx="5" fill="#111"/><circle cy="28" r="9" fill="#111"/>`),
  svgIn(g5, `<rect x="-5" y="40" width="10" height="200" fill="#8B9099"/><rect x="-72" y="-74" width="144" height="148" rx="12" fill="#fff" stroke="#111" stroke-width="6"/><rect x="-40" y="-52" width="80" height="104" rx="8" fill="#1F4FB8"/><rect x="-16" y="-60" width="32" height="16" rx="4" fill="#111"/><path d="M-24,-22 l7,7 l12,-14 M-24,8 l7,7 l12,-14 M-24,36 l7,7 l12,-14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M4,-18 H28 M4,12 H28 M4,40 H28" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`),
  svgIn(g5, `<rect x="-5" y="40" width="10" height="200" fill="#8B9099"/><circle r="80" fill="#fff" stroke="#111" stroke-width="3"/><circle r="70" fill="none" stroke="#E01E1E" stroke-width="16"/><text y="20" text-anchor="middle" font-family="Anton" font-size="64" fill="#111">100</text><text y="46" text-anchor="middle" font-family="M" font-weight="900" font-size="17" fill="#111">km/h</text>`)];
function R5(t) {
  est5.mover(t); murc5(t);
  rayas5.forEach((r, i) => {
    const s = ((i / 9) + t * .32) % 1, s2 = Math.min(1, s + .05);
    const y1 = 650 + 630 * s * s, y2 = 650 + 630 * s2 * s2, w1 = 1 + 22 * s * s, w2 = 1 + 22 * s2 * s2;
    r.setAttribute('points', `${360 - w1},${y1} ${360 + w1},${y1} ${360 + w2},${y2} ${360 - w2},${y2}`);
  });
  const t0 = LIM[5], tSus = tw('sustos', 'los únicos'), tSon = tw('sustos', 'son los de'), tTra = tw('sustos', 'seguridad vial') - .3;
  const tP = [tw('sustos', 'prevención'), tw('sustos', 'protocolo'), tw('sustos', 'cero excesos')];
  rv($('h5a'), t, t0 + .15, { fin: tTra - .2 });
  rv($('h5b'), t, tSon, { tipo: 'back', s0: .4, dy: 0, fin: tTra - .2, r0: -8 });
  const kf = pr(t, tSus, .7), salida = pr(t, tTra - .3, .4);
  op(fant5, cl(kf * 2) * (1 - salida));
  setT(fant5, 360 + Math.sin(t * 2.4) * 30, lerp(1050, 760, eBack(kf)) + Math.sin(t * 3.1) * 14 - salida * 200, lerp(.3, 1.15, eOut(kf)), Math.sin(t * 2.4) * 6);
  const kb = pr(t, tSon - .25, .4);
  op(boo5, cl(kb * 3) * (1 - salida));
  setT(boo5, 360 + (kb < 1 ? Math.sin(t * 80) * 6 : 0), 560, Math.max(.001, eElas(kb)), -6);
  rv($('h5c'), t, tTra, { tipo: 'back', s0: .6, dy: 0 });
  senal5.forEach((s, i) => rvS(s, t, tP[i], [130, 360, 590][i], 780, { s: 1, d: .6, dy: 120, r: Math.sin(t * 3 + i) * 2 * pr(t, tP[i] + .6, 1) }));
  ['l5a', 'l5b', 'l5c'].forEach((id, i) => rv($(id), t, tP[i] + .2, { tipo: 'back', s0: .5, dy: 0 }));
}

// ---------- ESCENA 6: el lema y el logo ----------
const g6 = $('g6');
el('rect', { width: 720, height: 1280, fill: '#0A0B0E' }, g6);
const monitores6 = svgIn(g6, `<g opacity=".32">
  <rect x="-60" y="120" width="380" height="250" rx="10" fill="#10161D" stroke="#1E3A40" stroke-width="3"/><rect x="400" y="100" width="420" height="270" rx="10" fill="#10161D" stroke="#1E3A40" stroke-width="3"/>
  <rect x="-40" y="420" width="340" height="220" rx="10" fill="#10161D" stroke="#1E3A40" stroke-width="3"/><rect x="420" y="420" width="380" height="230" rx="10" fill="#10161D" stroke="#1E3A40" stroke-width="3"/>
  <g stroke="#2E5A60" stroke-width="3" fill="none"><path d="M430,150 l60,40 l40,-20 l70,50 l50,-30 l60,60 M440,300 l80,-30 l60,40 l90,-50"/><path d="M-30,480 l70,30 l50,-20 l60,50 l80,-30 M-20,600 l90,-40 l70,20"/><path d="M450,470 h300 M450,520 h220 M450,570 h260"/><path d="M-40,160 h300 M-40,210 h240 M-40,260 h280 M-40,310 h200"/></g></g>`);
el('rect', { width: 720, height: 1280, fill: 'url(#gFondoMorado)', opacity: .25 }, g6);
el('circle', { cx: 360, cy: 470, r: 420, fill: 'url(#gGlowO)', opacity: .35 }, g6);
const ondas6 = [0, 1, 2].map(() => el('path', { fill: 'none', stroke: '#FF5A00', 'stroke-width': 7, 'stroke-linecap': 'round' }, g6));
const logo6 = el('g', {}, g6);
logo6.innerHTML = `<g mask="url(#mLogo)">${logoSVG('lg6')}</g>`;
function pie(a0, barrido) {
  const r = Math.PI / 180, R = 260, n = Math.max(2, Math.ceil(Math.abs(barrido) / 6));
  let d = 'M0,0';
  for (let i = 0; i <= n; i++) { const a = (a0 + barrido * i / n) * r; d += ` L${(R * Math.cos(a)).toFixed(1)},${(R * Math.sin(a)).toFixed(1)}`; }
  return d + ' Z';
}
function arco(cx, cy, r, a0, a1) {
  const q = Math.PI / 180;
  return `M${cx + r * Math.cos(a0 * q)},${cy + r * Math.sin(a0 * q)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a1 * q)},${cy + r * Math.sin(a1 * q)}`;
}
function R6(t) {
  const t0 = LIM[6];
  setT(monitores6, -((t - t0) * 6), 0, 1 + (t - t0) * .01);
  const kc = eIO(pr(t, t0 + .1, .9));
  $('mLogoP').setAttribute('d', pie(-122, -222 * kc));
  const kd = pr(t, t0 + .75, .5);
  const ld = logo6.querySelector('.ld');
  const sD = Math.max(.001, eBack(kd));
  logo6.querySelectorAll('#lg6 > g').forEach(g => { /* extrusión acompaña a la C */ });
  ld.setAttribute('transform', `translate(36,-40) scale(${sD}) translate(-36,40)`);
  const resp = 1 + .02 * Math.sin(t * 2.5);
  setT(logo6, 360, 470, lerp(.7, 1, eOut(pr(t, t0, 1))) * resp);
  ondas6.forEach((o, i) => {
    const k = ((t - t0 - 1.2) * .8 + i / 3) % 1;
    if (t - t0 < 1.2) { op(o, 0); return; }
    const R = 80 + k * 260;
    o.setAttribute('d', arco(0, 0, R, -95, 5));
    op(o, (1 - k) * .9);
    o.setAttribute('transform', `translate(${360 + 36},${470 - 40})`);
  });
  const tVig = tw('lema', 'siempre vigila'), tPro = tw('lema', 'siempre protege'), tDes = tw('lema', 'Desde la cabina');
  rv($('h6a'), t, t0 + .5, { fin: tDes - .2, dy: 40 });
  rv($('h6b'), t, tVig, { fin: tDes - .2, dx: -80, dy: 0 });
  rv($('h6c'), t, tPro, { fin: tDes - .2, dx: 80, dy: 0 });
  rv($('h6d'), t, tDes, { dy: 40 });
  rv($('h6e'), t, tDes + .45, { dy: 40 });
  rv($('h6f'), t, tDes + .8, { dy: 40 });
}

// ---------- ESCENA 7: final al amanecer + cierre ----------
const g7 = $('g7');
el('rect', { width: 720, height: 1280, fill: 'url(#gAmanecer)' }, g7);
const sol7 = svgIn(g7, '<circle r="300" fill="url(#gGlowY)" opacity=".55"/><circle r="120" fill="url(#gSol)"/>');
const ca7 = carretera(g7, { lejos: '#6B1E5E', cerca: '#3A0F45', yuca: '#1A0724', asfalto: '#1E1A24', tierra: '#160A1C' });
op(ca7.haz, .35);
const conf7 = [];
for (let i = 0; i < 90; i++) conf7.push({ e: el(i % 3 ? 'ellipse' : 'rect', i % 3 ? { rx: 7, ry: 4, fill: i % 2 ? '#FF9800' : '#FFB300' } : { x: -7, y: -3, width: 14, height: 6, rx: 2, fill: colC[i % 5] }, g7), x: rnd() * 720, v: 160 + rnd() * 220, f: rnd() * 10, y0: -rnd() * 1300 });
const g7b = $('g7b');
el('circle', { cx: 360, cy: 440, r: 380, fill: 'url(#gGlowO)', opacity: .35 }, g7b);
const logo7 = el('g', {}, g7b); logo7.innerHTML = logoSVG('lg7');
const ondas7 = [0, 1, 2].map(() => el('path', { fill: 'none', stroke: '#FF5A00', 'stroke-width': 6, 'stroke-linecap': 'round' }, g7b));
function R7(t) {
  const t0 = LIM[7];
  moverCarretera(ca7, t, 1.15);
  setT(ca7.escudo, 2000, 0); setT(ca7.letrero, 2000, 0);
  setT(sol7, 470, lerp(930, 800, eOut(pr(t, t0, 4))));
  const tOct = tw('final', '¡Este octubre');
  conf7.forEach(c => { const k = t - tOct + .2; if (k < 0) { op(c.e, 0); return; } op(c.e, 1); setT(c.e, c.x + 40 * Math.sin(t * 2 + c.f), c.y0 + k * c.v * 2.2, 1, t * 200 + c.f * 30); });
  rv($('h7a'), t, t0 + .3, { tipo: 'back', s0: .6, dy: 0, fin: tOct - .15 });
  const tC = LN.cambio.inicio - .35, kf = pr(t, tC, .5);
  rv($('h7b'), t, tOct, { tipo: 'elas', s0: .3, dy: 0, d: .9, fin: tC });
  rv($('h7c'), t, tOct + .5, { tipo: 'back', s0: .5, dy: 0, fin: tC });
  // tarjeta de cierre
  css($('fin'), kf, 0, 0, 1);
  setT(logo7, 360, 440, Math.max(.001, .9 * eBack(pr(t, tC + .1, .6))));
  ondas7.forEach((o, i) => { const k = ((t - tC) * .8 + i / 3) % 1; o.setAttribute('d', arco(396, 400, 80 + k * 240, -95, 5)); op(o, t > tC + .5 ? (1 - k) * .8 : 0); });
  rv($('h7d'), t, tC + .2, { tipo: 'back', s0: .6, dy: 0 });
  rv($('h7e'), t, tC + .5); rv($('h7f'), t, tC + .7); rv($('h7g'), t, tC + .9);
  op($('negro'), pr(t, TL.total - .45, .45));
}

// ---------- mosca (logo pequeño en esquina) ----------
const mosca = el('g', {}, $('mosca')); mosca.innerHTML = '<use href="#logoC"/>';
setT(mosca, 676, 50, .12);

// ---------- control de escenas ----------
const ESC = ['radio', 'dona', 'cero', 'altar', 'cabina', 'sustos', 'lema', 'final'];
const LIM = ESC.map((e, i) => i === 0 ? 0 : LN[e].inicio - .35); LIM.push(TL.total + 1);
const R = [R0, R1, R2, R3, R4, R5, R6, R7];
const SC = ESC.map((_, i) => $('s' + i));
const CON_MOSCA = [1, 2, 4, 5];
window.render = function (t) {
  let moscaO = 0;
  SC.forEach((s, i) => {
    const a = LIM[i], b = LIM[i + 1];
    const ent = i === 0 ? 1 : pr(t, a - .15, .35), sal = i === 7 ? 0 : pr(t, b - .15, .35);
    const o = Math.min(ent, 1 - sal);
    if (o <= 0) { s.style.display = 'none'; return; }
    s.style.display = 'block'; s.style.visibility = 'visible'; s.style.opacity = o;
    const z = (i === 0 ? 1 : lerp(1.08, 1, eOut(ent))) * lerp(1, .96, sal);
    s.style.transform = `scale(${z})`;
    R[i](t);
    if (CON_MOSCA.includes(i)) moscaO = Math.max(moscaO, o);
  });
  op(mosca, moscaO);
  const rot = (t * 520) % 360;
  document.querySelectorAll('#trailer .rim').forEach(e => e.setAttribute('transform', `rotate(${rot})`));
};
window.TOTAL = TL.total;
window.render(0);
