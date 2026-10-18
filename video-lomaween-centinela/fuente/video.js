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
  g.troca = svgIn(svg, '<use href="#trailer"/>');
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
  setT(g.troca, x0, y0 + bote, s);
  const fx = x0 + 629 * s, fy = y0 + 158 * s + bote;
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
  est0(t); moverCarretera(ca0, t, 560, 548, 1.25);
  const enc = pr(t, .2, .6); css($('radio0'), enc, 0, (1 - eOut(enc)) * -40, lerp(.92, 1, eOut(enc)));
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
  const t0 = LIM[1], u = pr(t, t0, LIM[2] - t0);
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
  est2(t); moverCarretera(ca2, t, 700, 560, 1.12, .9);
  const t0 = LIM[2];
  rv($('h2a'), t, t0 + .4, { d: .8 });
  rv($('h2b'), t, tw('camino', 'kilómetro a kilómetro'), { tipo: 'back', s0: .5, dy: 0 });
}

// ---------- ESCENA 3: somos los Centinelas ----------
const g3 = $('g3');
el('rect', { width: 1920, height: 1080, fill: 'url(#gCuarto)' }, g3);
el('rect', { x: 0, y: 790, width: 1920, height: 290, fill: '#0F0A16' }, g3);
const pantallas3 = [];
for (let f = 0; f < 2; f++) for (let c = 0; c < 3; c++) {
  const x = 250 + c * 460, y = 170 + f * 260;
  const g = el('g', { transform: `translate(${x},${y})` }, g3);
  g.innerHTML = `<rect x="-10" y="-10" width="440" height="250" rx="12" fill="#15181F"/><rect width="420" height="230" rx="6" fill="url(#gPantalla)"/>
    <g stroke="#1E2C45" stroke-width="4" fill="none"><path d="M10,180 C80,150 120,190 200,140 S330,90 410,110"/><path d="M40,20 C90,90 60,140 140,220"/><path d="M260,10 C240,80 300,140 280,225"/></g>
    <path d="M20,200 C90,170 150,160 210,120 S330,60 400,40" stroke="#FF5A00" stroke-width="5" fill="none" opacity=".9"/>
    <rect x="12" y="12" width="150" height="24" rx="12" fill="#0F1C33"/><text x="24" y="30" font-family="M" font-weight="800" font-size="14" fill="#AFC0DA">${['RUTA 57', 'CÁMARAS', 'ALERTAS', 'GPS · EN VIVO', 'TELEMETRÍA', 'RESCATES'][f * 3 + c]}</text>`;
  const p = el('circle', { r: 9, fill: '#2ED573', stroke: '#06331C', 'stroke-width': 2 }, g);
  pantallas3.push({ p, k: f * 3 + c });
}
el('ellipse', { cx: 960, cy: 400, rx: 900, ry: 300, fill: 'url(#gGlowO)', opacity: .12 }, g3);
const pic3 = picado(g3, 8, 40, 1880, .85, 2);
flores(g3, [...Array(18)].map((_, i) => [120 + Math.sin(i) * 6, 150 + i * 36, .9]).concat([...Array(18)].map((_, i) => [1800 + Math.sin(i) * 6, 150 + i * 36, .9])));
svgIn(g3, `<g transform="translate(1712,330)"><rect x="-82" y="-120" width="164" height="200" rx="10" fill="#fff" opacity=".07"/><g transform="translate(0,-40) scale(.28)"><use href="#logoC"/></g>
  <text x="0" y="40" text-anchor="middle" font-family="M" font-weight="800" font-size="14" fill="#C9CED8">ÁREA DE BLINDAJE</text><text x="0" y="66" text-anchor="middle" font-family="Anton" font-size="26" fill="#fff">CENTINELA</text></g>`);
