// "La entrega más importante": animación cuadro por cuadro, window.render(t) dibuja el instante t.
const W = 1920, H = 1080, FPS = 30;
const $ = id => document.getElementById(id);
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, x) => a + (b - a) * x;
const pr = (t, a, d) => cl((t - a) / d);
const eOut = x => 1 - Math.pow(1 - x, 3);
const eIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const eBack = x => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const eElas = x => x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * 2 * Math.PI / 3) + 1;
let semilla = 21;
const rnd = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
const LN = {}; TL.lineas.forEach(l => LN[l.escena] = l);
function tw(esc, frag) {
  const fs = LN[esc].frases;
  for (const f of fs) {
    const i = f.texto.indexOf(frag);
    if (i >= 0) return f.inicio + (f.fin - f.inicio) * (i / f.texto.length) - 0.1;
  }
  // en las grabaciones una frase puede quedar repartida entre dos tramos de voz: buscar en el texto completo
  let todo = ''; const marcas = [];
  fs.forEach(f => { marcas.push([todo.length, f]); todo += f.texto + ' '; });
  const i = todo.indexOf(frag);
  if (i < 0) throw new Error(esc + ':' + frag);
  const [c0, f] = marcas.filter(m => m[0] <= i).pop();
  return f.inicio + (f.fin - f.inicio) * Math.min(1, (i - c0) / f.texto.length) - 0.1;
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
function rv(e, t, a, o = {}) {
  const { d = .5, dy = 40, dx = 0, s0 = 1, fin = null, fd = .4, tipo = 'out', r0 = 0, r = 0 } = o;
  const k = pr(t, a, d);
  const f = tipo === 'back' ? eBack(k) : tipo === 'elas' ? eElas(k) : eOut(k);
  let a1 = cl(k * 2.2), sal = 0;
  if (fin !== null) { sal = pr(t, fin, fd); a1 *= 1 - sal; }
  css(e, a1, (1 - f) * dx, (1 - f) * dy - sal * 30, lerp(s0, 1, f), (1 - f) * r0 + r);
}
function rvS(e, t, a, x, y, o = {}) {
  const { d = .6, s = 1, fin = null, fd = .4, tipo = 'back', dy = 0, r = 0 } = o;
  const k = pr(t, a, d), f = tipo === 'back' ? eBack(k) : tipo === 'elas' ? eElas(k) : eOut(k);
  let a1 = cl(k * 2.5); if (fin !== null) a1 *= 1 - pr(t, fin, fd);
  op(e, a1); setT(e, x, y + (1 - f) * dy, Math.max(0.001, s * f), r);
}

// ---------- arte reutilizable ----------
const defs = $('defs');
function anillo(ro, ri) {
  return `M${ro},0 A${ro},${ro} 0 1 0 ${-ro},0 A${ro},${ro} 0 1 0 ${ro},0 Z M${ri},0 A${ri},${ri} 0 1 1 ${-ri},0 A${ri},${ri} 0 1 1 ${ri},0 Z`;
}
function rueda(cx) {
  return `<g transform="translate(${cx},222)"><circle r="28" fill="#0D0D10"/><circle r="22" fill="#27282D"/>
    <g class="rim"><circle r="15" fill="url(#gRim)"/><path d="M0,-14V14M-14,0H14M-10,-10L10,10M-10,10L10,-10" stroke="#7F8690" stroke-width="2.6"/><circle r="5" fill="#59606A"/></g></g>`;
}
let costillas = '', marcadores = '';
for (let x = 40; x < 400; x += 40) costillas += `<rect x="${x}" y="52" width="2" height="114" fill="#000" opacity=".05"/>`;
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
  <path d="M410,200 L410,64 Q410,38 436,36 L478,31 L478,200 Z" fill="url(#gCabB)"/>
  <path d="M478,31 Q502,8 548,14 L557,40 L478,46 Z" fill="#D5DAE1"/>
  <path d="M478,40 L548,38 Q560,38 562,52 L572,112 L572,200 L478,200 Z" fill="url(#gCabB)"/>
  <path d="M492,54 L546,52 Q553,52 555,60 L563,108 L492,108 Z" fill="#141B28"/>
  <path d="M500,58 L528,57 L506,100 L498,100 Z" fill="#fff" opacity=".13"/>
  <path d="M486,48 L486,192 L560,192" stroke="#AEB4BD" stroke-width="2" fill="none"/>
  <rect x="536" y="122" width="17" height="4" rx="2" fill="#2a2a2a"/><text x="521" y="168" text-anchor="middle" font-family="M" font-weight="900" font-size="26" fill="#1F3C9A">877</text><text x="516" y="36" text-anchor="middle" font-family="M" font-weight="900" font-size="15" fill="#1F3C9A" letter-spacing="1">TR<tspan fill="#FF5A00">O</tspan>B</text>
  <rect x="566" y="60" width="6" height="36" rx="2" fill="#1E1E22"/>
  <path d="M562,112 L616,116 Q628,118 630,132 L632,192 L562,192 Z" fill="url(#gCabB)"/>
  <path d="M566,114 L616,118" stroke="#FFFFFF" stroke-width="2" opacity=".8"/>
  <rect x="624" y="128" width="12" height="62" rx="2" fill="url(#gChrome)"/>
  <path d="M626,138H634M626,148H634M626,158H634M626,168H634M626,178H634" stroke="#6E747D" stroke-width="2"/>
  <ellipse cx="629" cy="158" rx="6" ry="7" fill="#FFF7D0"/>
  <rect x="596" y="186" width="46" height="18" rx="4" fill="url(#gChrome)"/>
  <rect x="508" y="170" width="54" height="30" rx="12" fill="url(#gChrome)"/>
  <path d="M520,172V198M548,172V198" stroke="#80868F" stroke-width="2"/>
  <path d="M560,226 A38,38 0 0 1 632,226" stroke="#121214" stroke-width="9" fill="none"/>
  ${rueda(420)}${rueda(476)}${rueda(596)}
</g>`);
svgIn(defs, `<g id="flor"><circle r="17" fill="#F57C00"/>${[...Array(10)].map((_, i) => { const a = i * 36 * Math.PI / 180; return `<circle cx="${(12 * Math.cos(a)).toFixed(1)}" cy="${(12 * Math.sin(a)).toFixed(1)}" r="7.5" fill="#FF9800"/>`; }).join('')}${[...Array(6)].map((_, i) => { const a = (i * 60 + 20) * Math.PI / 180; return `<circle cx="${(6 * Math.cos(a)).toFixed(1)}" cy="${(6 * Math.sin(a)).toFixed(1)}" r="6" fill="#FFB300"/>`; }).join('')}<circle r="3.5" fill="#E65100"/></g>`);
svgIn(defs, `<g id="vela"><rect x="-10" y="-60" width="20" height="60" rx="3" fill="url(#gVela)"/>
  <g class="llama"><ellipse cx="0" cy="-84" rx="40" ry="44" fill="url(#gGlowY)" opacity=".75"/><path d="M0,-96 C8,-84 8,-74 0,-68 C-8,-74 -8,-84 0,-96 Z" fill="#FFB300"/><path d="M0,-88 C4,-80 4,-74 0,-71 C-4,-74 -4,-80 0,-88 Z" fill="#FFF3B0"/></g></g>`);
// siluetas
svgIn(defs, `<g id="adulto"><circle cx="0" cy="-272" r="27"/><path d="M-36,-236 Q0,-248 36,-236 L48,-140 L36,-132 L30,-150 L28,-92 L24,0 L6,0 L2,-90 L-2,-90 L-6,0 L-24,0 L-28,-92 L-30,-150 L-36,-132 L-48,-140 Z"/></g>`);
svgIn(defs, `<g id="nino"><circle cx="0" cy="-150" r="24"/><path d="M-20,-162 Q-26,-186 0,-182 Q26,-186 20,-162 Q12,-176 0,-174 Q-12,-176 -20,-162 Z"/><path d="M-24,-124 Q0,-132 24,-124 L32,-64 L24,-60 L20,-74 L18,-46 L16,0 L4,0 L2,-44 L-2,-44 L-4,0 L-16,0 L-18,-46 L-20,-74 L-24,-60 L-32,-64 Z"/></g>`);
svgIn(defs, `<g id="abrazo"><path d="M-30,0 L-30,-60 Q-34,-104 -10,-140 L14,-176 Q30,-196 50,-186 L62,-150 L20,-110 L22,-60 L40,-60 L40,0 Z"/><circle cx="34" cy="-212" r="27"/>
  <circle cx="96" cy="-150" r="23"/><path d="M76,-124 Q96,-132 116,-124 L120,-60 L112,0 L98,0 L96,-46 L92,0 L80,0 L76,-60 Z"/>
  <path d="M30,-150 Q90,-170 122,-118" stroke="currentColor" stroke-width="20" fill="none" stroke-linecap="round"/></g>`);
function cordillera(y0, amps, periodo) {
  let d = `M0,1080 L0,${y0}`;
  for (let x = 0; x <= periodo * 2; x += 10) {
    let y = y0;
    amps.forEach(([a, k, f]) => { y -= a * (.5 + .5 * Math.sin(2 * Math.PI * x / periodo * k + f)); });
    d += ` L${x},${y.toFixed(1)}`;
  }
  return d + ` L${periodo * 2},1080 Z`;
}
function yuca(x, base, h, s) {
  let p = `<path d="M${x - 5},${base} L${x - 3},${base - h} L${x + 4},${base - h} L${x + 6},${base} Z"/>`;
  const rama = (bx, by, len, ang) => {
    const ex = bx + len * Math.cos(ang), ey = by - len * Math.sin(ang);
    let r = `<path d="M${bx},${by} L${ex},${ey}" stroke-width="${6 * s}"/>`;
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2, l = (18 + rnd() * 16) * s;
      r += `<path d="M${ex},${ey} L${(ex + l * Math.cos(a)).toFixed(1)},${(ey - l * Math.sin(a) * .9).toFixed(1)}" stroke-width="${2.8 * s}"/>`;
    }
    return r;
  };
  p += rama(x, base - h, 6, Math.PI / 2);
  if (rnd() > .3) p += rama(x, base - h * .7, 28 * s, Math.PI * .25);
  if (rnd() > .4) p += rama(x, base - h * .6, 24 * s, Math.PI * .8);
  return p;
}
function estrellas(svg, n, ymax) {
  const g = el('g', {}, svg), lista = [];
  for (let i = 0; i < n; i++) lista.push([el('circle', { cx: rnd() * 1920, cy: rnd() * ymax, r: .7 + rnd() * 2, fill: '#fff' }, g), rnd() * 6, 1 + rnd() * 3]);
  return t => lista.forEach(([c, f, v]) => op(c, .3 + .7 * Math.abs(Math.sin(t * v + f))));
}
function luna(svg, x, y, r) {
  el('circle', { cx: x, cy: y, r: r * 3, fill: 'url(#gGlowW)', opacity: .35 }, svg);
  svgIn(svg, `<g transform="translate(${x},${y}) scale(${r / 92})"><circle r="92" fill="url(#gLuna)"/><circle cx="-30" cy="-18" r="16" fill="#E9D3A0" opacity=".55"/><circle cx="26" cy="22" r="22" fill="#E9D3A0" opacity=".5"/><circle cx="34" cy="-36" r="9" fill="#E9D3A0" opacity=".5"/></g>`);
}
// mascara del papel picado (cada bandera en coordenadas locales 100x120)
$('mPicadoG').innerHTML = `<path d="M0,0 H100 V108 ${[...Array(12)].map((_, i) => `L${(100 - (i + .5) * 100 / 12).toFixed(1)},${i % 2 ? 108 : 120}`).join(' ')} L0,108 Z" fill="#fff"/>
  <g fill="#000">${[...Array(6)].map((_, i) => { const a = i * 60 * Math.PI / 180; return `<circle cx="${(50 + 15 * Math.cos(a)).toFixed(1)}" cy="${(60 + 15 * Math.sin(a)).toFixed(1)}" r="8"/>`; }).join('')}<circle cx="50" cy="60" r="6"/>
  ${[18, 34, 50, 66, 82].map(x => `<circle cx="${x}" cy="16" r="3"/>`).join('')}${[[20, 36], [80, 36], [20, 88], [80, 88]].map(([x, y]) => `<path d="M${x},${y - 9} L${x + 7},${y} L${x},${y + 9} L${x - 7},${y} Z"/>`).join('')}<path d="M10,100 H90" stroke="#000" stroke-width="3" stroke-dasharray="6 5"/></g>`;
const COLP = ['#E6007E', '#FF6A00', '#7B2FF7', '#FFC400', '#00B37E', '#00A3E0'];
function picado(svg, y, x0, x1, esc = 1, off = 0) {
  const n = Math.floor((x1 - x0) / (112 * esc)), lista = [];
  el('path', { d: `M${x0 - 20},${y} Q${(x0 + x1) / 2},${y + 30 * esc} ${x1 + 20},${y}`, stroke: '#ddd', 'stroke-width': 2, fill: 'none', opacity: .6 }, svg);
  for (let i = 0; i < n; i++) {
    const x = x0 + i * 112 * esc + 6, u = (x + 50 * esc - (x0 + x1) / 2) / ((x1 - x0) / 2);
    const g = el('g', {}, svg);
    el('path', { d: 'M0,0 H100 V120 H0 Z', fill: COLP[(i + off) % 6], mask: 'url(#mPicado)' }, g);
    lista.push({ e: g, x, y: y + 26 * esc * (1 - u * u), f: i * .8 + off });
  }
  return t => lista.forEach(b => setT(b.e, b.x, b.y, esc, 4 * Math.sin(t * 1.8 + b.f)));
}
function flores(svg, pts, s = 1) { pts.forEach(([x, y, k]) => { const f = svgIn(svg, '<use href="#flor"/>'); setT(f, x, y, s * (k || 1)); }); }
function velas(svg, pts) { return pts.map(([x, y, s]) => { const v = svgIn(svg, '<use href="#vela"/>'); setT(v, x, y, s); return v; }); }
function parpadeo(t) {
  document.querySelectorAll('#vela .llama').forEach(e => e.setAttribute('transform', `translate(0,-66) scale(${(1 + .07 * Math.sin(t * 17) + .04 * Math.sin(t * 31)).toFixed(3)},${(1 + .1 * Math.sin(t * 13)).toFixed(3)}) translate(0,66)`));
}
// ---------- tractor 877 y camioneta de asistencia (imágenes del equipo, con llantas que giran) ----------
const TROCA = { w: 1260, h: 354, r: 44, llantas: [100, 192, 755, 843, 1063].map((x, i) => [x, 296, `img/llanta5_${i}.png`]), faro: [1147, 250], ojos: [[1092, 152, 13], [1123, 152, 11]] };
const VAN = { w: 1499, h: 754, r: 128, llantas: [[336, 624, 'img/llanta6_0.png'], [1216, 624, 'img/llanta6_1.png']], faro: [178, 398] };
function vehiculo(parent, V, src) {
  const g = el('g', {}, parent);
  el('ellipse', { cx: V.w / 2, cy: V.llantas[0][1] + V.r - 4, rx: V.w * .53, ry: V.r * .32, fill: '#000', opacity: .5 }, g);
  el('image', { href: src, width: V.w, height: V.h }, g);
  const ruedas = V.llantas.map(([x, y, f]) => el('image', { href: f, x: x - V.r, y: y - V.r, width: 2 * V.r, height: 2 * V.r }, g));
  return { g, ruedas, V };
}
function girar(v, ang) { v.ruedas.forEach((r, i) => { const [x, y] = v.V.llantas[i]; r.setAttribute('transform', `rotate(${ang.toFixed(1)} ${x} ${y})`); }); }
function troca877(parent) {
  const v = vehiculo(parent, TROCA, 'img/troca877.png');
  v.parpados = svgIn(v.g, TROCA.ojos.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r + 4}" ry="${r + 6}" fill="#F7F7F8"/><path d="M${x - r - 1},${y - 2} Q${x},${y + 9} ${x + r + 1},${y - 2}" stroke="#1E2E42" stroke-width="3.6" fill="none" stroke-linecap="round"/>`).join(''));
  v.parpados.style.visibility = 'hidden';
  return v;
}
const PARP877 = [1.3, 4.6, 4.85, 8.2, 11.9, 15.1];
function parpadea(v, t, siempre) { v.parpados.style.visibility = siempre || PARP877.some(b => { const u = t % 17 - b; return u > 0 && u < .16; }) ? 'visible' : 'hidden'; }

