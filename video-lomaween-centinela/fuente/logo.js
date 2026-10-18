// Logo Centinela redibujado en vector: "C" naranja 3D + semicírculo interior (radar).
const NARANJA = '#FF5A00', NARANJA_OSC = '#A93500', NARANJA_MED = '#D94600';
function sectorAnular(cx, cy, ro, ri, a0, a1) {
  const r = Math.PI / 180, P = (R, a) => [cx + R * Math.cos(a * r), cy + R * Math.sin(a * r)];
  const [x1, y1] = P(ro, a0), [x2, y2] = P(ro, a1), [x3, y3] = P(ri, a1), [x4, y4] = P(ri, a0);
  const grande = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${x1},${y1} A${ro},${ro} 0 ${grande} 0 ${x2},${y2} L${x3},${y3} A${ri},${ri} 0 ${grande} 1 ${x4},${y4} Z`;
}
const LOGO_C = sectorAnular(0, 0, 175, 82, -118, -332);
const LOGO_D = 'M-10,-83 A61,61 0 0 0 82,3 Z';
function logoSVG(id) {
  // capas de extrusión hacia abajo-derecha, luego la cara frontal
  let capas = '';
  for (let i = 12; i >= 1; i--) {
    const dx = i * 1.0, dy = i * 1.4, c = i > 2 ? NARANJA_OSC : NARANJA_MED;
    capas += `<g transform="translate(${dx},${dy})" fill="${c}"><path d="${LOGO_C}"/><path d="${LOGO_D}"/></g>`;
  }
  return `<g id="${id}">${capas}
    <defs><linearGradient id="${id}g" x1="0" y1="-1" x2="0.4" y2="1"><stop offset="0" stop-color="#FF6A10"/><stop offset="1" stop-color="#FF5000"/></linearGradient></defs>
    <path class="lc" d="${LOGO_C}" fill="url(#${id}g)"/><path class="ld" d="${LOGO_D}" fill="url(#${id}g)"/></g>`;
}
