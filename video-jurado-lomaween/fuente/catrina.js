// Catrina ilustrada (rostro de frente) con corona de rosas negras y naranjas y cempasúchil. SVG 1280x720.
function catrinaSVG() {
  const R = (i, k = 0) => { const x = Math.sin(i * 91.7 + k * 47.3) * 43758.5453; return x - Math.floor(x); };
  const PAL = {
    negra: ['#000000', '#0B0709', '#211719', '#5C4850'],
    naranja: ['#4A1000', '#A83200', '#F2620C', '#FFB060'],
  };
  let defs = '', gid = 0;
  const grad = (stops, cx = .5, cy = .5, r = .6) => { const id = 'cg' + (gid++); defs += `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`; return `url(#${id})`; };
  // rosa: anillos de pétalos en copa, de afuera hacia adentro, con degradado centrado en la flor
  function rosa(cx, cy, Rr, tipo, rot) {
    const p = PAL[tipo], id = 'pt_' + tipo;
    if (!defs.includes(`id="${id}"`)) defs += `<linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${p[0]}"/><stop offset=".45" stop-color="${p[1]}"/><stop offset=".85" stop-color="${p[2]}"/><stop offset="1" stop-color="${p[3]}"/></linearGradient>`;
    let s = `<circle cx="${cx + Rr * .06}" cy="${cy + Rr * .12}" r="${Rr * 1.0}" fill="#000" opacity=".6"/><g transform="rotate(${rot.toFixed(1)} ${cx} ${cy})">`;
    const anillos = [[6, .98, .95, .14], [5, .78, .9, .09], [5, .58, .85, .05], [4, .4, .8, .02], [3, .25, .75, 0]];
    anillos.forEach(([n, l, wf, off], j) => {
      const L = Rr * l, w = L * wf * .62;
      for (let k = 0; k < n; k++) {
        const ang = k / n * 360 + j * 33 + R(cx + k * 7, j) * 16;
        s += `<g transform="translate(${cx},${cy}) rotate(${ang.toFixed(1)}) translate(0,${(-Rr * off).toFixed(1)})">
          <path d="M${(-w * .4).toFixed(1)},0 C${(-w * 1.15).toFixed(1)},${(-L * .35).toFixed(1)} ${(-w * .9).toFixed(1)},${(-L * 1.02).toFixed(1)} 0,${(-L).toFixed(1)} C${(w * .9).toFixed(1)},${(-L * 1.02).toFixed(1)} ${(w * 1.15).toFixed(1)},${(-L * .35).toFixed(1)} ${(w * .4).toFixed(1)},0 Z" fill="url(#${id})" stroke="#000" stroke-opacity=".7" stroke-width="${(Rr / 26).toFixed(1)}"/>
          <path d="M${(-w * .78).toFixed(1)},${(-L * .8).toFixed(1)} C${(-w * .4).toFixed(1)},${(-L * 1.0).toFixed(1)} ${(w * .4).toFixed(1)},${(-L * 1.0).toFixed(1)} ${(w * .78).toFixed(1)},${(-L * .8).toFixed(1)}" fill="none" stroke="${p[3]}" stroke-opacity="${tipo === 'negra' ? .55 : .5}" stroke-width="${(Rr / 34).toFixed(1)}" stroke-linecap="round"/></g>`;
      }
    });
    s += `<circle cx="${cx}" cy="${cy}" r="${Rr * .16}" fill="${p[0]}"/><path d="M${cx - Rr * .1},${cy + Rr * .02} C${cx - Rr * .08},${cy - Rr * .12} ${cx + Rr * .1},${cy - Rr * .12} ${cx + Rr * .1},${cy + Rr * .02}" fill="none" stroke="${p[2]}" stroke-opacity=".6" stroke-width="${Rr / 30}"/>`;
    return s + '</g>';
  }
  function cempa(cx, cy, Rr) { // cempasúchil: pompón de pétalos rizados, sin botón visible
    let s = `<circle cx="${cx + 2}" cy="${cy + 4}" r="${Rr * 1.02}" fill="#000" opacity=".55"/>`;
    for (let ring = 0; ring < 7; ring++) {
      const n = 12 + ring * 3, rr = Rr * (1 - ring * .135);
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + ring * .5 + R(k, ring) * .2, x = cx + Math.cos(a) * rr * .72, y = cy + Math.sin(a) * rr * .72;
        const c = ['#A33000', '#CC4400', '#E85A00', '#FF6E0A', '#FF8418', '#FF9A28', '#FFB040'][ring];
        s += `<path d="M${x.toFixed(1)},${y.toFixed(1)} m${(-rr * .22).toFixed(1)},0 q${(rr * .11).toFixed(1)},${(-rr * .28).toFixed(1)} ${(rr * .22).toFixed(1)},${(-rr * .06).toFixed(1)} q${(rr * .11).toFixed(1)},${(-rr * .22).toFixed(1)} ${(rr * .22).toFixed(1)},${(rr * .06).toFixed(1)} q${(-rr * .1).toFixed(1)},${(rr * .26).toFixed(1)} ${(-rr * .44).toFixed(1)},0 Z" transform="rotate(${(a * 180 / Math.PI + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${c}" stroke="#5A1800" stroke-width="${ring > 4 ? .4 : .9}" stroke-opacity="${ring > 4 ? .35 : .7}"/>`;
      }
    }
    return s;
  }
  function hoja(x, y, L, ang) {
    return `<g transform="translate(${x},${y}) rotate(${ang})"><path d="M0,0 C${L * .3},${-L * .32} ${L * .75},${-L * .3} ${L},0 C${L * .75},${L * .3} ${L * .3},${L * .32} 0,0 Z" fill="${grad([[0, '#1F3A22'], [1, '#08140A']])}"/><path d="M0,0 L${L * .95},0" stroke="#3B5E3A" stroke-width="1.5"/></g>`;
  }
  const CX = 640;
  const piel = grad([[0, '#FFFFFF'], [.55, '#F6EFEA'], [.85, '#E2D2CF'], [1, '#B8A2A6']], .5, .42, .62);
  const ojoHueco = grad([[0, '#05040A'], [.7, '#0B0A16'], [1, '#2A1830']], .5, .5, .55);
  const iris = grad([[0, '#1A0800'], [.25, '#5A2604'], [.7, '#D9822A'], [1, '#4A1C00']], .5, .5, .5);
  const labio = grad([[0, '#8A3B57'], [1, '#3A1024']], .5, .4, .7);
  const halo = grad([[0, '#FF7A1A', .55], [.45, '#FF5A00', .18], [1, '#FF5A00', 0]], .5, .5, .5);
  const cabello = grad([[0, '#1C2240'], [.7, '#0C0F22'], [1, '#05060E']], .5, .3, .7);
  let s = '';
  s += `<ellipse cx="${CX}" cy="330" rx="560" ry="380" fill="${halo}"/>`;
  // vestido, cuello y collar
  s += `<path d="M330,720 C380,650 520,640 575,610 L705,610 C760,640 900,650 950,720 Z" fill="#07060B"/>`;
  for (let i = 0; i < 26; i++) s += `<circle cx="${400 + i * 19}" cy="${700 - Math.sin(i / 25 * Math.PI) * 40}" r="5" fill="none" stroke="#2A2230" stroke-width="2"/>`;
  s += `<path d="M590,560 L590,640 C610,655 670,655 690,640 L690,560 Z" fill="${grad([[0, '#E9DEDA'], [1, '#9C8890']], .5, .2, .8)}"/>`;
  s += `<path d="M585,622 C615,640 665,640 695,622" fill="none" stroke="#0A0810" stroke-width="12"/>`;
  for (let i = 0; i < 13; i++) { const a = Math.PI * (.12 + .76 * i / 12), x = CX - Math.cos(a) * 120, y = 640 + Math.sin(a) * 52; s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 3 ? 7 : 10}" fill="${i % 3 ? '#FF7A1A' : '#E8B24A'}" stroke="#5A2600" stroke-width="1.5"/>`; }
  // cabello
  s += `<path d="M${CX},120 C515,120 418,205 410,340 C402,470 425,600 455,700 L825,700 C855,600 878,470 870,340 C862,205 765,120 ${CX},120 Z" fill="${cabello}"/>`;
  for (let i = 0; i < 9; i++) { const d = i * 9; s += `<path d="M${CX - 4},134 C${560 - d},140 ${470 - d * .6},220 ${458 - d * .4},${360 + d}" fill="none" stroke="#3A4A80" stroke-opacity=".25" stroke-width="2"/><path d="M${CX + 4},134 C${720 + d},140 ${810 + d * .6},220 ${822 + d * .4},${360 + d}" fill="none" stroke="#3A4A80" stroke-opacity=".25" stroke-width="2"/>`; }
  // aretes
  for (const x of [482, 798]) { s += `<circle cx="${x}" cy="470" r="9" fill="#FF7A1A"/>`; for (let k = 0; k < 6; k++) s += `<circle cx="${x}" cy="${488 + k * 13}" r="${6 - k * .5}" fill="${k % 2 ? '#1A1418' : '#FF8A2A'}" stroke="#5A2600"/>`; s += `<path d="M${x - 12},560 L${x},590 L${x + 12},560 Z" fill="#FF7A1A"/>`; }
  // rostro
  s += `<path d="M${CX},170 C735,170 800,238 804,336 C808,424 778,500 736,556 C706,596 676,616 ${CX},618 C604,616 574,596 544,556 C502,500 472,424 476,336 C480,238 545,170 ${CX},170 Z" fill="${piel}"/>`;
  s += `<ellipse cx="520" cy="330" rx="44" ry="90" fill="#E7A2B6" opacity=".22"/><ellipse cx="760" cy="330" rx="44" ry="90" fill="#E7A2B6" opacity=".22"/>`;
  const sombra = grad([[0, '#000', 0], [.62, '#000', 0], [.9, '#2A1020', .32], [1, '#1A0814', .55]], .5, .45, .58);
  s += `<path d="M${CX},170 C735,170 800,238 804,336 C808,424 778,500 736,556 C706,596 676,616 ${CX},618 C604,616 574,596 544,556 C502,500 472,424 476,336 C480,238 545,170 ${CX},170 Z" fill="${sombra}"/>`;
  s += `<ellipse cx="540" cy="470" rx="30" ry="58" fill="#5A3048" opacity=".14" transform="rotate(-18 540 470)"/><ellipse cx="740" cy="470" rx="30" ry="58" fill="#5A3048" opacity=".14" transform="rotate(18 740 470)"/>`;
  // filigrana de la frente (simétrica)
  const filL = `<path d="M${CX - 18},270 C${CX - 40},250 ${CX - 70},262 ${CX - 70},236 C${CX - 70},214 ${CX - 98},210 ${CX - 108},228 M${CX - 70},236 C${CX - 92},244 ${CX - 120},262 ${CX - 150},250 C${CX - 168},242 ${CX - 168},222 ${CX - 152},218" fill="none" stroke="#120A10" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${CX - 152}" cy="226" r="7" fill="#120A10"/><circle cx="${CX - 108}" cy="228" r="5" fill="#120A10"/>
    <path d="M${CX - 120},300 C${CX - 150},286 ${CX - 170},300 ${CX - 160},318" fill="none" stroke="#120A10" stroke-width="4" stroke-linecap="round"/>
    ${[0, 1, 2, 3].map(k => `<circle cx="${CX - 60 - k * 22}" cy="${200 + k * 4}" r="${4 - k * .6}" fill="#120A10"/>`).join('')}`;
  s += filL + `<g transform="translate(${CX * 2},0) scale(-1,1)">${filL}</g>`;
  s += `<path d="M${CX},222 C${CX - 16},244 ${CX - 30},258 ${CX - 13},280 C${CX - 6},290 ${CX - 4},300 ${CX},312 C${CX + 4},300 ${CX + 6},290 ${CX + 13},280 C${CX + 30},258 ${CX + 16},244 ${CX},222 Z" fill="#120A10"/>`;
  s += `<path d="M${CX - 26},210 C${CX - 46},196 ${CX - 50},178 ${CX - 34},178 M${CX + 26},210 C${CX + 46},196 ${CX + 50},178 ${CX + 34},178" fill="none" stroke="#120A10" stroke-width="4" stroke-linecap="round"/>`;
  // ojos: anillo festoneado naranja y negro, hueco oscuro y ojo real
  for (const [ex, sg] of [[574, -1], [706, 1]]) {
    for (let k = 0; k < 20; k++) {
      const a = k / 20 * Math.PI * 2, x = ex + Math.cos(a) * 64, y = 372 + Math.sin(a) * 52;
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10.5" fill="${k % 2 ? '#FF7A1A' : '#FF9A3A'}" stroke="#120A10" stroke-width="2.5"/><circle cx="${(ex + Math.cos(a) * 75).toFixed(1)}" cy="${(372 + Math.sin(a) * 62).toFixed(1)}" r="2.4" fill="#120A10"/>`;
    }
    s += `<ellipse cx="${ex}" cy="372" rx="58" ry="46" fill="${ojoHueco}" stroke="#120A10" stroke-width="3"/>`;
    s += `<path d="M${ex - 34},376 C${ex - 18},354 ${ex + 18},354 ${ex + 34},376 C${ex + 18},392 ${ex - 18},392 ${ex - 34},376 Z" fill="#D9CFC9"/>`;
    s += `<circle cx="${ex}" cy="375" r="15" fill="${iris}"/><circle cx="${ex}" cy="375" r="6.5" fill="#050203"/><circle cx="${ex + 5}" cy="369" r="3.4" fill="#fff" opacity=".9"/>`;
    s += `<path d="M${ex - 36},376 C${ex - 18},350 ${ex + 18},350 ${ex + 36},376" fill="none" stroke="#050203" stroke-width="4.5"/>`;
    for (let k = 0; k < 6; k++) s += `<path d="M${ex - 26 + k * 10},${360 - Math.sin(k / 5 * Math.PI) * 4} l${(k - 2.5) * 1.6},-9" stroke="#050203" stroke-width="2"/>`;
    // espiral de la mejilla
    s += `<path d="M${ex + sg * 10},452 C${ex + sg * 40},450 ${ex + sg * 70},470 ${ex + sg * 64},494 C${ex + sg * 58},512 ${ex + sg * 36},506 ${ex + sg * 42},492" fill="none" stroke="#120A10" stroke-width="4" stroke-linecap="round"/>`;
    s += `<path d="M${ex + sg * 70},440 C${ex + sg * 92},430 ${ex + sg * 104},446 ${ex + sg * 98},462" fill="none" stroke="#FF7A1A" stroke-width="4" stroke-linecap="round"/>`;
  }
  // nariz
  s += `<path d="M${CX},420 C${CX - 14},428 ${CX - 30},456 ${CX - 26},472 C${CX - 22},484 ${CX - 8},482 ${CX},474 C${CX + 8},482 ${CX + 22},484 ${CX + 26},472 C${CX + 30},456 ${CX + 14},428 ${CX},420 Z" fill="#0A060A"/>`;
  s += `<path d="M${CX - 8},360 C${CX - 10},390 ${CX - 12},405 ${CX - 10},420" fill="none" stroke="#B8A2A6" stroke-width="3" opacity=".5"/>`;
  // boca cosida
  s += `<path d="M${CX - 46},528 C${CX - 20},516 ${CX + 20},516 ${CX + 46},528 C${CX + 20},544 ${CX - 20},546 ${CX - 46},528 Z" fill="${labio}"/>`;
  s += `<path d="M${CX - 80},529 C${CX - 30},526 ${CX + 30},526 ${CX + 80},529" fill="none" stroke="#120A10" stroke-width="3"/>`;
  for (let k = -7; k <= 7; k++) s += `<line x1="${CX + k * 11}" y1="${519 + Math.abs(k) * .5}" x2="${CX + k * 11}" y2="${540 - Math.abs(k) * .5}" stroke="#120A10" stroke-width="2.2"/>`;
  // barbilla
  s += `<path d="M${CX},566 C${CX - 10},578 ${CX - 22},580 ${CX - 26},592 C${CX - 12},590 ${CX - 4},596 ${CX},606 C${CX + 4},596 ${CX + 12},590 ${CX + 26},592 C${CX + 22},580 ${CX + 10},578 ${CX},566 Z" fill="#120A10"/>`;
  // corona: hojas detrás, cempasúchil, rosas en dos filas y cempasúchil al frente
  let fl = '';
  for (let i = 0; i < 24; i++) { const a = Math.PI * (.92 + i / 23 * 1.16), x = CX + Math.cos(a) * 330, y = 240 + Math.sin(a) * 150; fl += hoja(x.toFixed(0), y.toFixed(0), 64 + R(i) * 34, (a * 180 / Math.PI + (R(i, 2) - .5) * 70).toFixed(0)); }
  for (let i = 0; i < 9; i++) { const a = Math.PI * (1.0 + i / 8), x = CX + Math.cos(a) * 300, y = 236 + Math.sin(a) * 130; fl += cempa(x, y, 32 + R(i, 4) * 8); }
  const atras = [], frente = [];
  for (let i = 0; i < 7; i++) { const a = Math.PI * (1.08 + i / 6 * .84); atras.push([CX + Math.cos(a) * 225, 214 + Math.sin(a) * 96, i % 2 ? 'naranja' : 'negra', i === 3 ? 84 : 74]); }
  for (let i = 0; i < 6; i++) { const a = Math.PI * (1.12 + i / 5 * .76); frente.push([CX + Math.cos(a) * 168, 222 + Math.sin(a) * 52, i % 2 ? 'negra' : 'naranja', 58]); }
  const lados = [[CX - 262, 300, 'naranja', 62], [CX + 262, 300, 'negra', 62], [CX - 250, 392, 'negra', 54], [CX + 250, 392, 'naranja', 54], [CX - 236, 470, 'naranja', 40], [CX + 236, 470, 'negra', 40]];
  [...lados, ...atras, ...frente].forEach(([x, y, t, r], i) => { fl += rosa(x, y, r, t, R(i, 7) * 120); });
  for (let i = 0; i < 4; i++) { const a = Math.PI * (1.22 + i / 3 * .56), x = CX + Math.cos(a) * 200, y = 170 + Math.sin(a) * 40; fl += cempa(x, y, 26 + R(i, 9) * 4); }
  for (const [x, y] of [[CX - 285, 350], [CX + 285, 350], [CX - 270, 436], [CX + 270, 436]]) fl += cempa(x, y, 24);
  s += fl;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><defs>${defs}</defs><rect width="1280" height="720" fill="#030205"/>${s}</svg>`;
}
if (typeof module !== 'undefined') module.exports = { catrinaSVG };
