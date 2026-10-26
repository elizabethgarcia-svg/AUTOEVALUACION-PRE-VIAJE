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
  // extrusión profunda hacia abajo-derecha, del naranja quemado del fondo al naranja vivo junto a la cara
  const mix = (a, b, k) => '#' + [0, 2, 4].map(i => Math.round(parseInt(a.substr(i + 1, 2), 16) * (1 - k) + parseInt(b.substr(i + 1, 2), 16) * k).toString(16).padStart(2, '0')).join('');
  let capas = '';
  const N = 26;
  for (let i = N; i >= 1; i--) {
    const dx = i * 1.05, dy = i * 1.5, c = mix('#4A1200', '#C94300', 1 - i / N);
    capas += `<g transform="translate(${dx.toFixed(2)},${dy.toFixed(2)})" fill="${c}"><path d="${LOGO_C}"/><path d="${LOGO_D}"/></g>`;
  }
  return `<g id="${id}">
    <defs>
      <linearGradient id="${id}g" x1="-.1" y1="-.1" x2=".9" y2="1"><stop offset="0" stop-color="#FF8A3A"/><stop offset=".45" stop-color="#FF5E0A"/><stop offset="1" stop-color="#E84600"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD2A8" stop-opacity=".95"/><stop offset=".5" stop-color="#FFB27A" stop-opacity=".25"/><stop offset="1" stop-color="#FFB27A" stop-opacity="0"/></linearGradient>
      <filter id="${id}s" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
    </defs>
    <g transform="translate(34,52)" opacity=".55" filter="url(#${id}s)"><path d="${LOGO_C}" fill="#000"/><path d="${LOGO_D}" fill="#000"/></g>
    ${capas}
    <path class="lc" d="${LOGO_C}" fill="url(#${id}g)"/><path class="ld" d="${LOGO_D}" fill="url(#${id}g)"/>
    <path d="${LOGO_C}" fill="none" stroke="url(#${id}b)" stroke-width="5"/><path d="${LOGO_D}" fill="none" stroke="url(#${id}b)" stroke-width="4"/></g>`;
}