// carretera vista de lado con paralaje
function carretera(svg, p) {
  const g = {};
  g.lejos = el('path', { d: cordillera(700, [[120, 2, 1], [50, 5, 2.2]], 1920), fill: p.lejos }, svg);
  g.cerca = el('path', { d: cordillera(780, [[70, 3, .3], [30, 7, 1.7]], 1920), fill: p.cerca }, svg);
  g.yucas = el('g', { fill: p.yuca, stroke: p.yuca, 'stroke-linecap': 'round' }, svg);
  let y = '';
  [[90, 150], [330, 100], [560, 170], [820, 120], [1060, 160], [1300, 110], [1540, 175], [1780, 120]].forEach(([x, h]) => { y += yuca(x, 802, h, h / 130) + yuca(x + 1920, 802, h, h / 130); });
  g.yucas.innerHTML = y;
  el('rect', { x: 0, y: 798, width: 1920, height: 160, fill: p.asfalto }, svg);
  el('rect', { x: 0, y: 800, width: 1920, height: 5, fill: '#fff', opacity: .75 }, svg);
  el('rect', { x: 0, y: 948, width: 1920, height: 6, fill: '#FFC400', opacity: .85 }, svg);
  g.flores = el('g', {}, svg);
  if (p.petalos) {
    let f = '';
    for (let x = 0; x < 3840; x += 70) f += `<g transform="translate(${x + (x % 140 ? 0 : 20)},${804 - (x % 3) * 2}) scale(${.7 + (x % 5) * .08})"><use href="#flor"/></g>`;
    for (let i = 0; i < 160; i++) f += `<ellipse cx="${(rnd() * 3840).toFixed(0)}" cy="${(808 + rnd() * 22).toFixed(0)}" rx="5" ry="3" fill="${i % 2 ? '#FF9800' : '#FFB300'}" transform="rotate(${(rnd() * 180).toFixed(0)} 0 0)"/>`;
    g.flores.innerHTML = f;
  }
  g.postes = el('g', {}, svg);
  let ps = '';
  for (let x = 0, k = 101; x < 3840; x += 480, k++) ps += `<rect x="${x}" y="752" width="12" height="50" fill="#EDEDED"/><rect x="${x}" y="752" width="12" height="10" fill="#111"/><rect x="${x - 30}" y="716" width="72" height="34" rx="5" fill="#0B6B3A" stroke="#fff" stroke-width="2"/><text x="${x + 6}" y="740" text-anchor="middle" font-family="M" font-weight="800" font-size="18" fill="#fff">KM ${k}</text>`;
  g.postes.innerHTML = ps;
  g.rayas = el('g', { fill: '#fff', opacity: .85 }, svg);
  let r = '';
  for (let x = -160; x < 2080; x += 160) r += `<rect x="${x}" y="895" width="86" height="8" rx="3"/>`;
  g.rayas.innerHTML = r;
  el('rect', { x: 0, y: 954, width: 1920, height: 126, fill: p.tierra }, svg);
  g.haz = el('polygon', { points: '0,0 600,-80 600,110', fill: 'url(#gBeam)' }, svg);
  g.troca = troca877(svg);
  g.faro = el('circle', { cx: 0, cy: 0, r: 50, fill: 'url(#gGlowW)' }, svg);
  return g;
}
function moverCarretera(g, t, x0, y0, s, vel = 1) {
  setT(g.lejos, -((t * 18 * vel) % 1920), 0);
  setT(g.cerca, -((t * 45 * vel) % 1920), 0);
  setT(g.yucas, -((t * 200 * vel) % 1920), 0);
  setT(g.flores, -((t * 520 * vel) % 1920), 0);
  setT(g.postes, -((t * 520 * vel) % 480), 0);
  setT(g.rayas, -((t * 760 * vel) % 160), 0);
  const bote = Math.sin(t * 9) * 1.3 + Math.sin(t * 23) * .5;
  setT(g.troca.g, x0, y0 + bote, s); girar(g.troca, t * 300 * vel); parpadea(g.troca, t);
  const fx = x0 + TROCA.faro[0] * s, fy = y0 + TROCA.faro[1] * s + bote;
  setT(g.faro, fx, fy); setT(g.haz, fx, fy);
}
function radioPanel(panel, t, activo) {
  const eq = panel.querySelector('.eq');
  if (!eq.children.length) for (let i = 0; i < 30; i++) { const b = document.createElement('div'); b.style.cssText = 'width:9px;border-radius:5px;background:#FF5A00'; eq.appendChild(b); }
  const e = envAt(t);
  [...eq.children].forEach((b, i) => { const v = activo ? e * (.35 + .65 * Math.abs(Math.sin(i * 1.7 + t * 18))) : .06 + .05 * Math.abs(Math.sin(i + t * 3)); b.style.height = (6 + v * 56).toFixed(1) + 'px'; b.style.opacity = activo ? 1 : .5; });
  panel.querySelector('.led').setAttribute('fill', activo && e > .08 ? '#FF2D2D' : '#4A1010');
  panel.querySelector('.txl').style.opacity = activo ? (e > .08 ? 1 : .35) : .25;
}
function sectorAnular2(a0, barrido) {
  const r = Math.PI / 180, R = 260, n = Math.max(2, Math.ceil(Math.abs(barrido) / 6));
  let d = 'M0,0';
  for (let i = 0; i <= n; i++) { const a = (a0 + barrido * i / n) * r; d += ` L${(R * Math.cos(a)).toFixed(1)},${(R * Math.sin(a)).toFixed(1)}`; }
  return d + ' Z';
}
function arco(cx, cy, r, a0, a1) {
  const q = Math.PI / 180;
  return `M${cx + r * Math.cos(a0 * q)},${cy + r * Math.sin(a0 * q)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a1 * q)},${cy + r * Math.sin(a1 * q)}`;
}
function casa(svg, x, y, dia) {
  const g = el('g', { transform: `translate(${x},${y})` }, svg);
  const muro = dia ? '#7A3E6E' : '#2B1F40', techo = dia ? '#4E2350' : '#1D1430', luz = '#FFC66B';
  g.innerHTML = `<ellipse cx="0" cy="480" rx="520" ry="70" fill="url(#gGlowCal)" opacity="${dia ? .5 : .8}"/>
    <rect x="-340" y="0" width="680" height="440" fill="${muro}"/><rect x="-340" y="0" width="680" height="30" fill="#000" opacity=".25"/>
    <polygon points="-390,10 0,-230 390,10" fill="${techo}"/><rect x="190" y="-190" width="60" height="120" fill="${techo}"/>
    <rect x="-240" y="80" width="240" height="220" fill="${luz}"/><rect x="-240" y="80" width="240" height="220" fill="url(#gGlowW)" opacity=".7"/>
    <g class="ninoV" fill="#2A1A2E"><circle cx="-120" cy="196" r="38"/><path d="M-120,154 Q-150,150 -158,186 Q-146,166 -120,164 Q-94,166 -82,186 Q-90,150 -120,154 Z"/><path d="M-196,300 Q-190,246 -120,238 Q-50,246 -44,300 Z"/><ellipse cx="-176" cy="292" rx="16" ry="10"/><ellipse cx="-64" cy="292" rx="16" ry="10"/></g>
    <path d="M-240,190 H0 M-120,80 V300" stroke="#3A2A50" stroke-width="10"/><rect x="-250" y="296" width="260" height="16" rx="4" fill="#3A2A50"/>
    <rect x="-246" y="74" width="252" height="232" fill="none" stroke="#3A2A50" stroke-width="12"/>
    <rect class="puerta" x="100" y="200" width="150" height="240" fill="#1A1226"/><rect class="puertaLuz" x="100" y="200" width="150" height="240" fill="${luz}" opacity="0"/>
    <circle cx="228" cy="330" r="7" fill="#C9A35A"/><circle cx="175" cy="170" r="60" fill="url(#gGlowW)" opacity=".7"/><circle cx="175" cy="172" r="9" fill="#FFF3C9"/>`;
  flores(g, [[90, 438, 1.3], [270, 438, 1.3], [-300, 438, 1.1], [60, 444, .9], [300, 444, .9]]);
  const vs = velas(g, [[-40, 296, .7]]);
  const pic = picado(g, 22, -330, 330, .62, 1);
  return { g, pic };
}