el('rect', { x: 0, y: 880, width: 1920, height: 30, fill: '#1B1424' }, g3);
const personas3 = [480, 960, 1440].map((x, i) => {
  const g = el('g', { transform: `translate(${x},0)` }, g3);
  g.innerHTML = `<ellipse cx="0" cy="720" rx="230" ry="190" fill="url(#gGlowAz)" opacity=".55"/><rect x="-110" y="760" width="220" height="230" rx="30" fill="#07050C" stroke="#3A3050" stroke-width="3"/>
    <g fill="#140F1E" stroke="#6A5A8E" stroke-width="3"><circle cx="0" cy="700" r="56"/><path d="M-120,900 Q-112,786 0,770 Q112,786 120,900 Z"/></g>
    <path d="M-60,690 Q0,610 60,690" stroke="#2A2A33" stroke-width="12" fill="none"/><ellipse cx="-60" cy="700" rx="14" ry="24" fill="#2A2A33"/><ellipse cx="60" cy="700" rx="14" ry="24" fill="#2A2A33"/>
    <path d="M60,716 Q74,746 40,756" stroke="#2A2A33" stroke-width="6" fill="none"/>
    <path d="M-56,660 Q0,630 56,660" stroke="#FF8A3D" stroke-width="3" fill="none" opacity=".5"/>`;
  return g;
});
flores(g3, [[260, 880, 1.4], [710, 880, 1.2], [1210, 880, 1.2], [1660, 880, 1.4]]);
const velas3 = velas(g3, [[330, 884, .8], [1600, 884, .8], [1150, 884, .7]]);
function R3(t) {
  const t0 = LIM[3]; pic3(t); parpadeo(t);
  pantallas3.forEach(o => { const u = ((t * .08 + o.k * .17) % 1); o.p.setAttribute('cx', 20 + 380 * u); o.p.setAttribute('cy', 200 - 160 * u + Math.sin(u * 9) * 10); });
  personas3.forEach((g, i) => g.setAttribute('transform', `translate(${[480, 960, 1440][i]},${(Math.sin(t * 1.3 + i) * 2).toFixed(2)})`));
  const tR = tw('equipo', 'Centinelas de Ruta'), tS = tw('equipo', 'Centinelas de Seguridad'), tC = tw('equipo', 'Rescates'), tA = tw('equipo', 'siempre atentos');
  rv($('h3a'), t, t0 + .5, { tipo: 'back', s0: .6, dy: 0, fin: tR - .3 });
  rv($('l3a'), t, tR, { tipo: 'back', s0: .4, dy: 30 });
  rv($('l3b'), t, tS, { tipo: 'back', s0: .4, dy: 30 });
  rv($('l3c'), t, tC, { tipo: 'back', s0: .4, dy: 30 });
  rv($('h3b'), t, tA, { tipo: 'back', s0: .6, dy: 0 });
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
const tit4 = svgIn(g4, `<text x="960" y="250" text-anchor="middle" font-family="Anton" font-size="96" fill="#fff">LAS PANTALLAS NOS AVISAN</text>`);
(function () {
  $('a4a').querySelector('.ico').innerHTML = `<path d="${arco(260, 175, 90, 180, 360)}" stroke="#2A3146" stroke-width="22" fill="none"/><path d="${arco(260, 175, 90, 300, 360)}" stroke="#E5392F" stroke-width="22" fill="none"/><g class="aguja"><path d="M260,175 L330,135" stroke="#fff" stroke-width="8" stroke-linecap="round"/></g><circle cx="260" cy="175" r="14" fill="#fff"/>`;
  $('a4b').querySelector('.ico').innerHTML = `<circle cx="260" cy="150" r="78" fill="#FFC94D"/><path d="M220,140 q14,12 28,0 M272,140 q14,12 28,0" stroke="#3B2A00" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="260" cy="190" rx="18" ry="10" fill="#3B2A00"/><g class="zz" font-family="M" font-weight="900" fill="#AFC0DA"><text x="350" y="100" font-size="40">z</text><text x="380" y="70" font-size="30">z</text></g>`;
  $('a4c').querySelector('.ico').innerHTML = `<g class="tel"><rect x="214" y="70" width="92" height="160" rx="16" fill="#1D2232" stroke="#AFC0DA" stroke-width="6"/><rect x="226" y="90" width="68" height="110" rx="6" fill="#4C7BD9"/><circle cx="260" cy="214" r="6" fill="#AFC0DA"/></g><path d="M190,110 q-14,40 0,80 M330,110 q14,40 0,80" stroke="#E5392F" stroke-width="6" fill="none" stroke-linecap="round"/>`;
})();
function R4(t) {
  const t0 = LIM[4];
  const P = ruta4.getPointAtLength(LARGO4 * ((t * .05) % 1)); setT(punto4, P.x, P.y);
  document.querySelectorAll('#g4 .vivo').forEach(e => op(e, .4 + .6 * (Math.sin(t * 6) > 0)));
  op(tit4, pr(t, t0 + .3, .5));
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

// ---------- ESCENA 5: la llamada ----------
const g5 = $('g5');
el('rect', { width: 960, height: 1080, fill: 'url(#gCuarto)' }, g5);
el('ellipse', { cx: 480, cy: 1000, rx: 520, ry: 320, fill: 'url(#gGlowO)', opacity: .35 }, g5);
const pic5 = picado(g5, 6, 20, 940, .7, 0);
const cent5 = svgIn(g5, `<ellipse cx="480" cy="700" rx="330" ry="300" fill="url(#gGlowAz)" opacity=".6"/><g fill="#161020" stroke="#7A68A8" stroke-width="4"><circle cx="480" cy="640" r="92"/><path d="M270,1080 Q280,780 480,760 Q680,780 690,1080 Z"/></g>
  <path d="M380,620 Q480,500 580,620" stroke="#2A2A33" stroke-width="18" fill="none"/><ellipse cx="384" cy="640" rx="22" ry="38" fill="#2A2A33"/><ellipse cx="576" cy="640" rx="22" ry="38" fill="#2A2A33"/>
  <path d="M384,672 Q400,730 460,724" stroke="#2A2A33" stroke-width="9" fill="none"/><circle cx="462" cy="724" r="9" fill="#FF5A00"/>
  <path d="M396,580 Q480,540 564,580" stroke="#FF8A3D" stroke-width="4" fill="none" opacity=".6"/>`);
flores(g5, [[120, 1010, 1.6], [840, 1010, 1.6]]);
el('rect', { x: 960, y: 0, width: 960, height: 1080, fill: '#070814' }, g5);
const via5 = el('g', {}, g5);
via5.innerHTML = `<polygon points="1400,430 1460,430 1920,820 1920,900 960,900 960,820" fill="#16151C"/>`;
const rayas5 = [...Array(7)].map(() => el('polygon', { fill: '#FFC400' }, via5));
svgIn(g5, `<path d="M960,0 H1920 V430 H960 Z" fill="#120B30"/><circle cx="1720" cy="160" r="40" fill="url(#gLuna)"/>
  <path d="M960,420 Q1440,380 1920,420 V1080 H960 Z" fill="#0B0A10" opacity="0"/>
  <rect x="960" y="0" width="960" height="70" fill="#0B0A10"/><rect x="960" y="830" width="960" height="250" fill="#0B0A10"/>
  <rect x="960" y="0" width="60" height="1080" fill="#0B0A10"/><rect x="1860" y="0" width="60" height="1080" fill="#0B0A10"/>
  <ellipse cx="1440" cy="900" rx="420" ry="260" fill="url(#gGlowAz)" opacity=".45"/><g fill="#18142A" stroke="#7A68A8" stroke-width="4"><circle cx="1440" cy="600" r="88"/><path d="M1350,560 Q1440,470 1530,560 L1560,572 L1350,572 Z" fill="#241E36"/><path d="M1240,1080 Q1250,760 1440,740 Q1630,760 1640,1080 Z"/></g>
  <rect x="1380" y="566" width="120" height="10" fill="#FF5A00" opacity=".8"/>
  <ellipse cx="1440" cy="980" rx="260" ry="120" fill="none" stroke="#2A2733" stroke-width="34"/>
  <rect x="1060" y="900" width="160" height="40" rx="8" fill="#0F1A2A"/><rect x="1072" y="910" width="60" height="20" rx="4" fill="#2ED573" opacity=".7"/>`);
const enlace5 = el('path', { d: 'M700,560 Q960,470 1220,560', stroke: '#FF5A00', 'stroke-width': 8, fill: 'none', 'stroke-dasharray': '22 18', 'stroke-linecap': 'round' }, g5);
const tel5 = svgIn(g5, `<circle r="56" fill="#FF5A00"/><circle r="56" fill="none" stroke="#fff" stroke-width="4" opacity=".6"/><path d="M-22,-24 q-6,6 0,20 q12,24 36,36 q14,6 20,0 l-10,-12 q-6,-4 -12,0 q-12,-6 -22,-22 q4,-6 0,-12 Z" fill="#fff"/>`);
const velo5 = el('rect', { width: 1920, height: 1080, fill: '#05040A', opacity: 0 }, g5);
const luna5 = svgIn(g5, `<g transform="translate(960,330)"><circle r="80" fill="url(#gGlowW)" opacity=".6"/><path d="M20,-40 A44,44 0 1 0 20,40 A34,34 0 1 1 20,-40 Z" fill="#FFE9A8"/></g>`);
function R5(t) {
  const t0 = LIM[5]; pic5(t);
  rayas5.forEach((r, i) => {
    const s = ((i / 7) + t * .35) % 1, s2 = Math.min(1, s + .06);
    const y1 = 430 + 470 * s * s, y2 = 430 + 470 * s2 * s2, w1 = 2 + 30 * s * s, w2 = 2 + 30 * s2 * s2;
    r.setAttribute('points', `${1430 - w1},${y1} ${1430 + w1},${y1} ${1430 + w2},${y2} ${1430 - w2},${y2}`);
  });
  const tLl = tw('cabina', 'llamamos'), tC = tw('cabina', '¿cómo vas'), tA = tw('cabina', 'A veces'), tD = tw('cabina', 'descansar'), tE = tw('cabina', 'Y eso también');
  const kc = pr(t, tLl + .3, .5);
  op(enlace5, kc); enlace5.setAttribute('stroke-dashoffset', (-t * 90).toFixed(1));
  rvS(tel5, t, tLl + .3, 960, 500, { s: 1 + .06 * Math.sin(t * 10), fin: tE - .3 });
  rv($('b5a'), t, tC, { tipo: 'back', s0: .5, dy: 30, fin: tE - .3 });
  rv($('b5b'), t, tA, { tipo: 'back', s0: .5, dy: 30, fin: tE - .3 });
  rv($('b5c'), t, tD - .1, { tipo: 'back', s0: .5, dy: 30, fin: tE - .3 });
  const kv = pr(t, tE - .3, .6); velo5.setAttribute('opacity', (.72 * kv).toFixed(3));
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
  const t0 = LIM[6], t3 = tw('mensaje', 'tres cosas');
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
  const t0 = LIM[7]; est7(t); pic7(t);
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
  const t0 = LIM[8];
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
  const t0 = LIM[10]; pic10(t); parpadeo(t);
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
  const t0 = LIM[11];
  const enc = pr(t, t0 + .1, .6); css($('radio11'), enc, 0, (1 - eOut(enc)) * -40, lerp(.92, 1, eOut(enc)));
  radioPanel($('radio11'), t, t > LN.cambio.inicio - .1 && t < LN.cambio.fin + .1);
  rv($('h11a'), t, tw('cambio', 'gracias'), { dy: 30 });
  rv($('h11b'), t, tw('cambio', 'Cambio y fuera'), { tipo: 'elas', s0: .3, dy: 0, d: .9 });
  rv($('h11c'), t, LN.cambio.fin + .4, { dy: 20 });
  rvS(logo11, t, LN.cambio.fin + .6, 960, 960, { s: .32 });
  op($('negro'), pr(t, TL.total - .8, .8));
}

// ---------- subtítulos ----------
const SUBS = [];
TL.lineas.forEach(l => l.frases.forEach(f => {
  const partes = (f.texto.match(/[^,;]+[,;]?/g) || [f.texto]).map(s => s.trim()).filter(Boolean);
  const trozos = []; let cur = '';
  partes.forEach(p => { if (cur && (cur + ' ' + p).length > 58) { trozos.push(cur); cur = p; } else cur = cur ? cur + ' ' + p : p; });
  if (cur) trozos.push(cur);
  let acc = 0; const L = f.texto.length;
  trozos.forEach((c, k) => {
    const a = f.inicio + (f.fin - f.inicio) * (acc / L); acc += c.length + 1;
    const b = k < trozos.length - 1 ? f.inicio + (f.fin - f.inicio) * Math.min(1, acc / L) : f.fin + .45;
    SUBS.push({ a: a - .05, b, txt: c.replace('diez veintiocho', '10-28'), radio: l.escena === 'radio' || l.escena === 'cambio' });
  });
}));
let subActual = null;
function subtitulos(t) {
  const s = SUBS.find(x => t >= x.a && t < x.b) || null, e = $('subt');
  if (s !== subActual) { subActual = s; if (s) { e.textContent = (s.radio ? '📻 ' : '') + s.txt; e.className = s.radio ? 'radio' : ''; } }
  if (!s) { e.style.visibility = 'hidden'; return; }
  const k = Math.min(pr(t, s.a, .18), 1 - pr(t, s.b - .15, .15));
  e.style.visibility = 'visible'; e.style.opacity = k; e.style.transform = `translateY(${(1 - k) * 12}px)`;
}

// ---------- control de escenas ----------
const ESC = ['radio', 'espera', 'camino', 'equipo', 'alertas', 'cabina', 'mensaje', 'mini', 'razon', 'regreso', 'cierre', 'cambio'];
const LIM = ESC.map((e, i) => i === 0 ? 0 : e === 'regreso' ? LN.razon.fin + .3 : LN[e].inicio - .4); LIM.push(TL.total + 1);
const R = [R0, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11];
const SC = ESC.map((_, i) => $('s' + i));
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
window.TOTAL = TL.total;
window.render(0);
