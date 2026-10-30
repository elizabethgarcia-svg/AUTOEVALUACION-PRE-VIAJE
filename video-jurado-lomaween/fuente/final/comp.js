// Composición del video final del jurado: cada toma (cuadros ya extraídos), sus movimientos de cámara, los difuminados de pantallas,
// las transiciones y todo lo que va encima (nombres, cartas, subtítulos, títulos). Se graba cuadro por cuadro con render_comp.js.
const $ = id => document.getElementById(id);
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const pr = (t, a, b) => cl((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = k => 1 - Math.pow(1 - cl(k), 3), ei = k => Math.pow(cl(k), 3);
const eio = k => { k = cl(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const back = k => { k = cl(k); const c = 1.6; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
const rnd = (i, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; return on; };
const fadeIO = (t, a, b, fi = .3, fo = .3) => Math.min(eo(pr(t, a, a + fi)), 1 - pr(t, b - fo, b));
const CARTA = Object.fromEntries(CARTAS.map(c => [c.n, c]));
let kk = 0;
const carta = n => cartaSVG(CARTA[n]).replace(/papel(\d+)/g, (m, d) => `papel${d}_${++kk}`);
const ESC = 1920 / 1024;  // de coordenadas del clip original a la pantalla
const TOMAS = TL.tomas, CAPAS = TL.capas;
const N = id => { const m = TOMAS.find(x => x.id === id); return m; };
const nCuadros = tm => Math.max(1, tm.nf || Math.round(tm.dur * 30));
const src = (tm, k) => `frames/${tm.id}/f_${String(k).padStart(5, '0')}.jpg`;
const generada = tm => tm.src === 'vhs' || tm.src === 'fin';
const real = tm => !tm.src.startsWith('anim_') && tm.src !== '877' && !generada(tm);

function tomaEn(t) { let i = 0; while (i < TOMAS.length - 1 && t >= TOMAS[i + 1].t0) i++; return i; }
function cuadroDe(tm, t) {
  if (tm.src.startsWith('foto:')) return src(tm, 1);
  return src(tm, cl(Math.floor((t - tm.t0) * 30 + 1e-6) + 1, 1, nCuadros(tm)));
}

// ---------- difuminado de pantallas: cajas por grupo con cuadros clave en tiempo del clip ----------
function cajas(tm, t) {
  const tc = tm.ini + (t - tm.t0) * tm.vel, grupos = {};
  for (const k of tm.blur) (grupos[k[5]] = grupos[k[5]] || []).push(k);
  const out = [];
  for (const g of Object.values(grupos)) {
    g.sort((a, b) => a[0] - b[0]);
    if (tc > g[g.length - 1][0] + .25 && g.length > 1 && g[g.length - 1][0] < tm.fin - .3) continue;  // el grupo ya salió de cuadro
    let a = g[0], b = g[0];
    for (let i = 0; i < g.length; i++) { if (g[i][0] <= tc) a = g[i]; if (g[i][0] >= tc) { b = g[i]; break; } b = g[i]; }
    const k = b[0] > a[0] ? cl((tc - a[0]) / (b[0] - a[0])) : 0;
    out.push([1, 2, 3, 4].map(j => lerp(a[j], b[j], k)));
  }
  return out;
}
function pintarCajas(lista) {
  const c = $('borrs');
  while (c.children.length < lista.length) { const d = document.createElement('div'); d.className = 'borr'; c.appendChild(d); }
  [...c.children].forEach((d, i) => {
    const b = lista[i]; d.style.display = b ? 'block' : 'none'; if (!b) return;
    const m = 14;  // margen para que no se asome nada
    d.style.left = (b[0] * ESC - m) + 'px'; d.style.top = (b[1] * ESC - m) + 'px'; d.style.width = (b[2] * ESC + 2 * m) + 'px'; d.style.height = (b[3] * ESC + 2 * m) + 'px';
  });
}

// ---------- capas ----------
const activas = (tipo, t) => CAPAS.filter(c => c.tipo === tipo && t >= c.t0 && t < c.t1);
let terClave = '';
function capaTercio(t) {
  const c = activas('tercio', t)[0], el = $('ter');
  if (!vis(el, !!c)) return;
  const clave = c.alias + c.t0;
  if (clave !== terClave) { terClave = clave; $('terCartas').innerHTML = c.cartas.map(n => `<div class="c">${carta(n)}</div>`).join(''); $('terAlias').textContent = c.alias; $('terRol').textContent = c.rol; $('terNum').textContent = c.num || 'CENTINELA'; $('terNum').style.display = c.num ? 'inline-block' : 'none'; }
  const k = eo(pr(t, c.t0, c.t0 + .45)), out = pr(t, c.t1 - .3, c.t1);
  el.style.opacity = 1 - out; el.style.transform = `translateX(${(1 - k) * -90}px)`;
  [...$('terCartas').children].forEach((d, i) => { const kc = back(pr(t, c.t0 + .1 + i * .18, c.t0 + .55 + i * .18)); d.style.transform = `translateY(${(1 - kc) * 60}px) rotate(${(1 - kc) * -14 + (i ? 6 : -4)}deg) scale(${.6 + .4 * kc})`; d.style.opacity = cl(kc * 2); });
  $('terBar').style.width = eo(pr(t, c.t0 + .2, c.t0 + .9)) * 420 + 'px';
}
function capaSub(t) {
  const c = activas('sub', t)[0], el = $('sub');
  if (!vis(el, !!c)) return;
  el.firstElementChild.textContent = c.txt;
  el.style.opacity = Math.min(pr(t, c.t0, c.t0 + .12), 1 - pr(t, c.t1 - .1, c.t1));
}
function capaSeccion(t) {
  const c = activas('seccion', t)[0], el = $('sec');
  if (!vis(el, !!c)) return;
  $('secK').textContent = c.chip; $('secT').textContent = c.titulo; $('secS').textContent = c.sub;
  el.style.opacity = fadeIO(t, c.t0, c.t1, .35, .4);
  $('secT').style.transform = `scale(${lerp(1.25, 1, eo(pr(t, c.t0, c.t0 + .55)))})`; $('secT').style.letterSpacing = lerp(14, 1.5, eo(pr(t, c.t0, c.t0 + .8))) + 'px';
  $('secS').style.opacity = eo(pr(t, c.t0 + .6, c.t0 + 1.0));
}
function capaValor(t) {
  const c = activas('valor', t)[0], el = $('val');
  if (!vis(el, !!c)) return;
  $('valK').textContent = c.k; $('valV').textContent = c.v;
  el.style.opacity = fadeIO(t, c.t0, c.t1, .3, .4);
  $('valV').style.transform = `translateX(${(1 - eo(pr(t, c.t0, c.t0 + .5))) * -80}px)`; $('valLinea').style.width = eo(pr(t, c.t0 + .3, c.t0 + 1.1)) * 760 + 'px';
}
function capaPieza(t) {
  const c = activas('pieza', t)[0], el = $('pie');
  if (!vis(el, !!c)) return;
  $('pieK').textContent = `RECORRIDO · PIEZA ${c.n} DE 7`; $('pieN').textContent = c.nombre;
  // si la pieza sigue de la toma anterior no vuelve a entrar
  const prev = CAPAS.find(x => x.tipo === 'pieza' && x.n === c.n && x !== c && Math.abs(x.t1 + .2 - c.t0) < .5 || (x.tipo === 'pieza' && x.n === c.n && x !== c && x.t1 > c.t0 - .6 && x.t0 < c.t0));
  const a = prev ? c.t0 - 2 : c.t0;
  el.style.opacity = fadeIO(t, a, c.t1, .3, .35);
  $('pieN').style.transform = `translateX(${(1 - eo(pr(t, a, a + .45))) * -70}px)`; $('pieLinea').style.width = eo(pr(t, a + .2, a + .9)) * 520 + 'px';
}
function capaSimple(tipo, el, t, fn) { const c = activas(tipo, t)[0]; if (vis(el, !!c)) fn(c, el); }
function capas(t) {
  capaTercio(t); capaSub(t); capaSeccion(t); capaValor(t); capaPieza(t);
  capaSimple('lema', $('lema'), t, (c, el) => { el.firstElementChild.textContent = c.txt; el.style.opacity = fadeIO(t, c.t0, c.t1, .3, .35); el.style.transform = `scale(${lerp(1.12, 1, eo(pr(t, c.t0, c.t0 + .6)))})`; });
  capaSimple('chip', $('chp'), t, (c, el) => { el.firstElementChild.textContent = c.txt; el.style.opacity = fadeIO(t, c.t0, c.t1, .2, .25); el.style.transform = `translateY(${(1 - eo(pr(t, c.t0, c.t0 + .35))) * -40}px)`; });
  capaSimple('sello', $('sel'), t, (c, el) => { const k = pr(t, c.t0, c.t0 + .22); el.style.opacity = Math.min(cl(k * 3), 1 - pr(t, c.t1 - .2, c.t1)); el.style.transform = `rotate(-12deg) scale(${lerp(2.6, 1, eo(k))})`; el.style.marginLeft = (t - c.t0 > .2 && t - c.t0 < .45 ? (rnd(Math.floor(t * 60)) - .5) * 18 : 0) + 'px'; });
  capaSimple('cita', $('cit'), t, (c, el) => { el.firstElementChild.textContent = c.txt; el.style.opacity = fadeIO(t, c.t0, c.t1, .4, .3); });
  capaSimple('tele', $('tel'), t, (c, el) => { el.style.opacity = fadeIO(t, c.t0, c.t1, .35, .2); $('telT').style.transform = `translateX(${(1 - eo(pr(t, c.t0, c.t0 + .5))) * -70}px)`; $('telS').style.opacity = eo(pr(t, c.t0 + .7, c.t0 + 1.2)); });
  capaSimple('grito', $('gri'), t, (c, el) => {
    if (!el.dataset.ok) { el.innerHTML = c.txt.split(' ').map((w, i) => `<span class="w${i >= 3 ? ' o' : ''}">${w}</span>`).join(' '); el.dataset.ok = 1; }
    const ws = [...el.children], dur = Math.min(3.4, c.t1 - c.t0 - .8);
    ws.forEach((w, i) => { const a = c.t0 + i * dur / ws.length, k = back(pr(t, a, a + .3)); w.style.opacity = cl(k * 2); w.style.transform = `translateY(${(1 - k) * 50}px) scale(${.7 + .3 * k})`; });
    el.style.opacity = 1 - pr(t, c.t1 - .35, c.t1);
  });
  capaPasion(t); capaVhs(t);
}
let pasOk = false;
function capaPasion(t) {
  const c = activas('pasion', t)[0], el = $('pas');
  if (!vis(el, !!c)) return;
  if (!pasOk) { $('pasCarta').innerHTML = carta(3); pasOk = true; }
  const u = t - c.t0, d = c.t1 - c.t0;
  el.style.opacity = Math.min(eo(pr(u, 0, .5)), 1 - pr(u, d - .5, d));
  $('pasOsc').style.opacity = .85;
  const kc = eio(pr(u, .3, 1.3));
  $('pasCarta').style.transform = `perspective(1400px) rotateY(${(1 - kc) * 180}deg) translateY(${(1 - kc) * 40}px) rotate(${-4 + 4 * kc}deg)`;
  $('pasCarta').style.opacity = cl(kc * 3);
  $('pasV').style.opacity = eo(pr(u, .9, 1.4)); $('pasV').style.transform = `translateX(${(1 - eo(pr(u, .9, 1.4))) * -60}px)`;
  $('pasK').style.opacity = eo(pr(u, .7, 1.1));
  $('pasVerso').style.opacity = eo(pr(u, 1.5, 2.1)) * (1 - .55 * pr(u, 3.4, 3.9));
  [...$('pasCita').children].forEach((l, i) => { const k = eo(pr(u, 3.6 + i * 1.15, 4.3 + i * 1.15)); l.style.opacity = k; l.style.transform = `translateY(${(1 - k) * 20}px)`; });
}
function capaVhs(t) {
  const c = activas('vhs', t)[0], el = $('vhs');
  if (!vis(el, !!c)) return;
  const s = Math.floor((t - c.t0) * 30), seg = 41 * 60 + 7 + Math.floor(t - c.t0);
  $('vhsTc').textContent = `OCT. 29 2026  23:${String(Math.floor(seg / 60) % 60).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;
  $('vhsRec').style.opacity = (s % 30) < 18 ? 1 : 0;
  const i = tomaEn(t), n = TOMAS.slice(0, i + 1).filter(x => x.sec === 'tomas' && x.src !== 'vhs' && x.trans === 'rebobina').length;
  $('vhsToma').textContent = `TOMA ${String(n + 1).padStart(2, '0')}`;
}

// ---------- la toma y las transiciones ----------
let imgActual = '', prevActual = '';
function render(t) {
  const i = tomaEn(t), tm = TOMAS[i], sig = TOMAS[i + 1], u = t - tm.t0;
  const im = $('img'); const s = generada(tm) ? '' : cuadroDe(tm, t);
  vis($('gVhs'), tm.src === 'vhs'); vis($('gFin'), tm.src === 'fin'); vis($('cuadro'), !generada(tm));
  if (s && s !== imgActual) { im.src = s; imgActual = s; }
  // movimiento de cámara
  const k = tm.dur > 0 ? u / tm.dur : 0;
  let z = lerp(tm.zoom[0], tm.zoom[1], eio(k)), tx = 0, blur = 0, br = 1;
  const lz = $('lienzo');
  // látigo: al final de la toma que se va y al principio de la que llega
  if (sig && sig.trans === 'latigo' && sig.t0 - t < .1) { const q = 1 - (sig.t0 - t) / .1; tx = -220 * ei(q); blur = 18 * q; }
  if (tm.trans === 'latigo' && u < .16) { const q = 1 - u / .16; tx = 260 * ei(q); blur = 18 * q; }
  lz.style.transformOrigin = `${tm.centro[0] * 100}% ${tm.centro[1] * 100}%`;
  lz.style.transform = `translateX(${tx}px) scale(${z})`;
  // rebobinado VHS: jaloneo y franjas
  const reb = tm.trans === 'rebobina' && u < .42;
  vis($('reb'), reb);
  if (reb) { const q = u / .42; lz.style.transform += ` translateY(${(rnd(Math.floor(t * 30), 3) - .5) * 40 * (1 - q)}px) skewX(${(rnd(Math.floor(t * 30), 4) - .5) * 12 * (1 - q)}deg)`; br = 1.25 - .25 * q;
    $('reb').style.background = `repeating-linear-gradient(0deg,rgba(255,255,255,${.14 * (1 - q)}) 0 ${3 + Math.floor(rnd(Math.floor(t * 30), 5) * 6)}px,rgba(0,0,0,0) 0 ${18 + Math.floor(rnd(Math.floor(t * 30), 6) * 40)}px)`; $('rebT').style.opacity = 1 - q; }
  lz.style.filter = (blur ? `blur(${blur}px) ` : '') + (br !== 1 ? `brightness(${br}) ` : '') + (tm.sec === 'tomas' ? 'saturate(1.25) contrast(1.06)' : '');
  pintarCajas(tm.blur && tm.blur.length ? cajas(tm, t) : []);
  // fundido encadenado: el último cuadro de la toma anterior se desvanece encima
  const pv = $('prev');
  if (tm.trans === 'fundido' && i > 0 && u < .55) { const ant = TOMAS[i - 1], ps = generada(ant) ? '' : src(ant, nCuadros(ant)); if (ps && ps !== prevActual) { pv.src = ps; prevActual = ps; } pv.style.opacity = ps ? 1 - eio(u / .55) : 0; $('negro').style.opacity = ps ? 0 : 1 - u / .55; }
  else { pv.style.opacity = 0; $('negro').style.opacity = 0; }
  // destello en los cortes con flash
  let fl = 0; if (tm.trans === 'flash' && u < .28) fl = .85 * (1 - u / .28); if (sig && sig.trans === 'flash' && sig.t0 - t < .06) fl = Math.max(fl, .5 * (1 - (sig.t0 - t) / .06));
  $('flash').style.opacity = fl;
  // fundido a negro al final del video
  if (t > TL.total - 1.2) $('negro').style.opacity = pr(t, TL.total - 1.2, TL.total);
  // grano y viñeta solo sobre lo grabado
  vis($('grano'), real(tm)); vis($('vina'), real(tm));
  $('grano').style.backgroundPosition = `${Math.floor(rnd(Math.floor(t * 30), 9) * 960)}px ${Math.floor(rnd(Math.floor(t * 30), 10) * 540)}px`;
  escenasGeneradas(tm, u, t);
  capas(t);
}
function escenasGeneradas(tm, u, t) {
  if (tm.src === 'vhs') {
    const g = $('gVhsT'); g.style.transform = `translateX(${(rnd(Math.floor(t * 30), 2) - .5) * 10}px)`;
    g.style.textShadow = '5px 0 0 rgba(255,0,60,.6),-5px 0 0 rgba(0,200,255,.6)';
    $('gVhs').style.background = u < .25 ? '#000' : '#1530C8';
  }
  if (tm.src === 'fin') {
    if (!$('finLogo').innerHTML) $('finLogo').innerHTML = logoSVG('lgFin');
    const k = eo(pr(u, .2, 1.2)); $('finLogo').setAttribute('transform', `translate(960,330) scale(${.78 * (.85 + .15 * k)})`); $('finLogo').style.opacity = k;
    $('finT').style.opacity = eo(pr(u, .7, 1.3)); $('finS').style.opacity = eo(pr(u, 1.1, 1.7)); $('finG').style.opacity = eo(pr(u, 1.5, 2.1));
  }
}
window.render = render;
window.renderAsync = async t => {
  render(t);
  await Promise.all([...document.images].filter(i => i.src && !i.complete).map(i => i.decode().catch(() => {})));
  await Promise.all([$('img'), $('prev')].filter(i => i.src).map(i => i.decode().catch(() => {})));
};
window.TOTAL = TL.total;