// ---------- ESCENA 0: Base Centinela en la 57 ----------
const g0 = $('g0');
el('rect', { width: 1920, height: 1080, fill: 'url(#gNoche)' }, g0);
const est0 = estrellas(g0, 160, 720);
luna(g0, 1640, 230, 80);
const ca0 = carretera(g0, { lejos: '#2B1650', cerca: '#170C2C', yuca: '#0A0614', asfalto: '#18171E', tierra: '#0D0A12' });
function R0(t) {
  est0(t); moverCarretera(ca0, t, 412, 564, .87);
  const enc = pr(t, L0('radio') + .2, .6); css($('radio0'), enc, 0, (1 - eOut(enc)) * -40, lerp(.92, 1, eOut(enc)));
  radioPanel($('radio0'), t, t > LN.radio.inicio - .1 && t < LN.radio.fin + .1);
  const tLl = tw('radio', 'llamando');
  const k = pr(t, LN.radio.inicio, .4), sac = k > 0 && k < 1 ? Math.sin(t * 90) * 8 * (1 - k) : 0, sal = pr(t, tLl - .1, .35);
  css($('h0a'), cl(k * 2) * (1 - sal), sac, -sal * 40, lerp(1.5, 1, eOut(k)));
  rv($('h0b'), t, tLl, { d: .7, tipo: 'out' });
}

// ---------- ESCENA 1: la espera ----------
const g1 = $('g1');
el('rect', { width: 1920, height: 1080, fill: 'url(#gNoche)' }, g1);
const est1 = estrellas(g1, 140, 760);
luna(g1, 1640, 190, 70);
el('path', { d: cordillera(800, [[70, 2, 2], [25, 6, .4]], 1920), fill: '#1C1036' }, g1);
el('rect', { x: 0, y: 840, width: 1920, height: 240, fill: '#120A1C' }, g1);
const fugaz = el('path', { d: 'M0,0 L-160,60', stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0 }, g1);
const cam1 = el('g', {}, g1);
const casa1 = casa(cam1, 1160, 400, false);
const sendero1 = el('g', {}, cam1);
(function () { let s = ''; for (let i = 0; i < 70; i++) { const u = i / 70, x = 1335 + 300 * u + Math.sin(u * 6) * 40 + (rnd() - .5) * 40, y = 850 + 230 * u + (rnd() - .5) * 20; s += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${7 + u * 6}" ry="${4 + u * 3}" fill="${i % 2 ? '#FF9800' : '#FFB300'}" transform="rotate(${(rnd() * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; } sendero1.innerHTML = s; })();
function R1(t) {
  const t0 = L0('espera'), u = pr(t, t0, L0('camino') - t0);
  est1(t); casa1.pic(t);
  const z = lerp(1, 1.14, eIO(u)); cam1.setAttribute('transform', `translate(${1040 * (1 - z)},${590 * (1 - z)}) scale(${z})`);
  const ninoV = casa1.g.querySelector('.ninoV'); ninoV.setAttribute('transform', `translate(0,${(Math.sin(t * 1.6) * 3).toFixed(2)})`);
  parpadeo(t);
  const kf = pr(t, t0 + 4.5, .9); op(fugaz, kf > 0 && kf < 1 ? Math.sin(kf * Math.PI) : 0); setT(fugaz, 900 - kf * 500, 120 + kf * 180);
  rv($('h1a'), t, t0 + .6, { d: .9, dy: 30 });
}

// ---------- ESCENA 2: el camino de cempasúchil ----------
const g2 = $('g2');
el('rect', { width: 1920, height: 1080, fill: 'url(#gNoche)' }, g2);
const est2 = estrellas(g2, 120, 700);
luna(g2, 300, 200, 60);
const ca2 = carretera(g2, { lejos: '#2E1652', cerca: '#1A0D30', yuca: '#0B0716', asfalto: '#19181F', tierra: '#0F0B14', petalos: true });
function R2(t) {
  est2(t); moverCarretera(ca2, t, 560, 573, .8, .9);
  const t0 = L0('camino');
  rv($('h2a'), t, t0 + .4, { d: .8 });
  rv($('h2b'), t, tw('camino', 'kilómetro a kilómetro'), { tipo: 'back', s0: .5, dy: 0 });
}

// ---------- ESCENA 3: somos los Centinelas (tomas reales en la pantalla grande) ----------
const g3 = $('g3');
el('rect', { width: 1920, height: 1080, fill: 'url(#gCuarto)' }, g3);
el('ellipse', { cx: 680, cy: 480, rx: 900, ry: 420, fill: 'url(#gGlowAz)', opacity: .35 }, g3);
const pic3 = picado(g3, 6, 30, 1890, .8, 2);
flores(g3, [...Array(20)].map((_, i) => [52 + Math.sin(i) * 5, 140 + i * 36, .85]).concat([...Array(20)].map((_, i) => [1868 + Math.sin(i) * 5, 140 + i * 36, .85])));
svgIn(g3, `<rect x="104" y="144" width="1152" height="671" rx="24" fill="#12151C" stroke="#2C313C" stroke-width="3"/><rect x="640" y="815" width="80" height="50" fill="#1A1D24"/><ellipse cx="680" cy="868" rx="170" ry="16" fill="#1A1D24"/>
  <text x="680" y="806" text-anchor="middle" font-family="M" font-weight="800" font-size="14" fill="#5A6070" letter-spacing="4">CABINA CENTINELA</text>`);
el('rect', { x: 0, y: 880, width: 1920, height: 200, fill: '#140D1C' }, g3);
el('rect', { x: 0, y: 880, width: 1920, height: 10, fill: '#2A1E38' }, g3);
flores(g3, [[180, 896, 1.5], [420, 900, 1.2], [940, 900, 1.2], [1180, 896, 1.5], [1500, 900, 1.3], [1760, 896, 1.5]]);
velas(g3, [[300, 896, .9], [1060, 896, .8], [1640, 896, .9]]);
function R3(t) {
  const t0 = L0('equipo'); pic3(t); parpadeo(t);
  setImg($('img3'), clipFrame(CLIPS.equipo, t - t0));
  $('img3').style.transform = `scale(${(1 + .015 * Math.sin((t - t0) * .5)).toFixed(4)})`;
  rv($('live3'), t, t0 + .4, { dy: 0 });
  op($('live3').querySelector('span span'), .4 + .6 * (Math.sin(t * 6) > 0));
  const tR = tw('equipo', 'Centinelas de Ruta'), tS = tw('equipo', 'Centinelas de Seguridad'), tC = tw('equipo', 'Rescates'), tA = tw('equipo', 'siempre atentos');
  rv($('h3a'), t, t0 + .5, { tipo: 'back', s0: .6, dy: 0 });
  rv($('l3a'), t, tR, { dx: 80, dy: 0 });
  rv($('l3b'), t, tS, { dx: 80, dy: 0 });
  rv($('l3c'), t, tC, { dx: 80, dy: 0 });
  rv($('h3b'), t, tA, { dy: 30 });
}

// ---------- ESCENA 4: las alertas ----------
const g4 = $('g4');
el('rect', { width: 1920, height: 1080, fill: '#070A14' }, g4);
let grid4 = '';
for (let x = 0; x <= 1920; x += 60) grid4 += `<path d="M${x},0 V1080" stroke="#0E1A30" stroke-width="1"/>`;
for (let y = 0; y <= 1080; y += 60) grid4 += `<path d="M0,${y} H1920" stroke="#0E1A30" stroke-width="1"/>`;
svgIn(g4, grid4);
const ruta4 = el('path', { d: 'M80,980 C400,900 520,760 820,700 S1300,520 1500,360 S1800,160 1880,120', stroke: '#FF5A00', 'stroke-width': 8, fill: 'none', opacity: .35, 'stroke-linecap': 'round' }, g4);
const LARGO4 = ruta4.getTotalLength();
const punto4 = el('circle', { r: 14, fill: '#FF5A00', stroke: '#fff', 'stroke-width': 3 }, g4);
svgIn(g4, `<rect x="0" y="0" width="1920" height="110" fill="#0B1020"/><text x="70" y="70" font-family="M" font-weight="800" font-size="30" letter-spacing="6" fill="#FF8A3D">COMMAND CENTER · CABINA CENTINELA</text>
  <circle class="vivo" cx="1700" cy="58" r="12" fill="#FF2D2D"/><text x="1724" y="70" font-family="M" font-weight="900" font-size="32" fill="#fff">EN VIVO</text>`);
(function () {
  $('a4a').querySelector('.ico').innerHTML = `<path d="${arco(260, 175, 90, 180, 360)}" stroke="#2A3146" stroke-width="22" fill="none"/><path d="${arco(260, 175, 90, 300, 360)}" stroke="#E5392F" stroke-width="22" fill="none"/><g class="aguja"><path d="M260,175 L330,135" stroke="#fff" stroke-width="8" stroke-linecap="round"/></g><circle cx="260" cy="175" r="14" fill="#fff"/>`;
  $('a4b').querySelector('.ico').innerHTML = `<circle cx="260" cy="150" r="78" fill="#FFC94D"/><path d="M220,140 q14,12 28,0 M272,140 q14,12 28,0" stroke="#3B2A00" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="260" cy="190" rx="18" ry="10" fill="#3B2A00"/><g class="zz" font-family="M" font-weight="900" fill="#AFC0DA"><text x="350" y="100" font-size="40">z</text><text x="380" y="70" font-size="30">z</text></g>`;
  $('a4c').querySelector('.ico').innerHTML = `<g class="tel"><rect x="214" y="70" width="92" height="160" rx="16" fill="#1D2232" stroke="#AFC0DA" stroke-width="6"/><rect x="226" y="90" width="68" height="110" rx="6" fill="#4C7BD9"/><circle cx="260" cy="214" r="6" fill="#AFC0DA"/></g><path d="M190,110 q-14,40 0,80 M330,110 q14,40 0,80" stroke="#E5392F" stroke-width="6" fill="none" stroke-linecap="round"/>`;
})();
function R4(t) {
  const t0 = L0('alertas');
  const P = ruta4.getPointAtLength(LARGO4 * ((t * .05) % 1)); setT(punto4, P.x, P.y);
  document.querySelectorAll('#g4 .vivo').forEach(e => op(e, .4 + .6 * (Math.sin(t * 6) > 0)));
  setImg($('img4'), clipFrame(CLIPS.alertas, t - t0));
  rv($('h4t'), t, t0 + .3, { dy: 30 });
  const ts = [tw('alertas', 'si un tráiler') + .3, tw('alertas', 'si el operador') + .3, tw('alertas', 'o si se distrae') + .3];
  ['a4a', 'a4b', 'a4c'].forEach((id, i) => {
    rv($(id), t, ts[i] - .15, { tipo: 'back', s0: .5, dy: 60, d: .6 });
    const on = t > ts[i] ? (Math.sin((t - ts[i]) * 8) > 0) : false;
    $(id).style.borderColor = on ? '#E5392F' : '#2A3146';
  });
  const ag = $('a4a').querySelector('.aguja'); ag.setAttribute('transform', `rotate(${(-110 + 140 * eOut(pr(t, ts[0], 1)) + Math.sin(t * 20) * 2).toFixed(1)} 260 175)`);
  $('a4b').querySelector('.zz').setAttribute('transform', `translate(0,${(-((t * 20) % 20)).toFixed(1)})`);
  $('a4c').querySelector('.tel').setAttribute('transform', `rotate(${(Math.sin(t * 40) * 4).toFixed(1)} 260 150)`);
}

// ---------- ESCENA 5: la videollamada Centinela ↔ operador ----------
const g5 = $('g5');
el('rect', { width: 1920, height: 1080, fill: 'url(#gCuarto)' }, g5);
el('ellipse', { cx: 960, cy: 560, rx: 980, ry: 520, fill: 'url(#gGlowAz)', opacity: .35 }, g5);
const pic5 = picado(g5, 6, 30, 1890, .8, 0);
const aros5 = svgIn(g5, `<rect class="aroL" x="182" y="182" width="616" height="736" rx="46" fill="none" stroke="#FF5A00" stroke-width="10" opacity=".0"/><rect class="aroR" x="1122" y="182" width="616" height="736" rx="46" fill="none" stroke="#2F6BFF" stroke-width="10" opacity="0"/>`);
svgIn(g5, `<g clip-path="url(#cpCardL)"><rect x="190" y="190" width="600" height="720" fill="#1E2230"/><image href="img/4.webp" x="-28.8" y="190" width="967" height="720" preserveAspectRatio="none"/></g>
  <rect x="190" y="190" width="600" height="720" rx="40" fill="none" stroke="#FF5A00" stroke-width="6"/>
  <g clip-path="url(#cpCardR)"><rect x="1130" y="190" width="600" height="720" fill="#1E2230"/><image href="img/3.webp" x="1130" y="173.6" width="600" height="736.7" preserveAspectRatio="none"/></g>
  <rect x="1130" y="190" width="600" height="720" rx="40" fill="none" stroke="#2F6BFF" stroke-width="6"/>
  <rect x="220" y="836" width="540" height="54" rx="27" fill="#000" opacity=".65"/><text x="490" y="872" text-anchor="middle" font-family="M" font-weight="900" font-size="24" fill="#fff" letter-spacing="2">CENTINELA DE SEGURIDAD</text>
  <rect x="1160" y="836" width="540" height="54" rx="27" fill="#000" opacity=".65"/><text x="1430" y="872" text-anchor="middle" font-family="M" font-weight="900" font-size="24" fill="#fff" letter-spacing="2">OPERADOR · UNIDAD 877</text>`);
const enlace5 = el('path', { d: 'M800,560 Q960,500 1120,560', stroke: '#FF5A00', 'stroke-width': 8, fill: 'none', 'stroke-dasharray': '22 18', 'stroke-linecap': 'round' }, g5);
const tel5 = svgIn(g5, `<circle r="56" fill="#FF5A00"/><circle r="56" fill="none" stroke="#fff" stroke-width="4" opacity=".6"/><path d="M-22,-24 q-6,6 0,20 q12,24 36,36 q14,6 20,0 l-10,-12 q-6,-4 -12,0 q-12,-6 -22,-22 q4,-6 0,-12 Z" fill="#fff"/>`);
const velo5 = el('rect', { width: 1920, height: 1080, fill: '#05040A', opacity: 0 }, g5);
const luna5 = svgIn(g5, `<g transform="translate(960,330)"><circle r="80" fill="url(#gGlowW)" opacity=".6"/><path d="M20,-40 A44,44 0 1 0 20,40 A34,34 0 1 1 20,-40 Z" fill="#FFE9A8"/></g>`);
function R5(t) {
  const t0 = L0('cabina'); pic5(t);
  const tLl = tw('cabina', 'llamamos'), tC = tw('cabina', '¿cómo vas'), tA = tw('cabina', 'A veces'), tD = tw('cabina', 'descansar'), tE = tw('cabina', 'Y eso también');
  const kc = pr(t, tLl + .3, .5);
  op(enlace5, kc * (1 - pr(t, tE - .3, .4))); enlace5.setAttribute('stroke-dashoffset', (-t * 90).toFixed(1));
  rvS(tel5, t, tLl + .3, 960, 520, { s: 1 + .06 * Math.sin(t * 10), fin: tE - .3 });
  rv($('h5t'), t, tLl + .2, { dy: 0, fin: tE - .3 });
  const seg = Math.max(0, Math.floor(t - tLl)); $('reloj5').textContent = '00:' + String(seg).padStart(2, '0');
  const hablaL = (t > tC && t < tC + 1.8) || (t > tD - .3 && t < tD + 1.6), hablaR = t > tA && t < tA + 1.8;
  aros5.querySelector('.aroL').setAttribute('opacity', hablaL ? (.55 + .45 * Math.sin(t * 9)).toFixed(2) : 0);
  aros5.querySelector('.aroR').setAttribute('opacity', hablaR ? (.55 + .45 * Math.sin(t * 9)).toFixed(2) : 0);
  rv($('b5a'), t, tC, { tipo: 'back', s0: .5, dy: 30, fin: tD - .5 });
  rv($('b5b'), t, tA, { tipo: 'back', s0: .5, dy: 30, fin: tE - .3 });
  rv($('b5c'), t, tD - .2, { tipo: 'back', s0: .5, dy: 30, fin: tE - .3 });
  const kv = pr(t, tE - .3, .6); velo5.setAttribute('opacity', (.78 * kv).toFixed(3));
  rvS(luna5, t, tE - .2, 0, 0, { s: 1 });
  rv($('h5a'), t, tE, { tipo: 'back', s0: .5, dy: 0 });
  rv($('h5b'), t, tE + .5, { tipo: 'back', s0: .6, dy: 0 });
}

// ---------- ESCENA 6: el mensaje (pizarrón de corcho) ----------
const g6 = $('g6');
el('rect', { width: 1920, height: 1080, fill: 'url(#gCorcho)' }, g6);
(function () { let s = ''; for (let i = 0; i < 900; i++) s += `<circle cx="${(rnd() * 1920).toFixed(0)}" cy="${(rnd() * 1080).toFixed(0)}" r="${(1 + rnd() * 2.2).toFixed(1)}" fill="${rnd() > .5 ? '#6E4524' : '#D7A36B'}" opacity=".5"/>`; svgIn(g6, s); })();
svgIn(g6, `<rect x="0" y="0" width="1920" height="1080" fill="none" stroke="#5A3A1E" stroke-width="40"/>`);
function dibujoPapel(x, y, r, contenido, fondo = '#FFFFFF') {
  return svgIn(g6, `<g transform="translate(${x},${y}) rotate(${r})"><rect x="-150" y="-110" width="300" height="220" fill="${fondo}"/><circle cx="0" cy="-104" r="12" fill="#1E88E5"/>
    <g fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${contenido}</g></g>`);
}
dibujoPapel(250, 820, -6, `<path d="M-100,30 h120 v-60 h40 l30,30 v30 h-190 z" stroke="#FB8C00"/><circle cx="-70" cy="44" r="16" stroke="#333"/><circle cx="20" cy="44" r="16" stroke="#333"/><circle cx="90" cy="-60" r="22" stroke="#FDD835"/>`);
dibujoPapel(960, 840, 3, `<path d="M-60,40 v-60 l60,-50 l60,50 v60 z" stroke="#E53935"/><path d="M-12,40 v-34 h24 v34" stroke="#8D6E63"/><path d="M-110,60 h220" stroke="#43A047"/><path d="M80,-40 c10,-20 40,-10 30,10 l-30,30 l-30,-30 c-10,-20 20,-30 30,-10" stroke="#E91E63"/>`, '#FFFDE7');
dibujoPapel(1670, 820, -3, `<circle cx="-50" cy="-40" r="20" stroke="#1E88E5"/><path d="M-50,-20 v60 M-50,40 l-20,40 M-50,40 l20,40 M-80,0 h60" stroke="#1E88E5"/><circle cx="50" cy="0" r="14" stroke="#E91E63"/><path d="M50,14 v36 M50,50 l-14,28 M50,50 l14,28 M30,26 h40" stroke="#E91E63"/><path d="M-20,10 h50" stroke="#FB8C00"/>`);
function R6(t) {
  const t0 = L0('mensaje'), t3 = tw('mensaje', 'tres cosas');
  rv($('h6a'), t, t0 + .3, { d: .7, fin: t3 - .4 });
  rv($('h6b'), t, t3 - .1, { tipo: 'back', s0: .6, dy: 0 });
  const tn = [tw('mensaje', 'Maneja con calma'), tw('mensaje', 'Descansa'), tw('mensaje', 'Y el celular')];
  ['n6a', 'n6b', 'n6c'].forEach((id, i) => rv($(id), t, tn[i] - .1, { tipo: 'back', s0: .3, dy: -80, d: .7, r: [-4, 2, 4][i] + Math.sin(t * 1.5 + i) * .8, r0: [-14, 10, 14][i] }));
}

// ---------- ESCENA 7: Mini Centinela ----------
const g7 = $('g7');
el('rect', { width: 1920, height: 1080, fill: 'url(#gCuarto)' }, g7);
const est7 = estrellas(g7, 90, 1080);
const pic7 = picado(g7, 6, 30, 1890, .8, 3);
el('circle', { cx: 560, cy: 560, r: 460, fill: 'url(#gGlowY)', opacity: .35 }, g7);
const rayos7 = el('g', {}, g7);
for (let i = 0; i < 18; i++) { const a0 = i * 20 * Math.PI / 180, a1 = a0 + 8 * Math.PI / 180; el('path', { d: `M0,0 L${700 * Math.cos(a0)},${700 * Math.sin(a0)} L${700 * Math.cos(a1)},${700 * Math.sin(a1)} Z`, fill: '#FFB300', opacity: .08 }, rayos7); }
function estrella(n, R, r) { let d = ''; for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, q = i % 2 ? r : R; d += (i ? 'L' : 'M') + (q * Math.cos(a)).toFixed(1) + ',' + (q * Math.sin(a)).toFixed(1); } return d + 'Z'; }
const placa7 = svgIn(g7, `<path d="${estrella(8, 300, 240)}" fill="#E65100"/><path d="${estrella(8, 280, 226)}" fill="#FFB300"/>
  <circle r="196" fill="#1A1028"/><circle r="196" fill="none" stroke="#FFD54F" stroke-width="10"/><circle r="172" fill="none" stroke="#FFB300" stroke-width="3" stroke-dasharray="10 8"/>
  <g transform="translate(-6,-26) scale(.62)"><use href="#logoC"/></g>
  <path d="M-330,150 L-270,120 L270,120 L330,150 L270,180 L270,250 L-270,250 L-270,180 Z" fill="#FF5A00"/><path d="M-270,120 H270 V250 H-270 Z" fill="#FF6A10"/>
  <text x="0" y="208" text-anchor="middle" font-family="Anton" font-size="78" fill="#fff" letter-spacing="3">MINI CENTINELA</text>
  <path class="brillo" d="M-60,-300 L0,-300 L-200,300 L-260,300 Z" fill="#fff" opacity=".18"/>`);
const chispas7 = [...Array(10)].map(() => svgIn(g7, '<path d="M0,-24 L6,-6 L24,0 L6,6 L0,24 L-6,6 L-24,0 L-6,-6 Z" fill="#FFE58A"/>'));
function R7(t) {
  const t0 = L0('mini'); est7(t); pic7(t);
  setT(rayos7, 560, 540, 1, t * 10);
  const k = pr(t, t0 + .2, 1.0);
  setT(placa7, 560, 540, Math.max(.001, eBack(k) * (1 + .015 * Math.sin(t * 3))), lerp(-200, 0, eOut(k)));
  placa7.querySelector('.brillo').setAttribute('transform', `translate(${lerp(-300, 700, pr(t, t0 + 1.4, 1.2))},0)`);
  chispas7.forEach((c, i) => { const a = i / 10 * Math.PI * 2, kk = pr(t, t0 + 1.1 + i * .08, 1); op(c, kk > 0 && kk < 1 ? 1 : 0); setT(c, 560 + Math.cos(a) * (340 + 60 * kk), 540 + Math.sin(a) * (340 + 60 * kk), Math.max(.001, Math.sin(kk * Math.PI)), kk * 120); });
  rv($('h7a'), t, tw('mini', 'Mini Centinela') - .3, { tipo: 'back', s0: .6, dy: 0 });
  rv($('h7b'), t, tw('mini', 'Tu misión'), { dy: 40 });
}

// ---------- ESCENA 8: tú eres su razón (dibujo con crayones) ----------
const g8 = $('g8');
el('rect', { width: 1920, height: 1080, fill: '#FFF8E7' }, g8);
(function () { let s = ''; for (let y = 120; y < 1080; y += 60) s += `<path d="M0,${y} H1920" stroke="#C5D7F2" stroke-width="2"/>`; s += '<path d="M160,0 V1080" stroke="#F4A7A7" stroke-width="3"/>'; svgIn(g8, s); })();
const trazos8 = svgIn(g8, `<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="12">
  <path pathLength="1" d="M300,860 H1000" stroke="#43A047"/>
  <path pathLength="1" d="M330,860 V620 L470,500 L610,620 V860" stroke="#E53935"/>
  <path pathLength="1" d="M440,860 V740 H500 V860" stroke="#8D6E63"/>
  <path pathLength="1" d="M660,820 H860 V740 H920 L960,780 V820 Z" stroke="#FB8C00"/>
  <path pathLength="1" d="M690,840 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0 M880,840 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0" stroke="#333"/>
  <path pathLength="1" d="M870,250 a60,60 0 1,0 120,0 a60,60 0 1,0 -120,0 M930,150 V110 M1030,250 H1070 M1000,180 L1030,150 M860,180 L830,150" stroke="#FDD835"/>
  <path pathLength="1" d="M520,560 a26,26 0 1,0 52,0 a26,26 0 1,0 -52,0 M546,586 V700 M546,700 L516,780 M546,700 L576,780 M500,630 H596" stroke="#1E88E5"/>
  <path pathLength="1" d="M640,640 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0 M660,660 V730 M660,730 L640,790 M660,730 L680,790 M596,680 L640,690 H690" stroke="#E91E63"/>
  <path pathLength="1" d="M600,470 c0,-40 60,-50 70,-10 c10,-40 70,-30 70,10 c0,40 -70,80 -70,80 c0,0 -70,-40 -70,-80 Z" stroke="#E53935"/>
</g>`);
const listaTrazos8 = [...trazos8.querySelectorAll('path')];
listaTrazos8.forEach(p => { p.setAttribute('stroke-dasharray', '1'); p.setAttribute('stroke-dashoffset', '1'); });
function R8(t) {
  const t0 = L0('razon');
  listaTrazos8.forEach((p, i) => p.setAttribute('stroke-dashoffset', (1 - eOut(pr(t, t0 + .1 + i * .28, .55))).toFixed(3)));
  rv($('h8a'), t, LN.razon.inicio - .1, { d: .8, dy: 30 });
}

// ---------- ESCENA 9: el regreso a casa ----------
const g9 = $('g9');
el('rect', { width: 1920, height: 1080, fill: 'url(#gAmanecer)' }, g9);
const sol9 = svgIn(g9, '<circle r="320" fill="url(#gGlowY)" opacity=".55"/><circle r="130" fill="url(#gSol)"/>');
el('path', { d: cordillera(760, [[110, 2, 1.3], [40, 5, .2]], 1920), fill: '#6B1E5E' }, g9);
el('path', { d: cordillera(820, [[60, 3, 2.2], [20, 8, .7]], 1920), fill: '#3A0F45' }, g9);
el('rect', { x: 0, y: 850, width: 1920, height: 230, fill: '#2A0E30' }, g9);
el('rect', { x: 0, y: 880, width: 1920, height: 100, fill: '#1E1A24' }, g9);
const casa9 = casa(g9, 1440, 440, true);
casa9.g.querySelector('.ninoV').style.display = 'none';
const sendero9 = el('g', {}, g9);
(function () { let s = ''; for (let i = 0; i < 60; i++) { const u = i / 60, x = 900 + 620 * u + (rnd() - .5) * 30, y = 905 - 20 * Math.sin(u * Math.PI) + (rnd() - .5) * 18; s += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="8" ry="4.5" fill="${i % 2 ? '#FF9800' : '#FFB300'}"/>`; } sendero9.innerHTML = s; })();
const troca9 = svgIn(g9, '<use href="#trailer"/>');
const papa9 = svgIn(g9, '<use href="#adulto" fill="#1A0E22"/>');
const nino9 = svgIn(g9, '<use href="#nino" fill="#1A0E22"/>');
const abrazo9 = svgIn(g9, '<use href="#abrazo" fill="#1A0E22" color="#1A0E22"/>');
const corazones9 = [...Array(6)].map(() => svgIn(g9, '<path d="M0,-10 c0,-14 20,-18 22,-4 c2,-14 22,-10 22,4 c0,14 -22,28 -22,28 c0,0 -22,-14 -22,-28 Z" fill="#FF2D55"/>'));
function R9(t) {
  const t0 = LIM[9]; casa9.pic(t); parpadeo(t);
  setT(sol9, 1180, lerp(860, 700, eOut(pr(t, t0, 7))));
  const tPorque = LN.regreso.inicio, tCasa = tw('regreso', 'que llegar a casa');
  const kt = eOut(pr(t, t0, 1.6));
  setT(troca9, lerp(-760, 120, kt), 640 + (kt < 1 ? Math.sin(t * 9) * 1.2 : 0), 1.0);
  const ka = pr(t, tPorque + .1, .5), kw = eIO(pr(t, tPorque + .5, 1.8));
  op(papa9, cl(ka * 2) * (1 - pr(t, tCasa - .05, .25))); setT(papa9, lerp(800, 1020, kw), 905, 1.05);
  casa9.g.querySelector('.puertaLuz').setAttribute('opacity', (.95 * pr(t, tPorque + .3, .5)).toFixed(3));
  const kn = eIO(pr(t, tPorque + .7, 1.6));
  op(nino9, cl(pr(t, tPorque + .6, .3) * 2) * (1 - pr(t, tCasa - .05, .25))); setT(nino9, lerp(1615, 1140, kn), 905 + Math.abs(Math.sin(t * 12)) * -6 * (kn > 0 && kn < 1), 1.1, 0, 1.1);
  op(abrazo9, pr(t, tCasa - .1, .3)); setT(abrazo9, 1040, 905, 1.1);
  corazones9.forEach((c, i) => { const k = pr(t, tCasa + .2 + i * .35, 2.2); op(c, k > 0 && k < 1 ? Math.sin(k * Math.PI) : 0); setT(c, 1080 + Math.sin(i * 2.1 + t) * 50, 640 - k * 260, .9 + (i % 3) * .2); });
  rv($('h9a'), t, tCasa - .2, { dy: 30 });
  rv($('h9b'), t, tCasa + .3, { tipo: 'back', s0: .6, dy: 0 });
}

// ---------- ESCENA 10: cierre con el logo ----------
const g10 = $('g10');
el('rect', { width: 1920, height: 1080, fill: 'url(#gCuarto)' }, g10);
const pic10 = picado(g10, 6, 30, 1890, .8, 4);
el('circle', { cx: 520, cy: 470, r: 440, fill: 'url(#gGlowO)', opacity: .35 }, g10);
el('rect', { x: 0, y: 860, width: 1920, height: 220, fill: '#140C1E' }, g10);
flores(g10, [...Array(22)].map((_, i) => [60 + i * 86, 870 + (i % 2) * 14, 1.3]));
velas(g10, [[200, 862, 1], [420, 862, .8], [640, 862, 1], [860, 862, .8], [1080, 862, 1], [1300, 862, .8], [1520, 862, 1], [1740, 862, .8]]);
const ondas10 = [0, 1, 2].map(() => el('path', { fill: 'none', stroke: '#FF5A00', 'stroke-width': 8, 'stroke-linecap': 'round' }, g10));
const logo10 = el('g', {}, g10); logo10.innerHTML = `<g mask="url(#mLogo)">${logoSVG('lg10')}</g>`;
function R10(t) {
  const t0 = L0('cierre'); pic10(t); parpadeo(t);
  $('mLogoP').setAttribute('d', sectorAnular2(-122, -222 * eIO(pr(t, t0 + .1, 1.0))));
  const ld = logo10.querySelector('.ld'); ld.setAttribute('transform', `translate(36,-40) scale(${Math.max(.001, eBack(pr(t, t0 + .9, .5)))}) translate(-36,40)`);
  setT(logo10, 520, 470, 1.25 * (1 + .015 * Math.sin(t * 2.5)));
  ondas10.forEach((o, i) => { const k = ((t - t0 - 1.4) * .7 + i / 3) % 1; if (t - t0 < 1.4) { op(o, 0); return; } o.setAttribute('d', arco(520 + 45, 470 - 50, 100 + k * 330, -95, 5)); op(o, (1 - k) * .85); });
  rv($('h10a'), t, LN.cierre.inicio - .1, { dx: 60, dy: 0 });
  rv($('h10b'), t, tw('cierre', 'y cuidamos'), { dx: 60, dy: 0 });
  rv($('h10c'), t, tw('cierre', 'Desde la cabina'), { dy: 40, d: .7 });
}

// ---------- ESCENA 11: cambio y fuera ----------
const g11 = $('g11');
el('rect', { width: 1920, height: 1080, fill: '#08070D' }, g11);
el('circle', { cx: 960, cy: 520, r: 700, fill: 'url(#gGlowO)', opacity: .18 }, g11);
el('rect', { x: 0, y: 860, width: 1920, height: 220, fill: '#120A1A' }, g11);
flores(g11, [...Array(22)].map((_, i) => [60 + i * 86, 880 + (i % 2) * 14, 1.2]));
const logo11 = svgIn(g11, '<use href="#logoC"/>');
function R11(t) {
  const t0 = L0('cambio');
  const enc = pr(t, t0 + .1, .6); css($('radio11'), enc, 0, (1 - eOut(enc)) * -40, lerp(.92, 1, eOut(enc)));
  radioPanel($('radio11'), t, t > LN.cambio.inicio - .1 && t < LN.cambio.fin + .1);
  rv($('h11a'), t, tw('cambio', 'gracias'), { dy: 30 });
  rv($('h11b'), t, tw('cambio', 'Cambio y fuera'), { tipo: 'elas', s0: .3, dy: 0, d: .9 });
  rv($('h11c'), t, LN.cambio.fin + .4, { dy: 20 });
  rvS(logo11, t, LN.cambio.fin + .6, 960, 960, { s: .32 });
}

// ---------- tomas reales: reproductor cuadro por cuadro ----------
function clipFrame(lista, u) {
  const total = lista.reduce((a, [, n]) => a + n / 30, 0);
  u = Math.max(0, u) % total;  // si la escena dura más que las tomas, vuelve a empezar
  let acc = 0;
  for (let i = 0; i < lista.length; i++) {
    const [id, n] = lista[i], d = n / 30;
    if (u < acc + d || i === lista.length - 1) {
      const k = cl(Math.floor(Math.max(0, u - acc) * 30), 0, n - 1) + 1;
      return `img/real/${id}_${String(k).padStart(4, '0')}.jpg`;
    }
    acc += d;
  }
}
const PEND = [];
function setImg(img, src) {
  if (img.dataset.src === src) return;
  img.dataset.src = src; img.src = src; PEND.push(img.decode().catch(() => {}));
}

// ---------- el tractor 877 (imagen) con ojos y boca animados ----------
function caraTroca(svg) {
  const g = el('g', {}, svg);
  g.innerHTML = `<image href="img/2.webp" x="0" y="0" width="1600" height="898"/>
    <g clip-path="url(#cpParabrisas)"><g class="parpado"><rect x="530" y="-20" width="520" height="220" fill="#34506E"/><rect x="530" y="190" width="520" height="10" fill="#1E2E42"/></g></g>
    <g class="boca"><path class="bocaP" d="" fill="#2A1214"/><ellipse class="lengua" cx="900" cy="730" rx="40" ry="10" fill="#C2505A"/></g>`;
  return g;
}
const PARPADEOS = [1.1, 3.9, 4.15, 7.3, 10.2, 12.8, 15.6];
function animarCara(g, t, t0, hablando) {
  let k = 0;
  PARPADEOS.forEach(b => { const p = (t - t0 - b) / .22; if (p > 0 && p < 1) k = Math.max(k, Math.sin(p * Math.PI)); });
  g.querySelector('.parpado').setAttribute('transform', `translate(0,${(k * 160).toFixed(1)})`);
  const e = hablando ? (envAt(t - 1 / 30) + envAt(t) + envAt(t + 1 / 30)) / 3 : 0;
  const o = cl((e - .1) * 1.35);
  const boca = g.querySelector('.boca');
  boca.style.visibility = o > .04 ? 'visible' : 'hidden';
  boca.querySelector('.bocaP').setAttribute('d', `M776,688 Q900,712 1028,688 Q900,${(742 + 62 * o).toFixed(1)} 776,688 Z`);
  const l = boca.querySelector('.lengua'); l.setAttribute('cy', (722 + 40 * o).toFixed(1)); l.setAttribute('rx', (30 + 50 * o).toFixed(1)); l.setAttribute('ry', (6 + 12 * o).toFixed(1));
  l.style.visibility = o > .25 ? 'visible' : 'hidden';
  return o;
}
function camaraTroca(cam, z, o, fx = 1080, fy = 480) {
  cam.setAttribute('transform', `translate(${fx},${fy - o * 6}) scale(${z * (1 + o * .004)}) translate(${-fx},${-fy}) scale(1.2)`);
}

// ---------- ESCENA B: bienvenida ----------
const gB = $('gB');
el('rect', { width: 1920, height: 1080, fill: '#A9C8EC' }, gB);
const camB = el('g', {}, gB), caraB = caraTroca(camB);
function RB(t) {
  const f = LN.bienvenida.fin, habla = t > LN.bienvenida.inicio - .1 && t < f + .1;
  const o = animarCara(caraB, t, 0, habla);
  const sal = eIO(pr(t, f + .15, 1.0));
  camaraTroca(camB, lerp(1, 1.06, pr(t, 0, f)) * (1 + sal * .7), o, 1080, 470);
  rv($('insB'), t, .3, { dy: -20 });
  const tB = tw('bienvenida', 'Bienvenidos'), tS = tw('bienvenida', '¡Súbanse');
  rv($('bB1'), t, LN.bienvenida.inicio, { tipo: 'back', s0: .5, dy: 20, fin: tB - .25 });
  rv($('bB2'), t, tB, { tipo: 'back', s0: .5, dy: 20, fin: tS - .25 });
  rv($('bB3'), t, tS, { tipo: 'back', s0: .5, dy: 20, fin: f + .3 });
}

// ---------- ESCENA R: arranque en carretera (toma real) ----------
function RR(t) {
  const u = t - L0('carretera');
  setImg($('imgR'), clipFrame(CLIPS.carretera, u));
  $('imgR').style.transform = `scale(${(1.02 + u * .012).toFixed(4)})`;
  rv($('hR'), t, L0('carretera') + .3, { dx: -60, dy: 0 });
}

// ---------- ESCENA P: la importancia del descanso (el 877 duerme en la zona de descanso) ----------
const gP = $('gP');
el('rect', { width: 1920, height: 1080, fill: 'url(#gNoche)' }, gP);
const estP = estrellas(gP, 150, 760);
luna(gP, 780, 190, 70);
el('path', { d: cordillera(720, [[110, 2, .6], [40, 5, 1.9]], 1920), fill: '#2B1650' }, gP);
el('path', { d: cordillera(800, [[60, 3, 1.2], [25, 7, .4]], 1920), fill: '#170C2C' }, gP);
el('g', { fill: '#0A0614', stroke: '#0A0614', 'stroke-linecap': 'round' }, gP).innerHTML = [[640, 120], [980, 140], [1240, 100], [1520, 150], [1780, 120]].map(([x, h]) => yuca(x, 842, h, h / 130)).join('');
el('rect', { x: 0, y: 838, width: 1920, height: 242, fill: '#16151C' }, gP);
el('rect', { x: 0, y: 838, width: 1920, height: 4, fill: '#fff', opacity: .25 }, gP);
svgIn(gP, [...Array(9)].map((_, i) => `<path d="M${-40 + i * 250},1080 L${60 + i * 250},880" stroke="#E8E8EE" stroke-width="7" opacity=".5"/>`).join(''));
// letrero de zona de descanso
svgIn(gP, `<g transform="translate(110,250)"><rect x="70" y="150" width="14" height="440" fill="#9AA0A8"/><rect x="386" y="150" width="14" height="440" fill="#9AA0A8"/>
  <rect x="0" y="0" width="476" height="190" rx="18" fill="#0B4FA8" stroke="#fff" stroke-width="6"/>
  <rect x="26" y="26" width="110" height="138" rx="14" fill="#fff"/><text x="81" y="140" text-anchor="middle" font-family="Anton" font-size="128" fill="#0B4FA8">P</text>
  <text x="160" y="88" font-family="M" font-weight="900" font-size="46" fill="#fff">ZONA DE</text><text x="160" y="146" font-family="M" font-weight="900" font-size="46" fill="#fff">DESCANSO</text></g>`);
el('ellipse', { cx: 348, cy: 345, rx: 360, ry: 190, fill: 'url(#gGlowW)', opacity: .25 }, gP);
const trocaP = troca877(gP);
const zzP = [0, 1, 2].map(() => { const z = el('text', { 'font-family': 'Kid', 'font-size': 80, fill: '#DCE8FF', 'text-anchor': 'middle', stroke: '#1A1240', 'stroke-width': 3, 'paint-order': 'stroke' }, gP); z.textContent = 'Z'; return z; });
function RP(t) {
  const t0 = L0('descanso'); estP(t);
  const resp = Math.sin(t * 2.2);
  trocaP.g.setAttribute('transform', `translate(60,${(864 - 340 * .72 - resp * 1.5).toFixed(1)}) scale(.72,${(.72 * (1 + .006 * resp)).toFixed(4)})`);
  parpadea(trocaP, t, true);
  zzP.forEach((z, i) => {
    const u = ((t - t0) * .42 + i / 3) % 1;
    z.setAttribute('x', (850 + u * 120 + Math.sin(u * 7 + i) * 16).toFixed(1));
    z.setAttribute('y', (640 - u * 300).toFixed(1));
    z.setAttribute('font-size', (40 + u * 70).toFixed(0));
    op(z, t < t0 ? 0 : Math.sin(u * Math.PI) * .95);
  });
  rv($('hPa'), t, t0 + .3, { dy: 40 });
  rv($('hP1'), t, tw('descanso', 'Dormir'), { dx: 80, dy: 0 });
  rv($('hP2'), t, tw('descanso', 'hacer pausas'), { dx: 80, dy: 0 });
  rv($('hP3'), t, tw('descanso', 'y si le da sueño'), { dx: 80, dy: 0 });
  rv($('hPc'), t, tw('descanso', 'Porque un operador'), { tipo: 'back', s0: .6, dy: 0 });
}

// ---------- ESCENA Q: rescates carreteros (llega la Unidad de Asistencia Móvil) ----------
const gQ = $('gQ');
el('rect', { width: 1920, height: 1080, fill: 'url(#gNoche)' }, gQ);
const estQ = estrellas(gQ, 120, 700);
luna(gQ, 1660, 450, 54);
const caQ = carretera(gQ, { lejos: '#2B1650', cerca: '#170C2C', yuca: '#0A0614', asfalto: '#18171E', tierra: '#0D0A12' });
[caQ.troca.g, caQ.haz, caQ.faro].forEach(e => op(e, 0));
const parado = troca877(gQ); setT(parado.g, 70, 862 - 340 * .74, .74);
const interm = [[14, 236], [1130, 252], [960, 246]].map(([x, y]) => svgIn(gQ, `<circle cx="${70 + x * .74}" cy="${862 - 340 * .74 + y * .74}" r="44" fill="url(#gGlowY)"/><circle cx="${70 + x * .74}" cy="${862 - 340 * .74 + y * .74}" r="8" fill="#FFB300"/>`));
const hazVan = el('polygon', { points: '0,0 560,-70 560,90', fill: 'url(#gBeam)', opacity: .8 }, gQ);
const van = vehiculo(gQ, VAN, 'img/van.png');
const barra = svgIn(van.g, `<rect x="880" y="-6" width="250" height="26" rx="10" fill="#2A2A30"/><rect class="b1" x="886" y="-22" width="116" height="26" rx="12" fill="#FF8A00"/><rect class="b2" x="1008" y="-22" width="116" height="26" rx="12" fill="#FFD200"/>`);
const torreta = svgIn(gQ, '<circle r="120" fill="url(#gGlowO)"/>');
const faroVan = el('circle', { r: 46, fill: 'url(#gGlowW)' }, gQ);
function RQ(t) {
  const t0 = L0('rescate'); estQ(t);
  moverCarretera(caQ, t, 0, 0, 1, 0);
  interm.forEach(g => op(g, Math.sin(t * 9) > 0 ? 1 : .15));
  const S = .4, X0 = 1980, X1 = 1060, k = eOut(pr(t, t0 + .2, 3.4)), x = lerp(X0, X1, k), y = 935 - 752 * S;
  const bote = k < 1 ? Math.sin(t * 15) * 1.6 * (1 - k) : 0;
  setT(van.g, x, y + bote, S);
  girar(van, (x - X0) / (VAN.r * S) * 57.3 * .5);
  const on = Math.sin(t * 14) > 0;
  barra.querySelector('.b1').setAttribute('fill', on ? '#FF8A00' : '#5A3000');
  barra.querySelector('.b2').setAttribute('fill', on ? '#5A4A00' : '#FFD200');
  op(torreta, .55 + .45 * Math.abs(Math.sin(t * 12))); setT(torreta, x + 1005 * S, y - 4 * S + bote);
  const fx = x + VAN.faro[0] * S, fy = y + VAN.faro[1] * S + bote;
  setT(faroVan, fx, fy); setT(hazVan, fx, fy, -1, 0, 1);
  rv($('hQa'), t, tw('rescate', 'Rescates Carreteros'), { dx: -60, dy: 0 });
  rv($('hQb'), t, tw('rescate', 'nadie se queda'), { tipo: 'back', s0: .6, dy: 0 });
}

// ---------- ESCENA D: despedida del 877 ----------
const gD = $('gD');
el('rect', { width: 1920, height: 1080, fill: '#A9C8EC' }, gD);
const camD = el('g', {}, gD), caraD = caraTroca(camD);
function RD(t) {
  const t0 = L0('despedida'), f = LN.despedida.fin, habla = t > LN.despedida.inicio - .1 && t < f + .1;
  const o = animarCara(caraD, t, t0 - .5, habla);
  const sal = eIO(pr(t, f + .1, 1.1));
  camaraTroca(camD, lerp(1.14, 1.2, pr(t, t0, f - t0)) * (1 + sal * .7), o, 1080, 430);
  const tN = tw('despedida', 'No olviden'), tV = tw('despedida', '¡Nos vemos');
  rv($('bD1'), t, LN.despedida.inicio, { tipo: 'back', s0: .5, dy: 20, fin: tN - .25 });
  rv($('bD2'), t, tN, { tipo: 'back', s0: .5, dy: 20, fin: tV - .25 });
  rv($('bD3'), t, tV, { tipo: 'back', s0: .5, dy: 20, fin: f + .3 });
}

// ---------- ESCENA F: el abrazo final al atardecer ----------
svgIn(defs, `<pattern id="pCuadros" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#B3262E"/><rect y="10" width="28" height="8" fill="#7C1A22" opacity=".85"/><rect x="10" width="8" height="28" fill="#7C1A22" opacity=".85"/><rect y="13" width="28" height="2" fill="#1F2A55"/><rect x="13" width="2" height="28" fill="#1F2A55"/></pattern>`);
const PIEL = '#C98C5B';
const brazoPapa = lado => `<g class="brazo${lado}"><rect x="-18" y="0" width="36" height="150" rx="18" fill="url(#pCuadros)"/><circle cx="0" cy="160" r="19" fill="${PIEL}"/></g>`;
svgIn(defs, `<g id="papaCuerpo">
  <rect x="-52" y="-164" width="46" height="164" rx="12" fill="#2F4A7A"/><rect x="6" y="-164" width="46" height="164" rx="12" fill="#2F4A7A"/>
  <rect x="-60" y="-16" width="58" height="18" rx="9" fill="#1A1A22"/><rect x="2" y="-16" width="58" height="18" rx="9" fill="#1A1A22"/>
  <rect x="-76" y="-322" width="152" height="176" rx="38" fill="url(#pCuadros)"/><rect x="-72" y="-168" width="144" height="14" fill="#3A2A20"/>
  <rect x="-15" y="-344" width="30" height="30" fill="#B97B4E"/>
  <circle cx="-40" cy="-378" r="10" fill="#B97B4E"/><circle cx="40" cy="-378" r="10" fill="#B97B4E"/><circle cx="0" cy="-380" r="42" fill="${PIEL}"/>
  <path d="M-30,-350 Q0,-332 30,-350 Q24,-334 0,-330 Q-24,-334 -30,-350 Z" fill="#9AA0A8"/>
  <circle cx="-15" cy="-384" r="4.5" fill="#2B1B12"/><circle cx="15" cy="-384" r="4.5" fill="#2B1B12"/><path d="M-14,-362 Q0,-352 14,-362" stroke="#6E3A22" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M-44,-386 Q-42,-430 0,-432 Q42,-430 44,-386 Z" fill="#1B2238"/><path d="M-48,-388 Q0,-372 48,-388 L52,-380 Q0,-362 -52,-380 Z" fill="#11162A"/><circle cx="0" cy="-414" r="7" fill="#FF5A00"/></g>`);
svgIn(defs, `<g id="ninoCorre"><g class="pA"><rect x="-12" y="0" width="24" height="86" rx="10" fill="#2F4A7A"/><rect x="-20" y="78" width="36" height="13" rx="6" fill="#222"/></g>
  <g class="bA"><rect x="-9" y="0" width="18" height="74" rx="9" fill="#D32F2F"/><circle cx="0" cy="78" r="10" fill="${PIEL}"/></g>
  <rect x="-28" y="-92" width="56" height="98" rx="22" fill="#D32F2F"/>
  <g class="pB"><rect x="-12" y="0" width="24" height="86" rx="10" fill="#2F4A7A"/><rect x="-20" y="78" width="36" height="13" rx="6" fill="#222"/></g>
  <circle cx="-2" cy="-120" r="31" fill="${PIEL}"/><path d="M-33,-124 Q-31,-158 0,-156 Q31,-154 31,-128 Q14,-140 -6,-136 Q-22,-136 -33,-124 Z" fill="#4A2A18"/>
  <circle cx="-17" cy="-122" r="4" fill="#222"/><path d="M-26,-104 q9,7 18,0" stroke="#7A3B2A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <g class="bB"><rect x="-9" y="0" width="18" height="74" rx="9" fill="#E04848"/><circle cx="0" cy="78" r="10" fill="${PIEL}"/></g></g>`);
svgIn(defs, `<g id="ninaCorre"><path d="M14,-150 Q44,-120 30,-60 L16,-64 Q24,-110 4,-140 Z" fill="#6B3A1E"/>
  <g class="pA"><rect x="-9" y="0" width="18" height="70" rx="8" fill="${PIEL}"/><rect x="-16" y="64" width="30" height="12" rx="6" fill="#E91E63"/></g>
  <g class="bA"><rect x="-8" y="0" width="16" height="64" rx="8" fill="${PIEL}"/><circle cx="0" cy="68" r="9" fill="${PIEL}"/></g>
  <path d="M-22,-84 L22,-84 L44,6 L-44,6 Z" fill="#EEDCF5"/><path d="M-44,6 L44,6 L40,-6 L-40,-6 Z" fill="#D7B6E8"/>
  <g class="pB"><rect x="-9" y="0" width="18" height="70" rx="8" fill="${PIEL}"/><rect x="-16" y="64" width="30" height="12" rx="6" fill="#E91E63"/></g>
  <circle cx="-2" cy="-110" r="28" fill="${PIEL}"/><path d="M-30,-110 Q-30,-144 0,-142 Q30,-142 30,-112 Q20,-128 0,-126 Q-16,-126 -30,-110 Z" fill="#6B3A1E"/>
  <circle cx="-16" cy="-112" r="3.6" fill="#222"/><path d="M-24,-96 q8,6 16,0" stroke="#A04050" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="18" cy="-138" r="7" fill="#FF6FA8"/>
  <g class="bB"><rect x="-8" y="0" width="16" height="64" rx="8" fill="${PIEL}"/><circle cx="0" cy="68" r="9" fill="${PIEL}"/></g></g>`);
const gF = $('gF');
el('rect', { width: 1920, height: 1080, fill: 'url(#gOcaso)' }, gF);
const estF = estrellas(gF, 60, 300);
el('circle', { cx: 1150, cy: 820, r: 520, fill: 'url(#gGlowY)', opacity: .5 }, gF);
svgIn(gF, `<ellipse cx="420" cy="420" rx="300" ry="24" fill="#FFB7C5" opacity=".18"/><ellipse cx="1420" cy="470" rx="380" ry="28" fill="#FFC7A8" opacity=".16"/><ellipse cx="900" cy="530" rx="260" ry="18" fill="#FFB7C5" opacity=".14"/>`);
el('path', { d: cordillera(800, [[90, 2, 1.1], [30, 6, .5]], 1920), fill: '#4A2358' }, gF);
el('rect', { x: 0, y: 830, width: 1920, height: 250, fill: '#2A1630' }, gF);
el('path', { d: 'M0,860 L1920,860 L1920,960 L0,960 Z', fill: '#2E2832' }, gF);
svgIn(gF, `<path d="M1830,860 L1830,640 M1830,700 L1780,660 M1830,690 L1880,650" stroke="#1E0F24" stroke-width="22" stroke-linecap="round"/><circle cx="1800" cy="610" r="90" fill="#1E0F24"/><circle cx="1880" cy="650" r="80" fill="#1E0F24"/><circle cx="1760" cy="660" r="70" fill="#1E0F24"/>`);
const casaF = casa(gF, 1430, 440, true);
casaF.g.querySelector('.ninoV').style.display = 'none';
casaF.g.querySelector('.puertaLuz').setAttribute('opacity', '.95');
const mamaF = svgIn(casaF.g, '<g transform="translate(175,440) scale(.72)"><use href="#adulto" fill="#3A2240"/><path d="M-26,-272 Q-40,-230 -30,-200 L-20,-230 Z M26,-272 Q40,-230 30,-200 L20,-230 Z" fill="#3A2240"/></g>');
const trocaF = troca877(gF); setT(trocaF.g, -560, 900 - 340 * .9, .9);
el('polygon', { points: '472,819 940,760 940,900', fill: 'url(#gBeam)', opacity: .5 }, gF);
el('circle', { cx: 472, cy: 819, r: 46, fill: 'url(#gGlowW)' }, gF);
const halo = el('ellipse', { cx: 980, cy: 760, rx: 300, ry: 220, fill: 'url(#gGlowY)', opacity: 0 }, gF);
const papa = svgIn(gF, '<use href="#papaCuerpo"/>'); setT(papa, 900, 945, 1);
const nino = svgIn(gF, '<use href="#ninoCorre"/>'), nina = svgIn(gF, '<use href="#ninaCorre"/>');
const brazosP = svgIn(gF, `<g transform="translate(-64,-310)">${brazoPapa('I')}</g><g transform="translate(64,-310)">${brazoPapa('D')}</g>`); setT(brazosP, 900, 945, 1);
const corF = [...Array(7)].map(() => svgIn(gF, '<path d="M0,-10 c0,-14 20,-18 22,-4 c2,-14 22,-10 22,4 c0,14 -22,28 -22,28 c0,0 -22,-14 -22,-28 Z" fill="#FF2D55"/>'));
function pose(g, sel, ang) { g.querySelectorAll(sel).forEach(e => e.setAttribute('transform', `rotate(${ang.toFixed(1)})`)); }
// con la ilustración estilo Pixar (img/pixar.jpg, definida en pixar.js) la escena usa la imagen completa
const FOTO_F = typeof PIXAR !== 'undefined';
const gF2 = $('gF2');
const petalosF = [...Array(34)].map(() => [svgIn(gF2, `<ellipse rx="${(7 + rnd() * 6).toFixed(1)}" ry="${(4 + rnd() * 3).toFixed(1)}" fill="${rnd() > .5 ? '#FF9800' : '#FFB300'}"/>`), rnd() * 1920, rnd(), .5 + rnd(), rnd() * 6]);
const corF2 = [...Array(9)].map(() => svgIn(gF2, '<path d="M0,-10 c0,-14 20,-18 22,-4 c2,-14 22,-10 22,4 c0,14 -22,28 -22,28 c0,0 -22,-14 -22,-28 Z" fill="#FF2D55"/>'));
if (FOTO_F) {
  $('gF').style.display = 'none'; $('imgF').style.display = 'block'; $('veloF').style.display = 'block';
  // en la ilustración las caras quedan al centro: frase arriba (cielo) y remate abajo
  Object.assign($('hFa').style, { top: '34px', fontSize: '84px' }); Object.assign($('hFb').style, { top: '124px', fontSize: '98px' });
  Object.assign($('hFc').style, { top: '922px', fontSize: '46px' }); Object.assign($('hFd').style, { top: '996px', fontSize: '24px' });
} else $('gF2').style.display = 'none';
function RFfoto(t) {
  const t0 = L0('final'), u = pr(t, t0 - .6, TL.total - t0 + .6);
  setImg($('imgF'), PIXAR);
  $('imgF').style.transform = `scale(${lerp(1.0, 1.06, eIO(u)).toFixed(4)}) translate(${lerp(0, -1.2, eIO(u)).toFixed(3)}%,${lerp(0, 1.4, eIO(u)).toFixed(3)}%)`;
  petalosF.forEach(([p, x, f, v, ph]) => {
    const y = ((t - t0) * 60 * v + f * 1180) % 1180 - 60;
    setT(p, x + Math.sin(t * .9 + ph) * 50, y, 1, (t * 70 * v + ph * 60) % 360);
    op(p, .75);
  });
  corF2.forEach((c, i) => { const k = pr(t, t0 + 2.6 + i * .6, 3.0); op(c, k > 0 && k < 1 ? Math.sin(k * Math.PI) * .85 : 0); setT(c, (i % 2 ? 1235 : 655) + Math.sin(i * 2.3 + t * 1.3) * 34, 610 - k * 300, .6 + (i % 3) * .15); });
  rv($('hFa'), t, tw('final', 'el viaje más importante'), { d: 1.0, dy: 30 });
  rv($('hFb'), t, tw('final', 'es el regreso'), { d: 1.0, dy: 30 });
  rv($('hFc'), t, tw('final', 'donde pueden'), { d: 1.0, dy: 20 });
  rv($('hFd'), t, LN.final.fin + 1.0, { d: 1.0, dy: 10 });
  op($('negro'), pr(t, TL.total - 1.4, 1.4));
}
function RF(t) {
  if (FOTO_F) return RFfoto(t);
  const t0 = L0('final'); estF(t); parpadeo(t); parpadea(trocaF, t);
  const tLlega = t0 + 3.6, kAb = pr(t, tLlega - .2, .8);
  [['nino', nino, 1640, 975, 0], ['nina', nina, 1720, 1045, .35]].forEach(([n, g, x0, x1, dl]) => {
    const k = pr(t, t0 + .6 + dl, tLlega - (t0 + .6 + dl)), corre = k > 0 && k < 1;
    const x = lerp(x0, x1, eIO(k)), fase = (t - t0) * 11 + dl * 3;
    const yb = corre ? -Math.abs(Math.sin(fase)) * 14 : 0;
    setT(g, x, 945 - 92 + yb, n === 'nino' ? 1.15 : 1.1);
    const s = corre ? Math.sin(fase) : 0;
    g.querySelectorAll('.pA').forEach(e => e.setAttribute('transform', `translate(-6,0) rotate(${(32 * s).toFixed(1)})`));
    g.querySelectorAll('.pB').forEach(e => e.setAttribute('transform', `translate(6,0) rotate(${(-32 * s).toFixed(1)})`));
    const brazo = lerp(corre ? 40 + 35 * s : 70, 100, kAb);
    g.querySelectorAll('.bA').forEach(e => e.setAttribute('transform', `translate(-2,-82) rotate(${brazo.toFixed(1)})`));
    g.querySelectorAll('.bB').forEach(e => e.setAttribute('transform', `translate(2,-82) rotate(${(lerp(corre ? 40 - 35 * s : 70, 85, kAb)).toFixed(1)})`));
  });
  const ab = eOut(kAb);
  pose(brazosP, '.brazoI', lerp(118 + 4 * Math.sin(t * 3), -40, ab));
  pose(brazosP, '.brazoD', lerp(-118 - 4 * Math.sin(t * 3), -18, ab));
  halo.setAttribute('opacity', (.55 * ab * (.85 + .15 * Math.sin(t * 2))).toFixed(3));
  corF.forEach((c, i) => { const k = pr(t, tLlega + .3 + i * .45, 2.6); op(c, k > 0 && k < 1 ? Math.sin(k * Math.PI) : 0); setT(c, 980 + Math.sin(i * 2.3 + t) * 70, 560 - k * 260, .9 + (i % 3) * .25); });
  rv($('hFa'), t, tw('final', 'el viaje más importante'), { d: 1.0, dy: 30 });
  rv($('hFb'), t, tw('final', 'es el regreso'), { d: 1.0, dy: 30 });
  rv($('hFc'), t, tw('final', 'donde pueden'), { d: 1.0, dy: 20 });
  rv($('hFd'), t, LN.final.fin + 1.0, { d: 1.0, dy: 10 });
  op($('negro'), pr(t, TL.total - 1.4, 1.4));
}

// ---------- subtítulos ----------
const SUBS = [];
TL.lineas.forEach(l => l.frases.forEach(f => {
  const partes = (f.texto.match(/[^,;]+[,;]?/g) || [f.texto]).map(s => s.trim()).filter(Boolean);
  const trozos = []; let cur = '';
  partes.forEach(p => { if (cur && (cur + ' ' + p).length > 52) { trozos.push(cur); cur = p; } else cur = cur ? cur + ' ' + p : p; });
  if (cur) trozos.push(cur);
  let acc = 0; const L = f.texto.length;
  trozos.forEach((c, k) => {
    const a = f.inicio + (f.fin - f.inicio) * (acc / L); acc += c.length + 1;
    const b = k < trozos.length - 1 ? f.inicio + (f.fin - f.inicio) * Math.min(1, acc / L) : f.fin + .45;
    SUBS.push({ a: a - .05, b, txt: c.replace('diez veintiocho', '10-28').replace('ocho setenta y siete', '877'), voz: l.voz, esc: l.escena });
  });
}));
let subActual = null;
function subtitulos(t) {
  const s = SUBS.find(x => t >= x.a && t < x.b && x.esc !== 'final') || null, e = $('subt');
  if (s !== subActual) { subActual = s; if (s) { e.textContent = (s.voz === 'radio' ? '📻 ' : s.voz === 'troca' ? '🚛 ' : '') + s.txt; e.className = s.voz === 'narradora' ? '' : s.voz; } }
  if (!s) { e.style.visibility = 'hidden'; return; }
  const k = Math.min(pr(t, s.a, .18), 1 - pr(t, s.b - .15, .15));
  e.style.visibility = 'visible'; e.style.opacity = k; e.style.transform = `translateY(${(1 - k) * 12}px)`;
}

// ---------- control de escenas ----------
const ESC = ['bienvenida', 'carretera', 'radio', 'espera', 'camino', 'equipo', 'descanso', 'alertas', 'cabina', 'rescate', 'mensaje', 'mini', 'razon', 'cierre', 'despedida', 'cambio', 'final'];
const IDS = ['sB', 'sR', 's0', 's1', 's2', 's3', 'sP', 's4', 's5', 'sQ', 's6', 's7', 's8', 's10', 'sD', 's11', 'sF'];
const R = [RB, RR, R0, R1, R2, R3, RP, R4, R5, RQ, R6, R7, R8, R10, RD, R11, RF];
const LIM = ESC.map((e, i) => i === 0 ? 0 : e === 'carretera' ? LN.bienvenida.fin + .55 : LN[e].inicio - .4); LIM.push(TL.total + 1);
const L0 = n => LIM[ESC.indexOf(n)];
const SC = IDS.map(id => $(id));
window.render = function (t) {
  SC.forEach((s, i) => {
    const a = LIM[i], b = LIM[i + 1];
    const ent = i === 0 ? 1 : pr(t, a - .25, .5), sal = i === SC.length - 1 ? 0 : pr(t, b - .25, .5);
    const o = Math.min(ent, 1 - sal);
    if (o <= 0) { s.style.display = 'none'; return; }
    s.style.display = 'block'; s.style.opacity = o;
    s.style.transform = `scale(${(i === 0 ? 1 : lerp(1.05, 1, eOut(ent))) * lerp(1, .97, sal)})`;
    R[i](t);
  });
  const rot = (t * 520) % 360;
  document.querySelectorAll('#trailer .rim').forEach(e => e.setAttribute('transform', `rotate(${rot})`));
  subtitulos(t);
};
window.renderAsync = async function (t) { window.render(t); const p = PEND.splice(0); await Promise.all(p); };
window.TOTAL = TL.total;
window.render(0);
