// Lotería Centinela: 10 tarjetas de misión (frente estilo lotería mexicana) y su reverso. Cada tarjeta mide 300x440.
const CARTAS = [
  { n: 1, nom: 'EL TRABAJO EN EQUIPO', canto: 'Si uno se detiene, se detienen todos…', bg: '#22A699', quien: 'OJO DE HALCÓN', tipo: 'PUNTO DE CONTROL 1' },
  { n: 2, nom: 'EL RESULTADO', canto: 'A tiempo, completos y sin un rasguño…', bg: '#F5B400', quien: 'EL TURNO DE LA NOCHE', tipo: 'PUNTO DE CONTROL 2' },
  { n: 3, nom: 'LA PASIÓN', canto: 'Lo que se hace con el corazón se nota en los detalles…', bg: '#6A2BD9', quien: 'EL DE LA LLAMADA', tipo: 'PUNTO DE CONTROL 3' },
  { n: 4, nom: 'EL PAPEL PICADO', canto: 'Cruza el techo como las rutas del mapa…', bg: '#D6006F', quien: 'OJO DE HALCÓN', tipo: 'RECORRIDO' },
  { n: 5, nom: 'EL TRACTO', canto: 'Nunca deja sola a su caja…', bg: '#1E7FD6', quien: 'LA ARQUITECTA', tipo: 'RECORRIDO' },
  { n: 6, nom: 'LA CARRETERA', canto: 'Por ella se va y por ella se regresa…', bg: '#3E9A44', quien: 'LA DE LAS ALERTAS', tipo: 'RECORRIDO' },
  { n: 7, nom: 'LA CRUZ', canto: 'Alumbra el camino de los que se adelantaron…', bg: '#4B2C9E', quien: 'EL RESCATISTA', tipo: 'RECORRIDO' },
  { n: 8, nom: 'EL 877', canto: 'Tiene ojos, voz y corazón…', bg: '#0098AE', quien: 'LA VOZ', tipo: 'RECORRIDO' },
  { n: 9, nom: 'LA OFRENDA', canto: 'Mandarina, pan y cacahuate…', bg: '#F07A00', quien: 'MANOS DE CEMPASÚCHIL', tipo: 'RECORRIDO' },
  { n: 10, nom: 'LA CATRINA', canto: 'Muy elegante y bien peinada, pero en carretera ni la invitamos…', bg: '#C2185B', quien: 'CAZA JAMMERS', tipo: 'RECORRIDO' },
];
const TINTA = '#17110D';
function engraneC(cx, cy, r, n, c) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a0 = i / (n * 2) * Math.PI * 2, a1 = (i + 1) / (n * 2) * Math.PI * 2, R = i % 2 ? r : r + r * .22;
    d += (i ? 'L' : 'M') + (cx + Math.cos(a0) * R).toFixed(1) + ',' + (cy + Math.sin(a0) * R).toFixed(1) + 'L' + (cx + Math.cos(a1) * R).toFixed(1) + ',' + (cy + Math.sin(a1) * R).toFixed(1);
  }
  return `<path d="${d}Z" fill="${c}" stroke="${TINTA}" stroke-width="4" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy}" r="${r * .38}" fill="#F3E7CC" stroke="${TINTA}" stroke-width="4"/>`;
}
const DIBUJOS = {
  1: () => engraneC(104, 190, 44, 9, '#7B2FF7') + engraneC(196, 178, 40, 8, '#FF6A00') + engraneC(150, 268, 42, 9, '#E6007E'),
  2: () => `<line x1="96" y1="110" x2="96" y2="330" stroke="${TINTA}" stroke-width="8" stroke-linecap="round"/>
    <clipPath id="cBand"><path d="M100,118 C150,96 190,140 244,118 L244,230 C190,252 150,208 100,230 Z"/></clipPath>
    <g clip-path="url(#cBand)"><rect x="100" y="90" width="150" height="160" fill="#fff"/>${Array.from({ length: 36 }, (_, k) => { const i = k % 6, j = Math.floor(k / 6); return (i + j) % 2 ? `<rect x="${100 + i * 25}" y="${92 + j * 25}" width="25" height="25" fill="${TINTA}"/>` : ''; }).join('')}</g>
    <path d="M100,118 C150,96 190,140 244,118 L244,230 C190,252 150,208 100,230 Z" fill="none" stroke="${TINTA}" stroke-width="5"/>
    <circle cx="96" cy="106" r="9" fill="#FFC21A" stroke="${TINTA}" stroke-width="4"/>
    <rect x="150" y="262" width="96" height="62" rx="8" fill="#fff" stroke="${TINTA}" stroke-width="4"/><rect x="150" y="262" width="96" height="18" rx="6" fill="#E53935" stroke="${TINTA}" stroke-width="4"/>
    <text x="198" y="316" text-anchor="middle" font-family="Anton" font-size="34" fill="${TINTA}">30</text>`,
  3: () => `<path d="M150,330 C70,270 52,220 62,182 C74,134 132,126 150,170 C168,126 226,134 238,182 C248,220 230,270 150,330 Z" fill="#E53935" stroke="${TINTA}" stroke-width="6"/>
    <path d="M96,170 C104,154 120,150 132,156" fill="none" stroke="#FFCDD2" stroke-width="7" stroke-linecap="round"/>
    <circle cx="150" cy="226" r="46" fill="none" stroke="#F3E7CC" stroke-width="10"/><circle cx="150" cy="226" r="12" fill="#F3E7CC"/>
    <path d="M150,214 L150,180 M140,232 L112,250 M160,232 L188,250" stroke="#F3E7CC" stroke-width="9" stroke-linecap="round"/>
    ${[[78, 120], [222, 118], [60, 236], [240, 240]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#FF8A00" stroke="${TINTA}" stroke-width="3"/>`).join('')}`,
  4: () => {
    let s = `<path d="M40,118 Q150,150 260,118" fill="none" stroke="${TINTA}" stroke-width="4"/>`;
    const C = ['#7B2FF7', '#FF6A00', '#E6007E', '#1C1620'];
    for (let k = 0; k < 4; k++) {
      const x = 52 + k * 52, y = 122 + Math.sin((k + .5) / 4 * Math.PI) * 26;
      s += `<path d="M${x},${y} L${x + 48},${y} L${x + 48},${y + 150} L${x + 36},${y + 140} L${x + 24},${y + 150} L${x + 12},${y + 140} L${x},${y + 150} Z" fill="${C[k]}" stroke="${TINTA}" stroke-width="3"/>
        <circle cx="${x + 24}" cy="${y + 50}" r="11" fill="#F3E7CC"/><path d="M${x + 12},${y + 90} l12,-14 l12,14 l-12,14 Z" fill="#F3E7CC"/>
        <circle cx="${x + 12}" cy="${y + 20}" r="4" fill="#F3E7CC"/><circle cx="${x + 36}" cy="${y + 20}" r="4" fill="#F3E7CC"/><circle cx="${x + 24}" cy="${y + 122}" r="5" fill="#F3E7CC"/>`;
    }
    return s;
  },
  5: () => `<rect x="66" y="130" width="168" height="40" rx="10" fill="#F4F6F9" stroke="${TINTA}" stroke-width="5"/>
    <rect x="84" y="138" width="132" height="24" rx="6" fill="#9FD3FF" stroke="${TINTA}" stroke-width="3"/>
    <rect x="60" y="170" width="180" height="120" rx="12" fill="#F4F6F9" stroke="${TINTA}" stroke-width="5"/>
    <rect x="100" y="182" width="100" height="84" rx="6" fill="#B0B8C2" stroke="${TINTA}" stroke-width="4"/>
    ${Array.from({ length: 6 }, (_, k) => `<line x1="104" y1="${190 + k * 13}" x2="196" y2="${190 + k * 13}" stroke="${TINTA}" stroke-width="3"/>`).join('')}
    <circle cx="80" cy="232" r="12" fill="#FFE082" stroke="${TINTA}" stroke-width="4"/><circle cx="220" cy="232" r="12" fill="#FFE082" stroke="${TINTA}" stroke-width="4"/>
    <rect x="52" y="286" width="196" height="24" rx="8" fill="#FF6A00" stroke="${TINTA}" stroke-width="5"/>
    <rect x="70" y="310" width="34" height="26" rx="6" fill="${TINTA}"/><rect x="196" y="310" width="34" height="26" rx="6" fill="${TINTA}"/>
    <text x="150" y="304" text-anchor="middle" font-family="Anton" font-size="16" fill="#fff">877</text>`,
  6: () => `<path d="M128,110 L172,110 L262,340 L38,340 Z" fill="#4A4F57" stroke="${TINTA}" stroke-width="5"/>
    ${[0, 1, 2, 3].map(k => { const y0 = 122 + k * 56, y1 = y0 + 30, w0 = 3 + k * 2.5; return `<path d="M${150 - w0},${y0} L${150 + w0},${y0} L${150 + w0 + 2},${y1} L${150 - w0 - 2},${y1} Z" fill="#FFC21A"/>`; }).join('')}
    <line x1="218" y1="110" x2="218" y2="220" stroke="${TINTA}" stroke-width="6"/>
    <circle cx="218" cy="122" r="30" fill="#fff" stroke="#E53935" stroke-width="9"/><text x="218" y="133" text-anchor="middle" font-family="Anton" font-size="26" fill="${TINTA}">100</text>`,
  7: () => `<rect x="134" y="100" width="32" height="200" rx="4" fill="#8D5A2B" stroke="${TINTA}" stroke-width="5"/><rect x="92" y="146" width="116" height="30" rx="4" fill="#8D5A2B" stroke="${TINTA}" stroke-width="5"/>
    ${Array.from({ length: 9 }, (_, k) => { const a = Math.PI * (.15 + k / 8 * .7); return `<circle cx="${(150 - Math.cos(a) * 64).toFixed(0)}" cy="${(206 + Math.sin(a) * 40).toFixed(0)}" r="11" fill="#FF8A00" stroke="${TINTA}" stroke-width="3"/>`; }).join('')}
    ${[70, 230].map(x => `<rect x="${x - 12}" y="262" width="24" height="70" rx="4" fill="#FFF3D6" stroke="${TINTA}" stroke-width="4"/><path d="M${x},230 C${x - 12},246 ${x - 8},258 ${x},260 C${x + 8},258 ${x + 12},246 ${x},230 Z" fill="#FFB300" stroke="${TINTA}" stroke-width="3"/>`).join('')}`,
  8: () => `<rect x="44" y="118" width="212" height="150" rx="16" fill="#1C2030" stroke="${TINTA}" stroke-width="6"/>
    <rect x="58" y="130" width="184" height="126" rx="8" fill="#BFE3FF"/>
    <ellipse cx="114" cy="190" rx="30" ry="34" fill="#fff" stroke="${TINTA}" stroke-width="4"/><ellipse cx="186" cy="190" rx="30" ry="34" fill="#fff" stroke="${TINTA}" stroke-width="4"/>
    <circle cx="120" cy="196" r="15" fill="#5A3A1A"/><circle cx="180" cy="196" r="15" fill="#5A3A1A"/><circle cx="124" cy="190" r="5" fill="#fff"/><circle cx="184" cy="190" r="5" fill="#fff"/>
    <path d="M128,234 Q150,248 172,234" fill="none" stroke="${TINTA}" stroke-width="5" stroke-linecap="round"/>
    <rect x="120" y="268" width="60" height="22" fill="#1C2030"/><rect x="86" y="290" width="128" height="14" rx="6" fill="#1C2030"/>
    <text x="150" y="336" text-anchor="middle" font-family="Anton" font-size="30" fill="${TINTA}">877</text>`,
  9: () => `<ellipse cx="132" cy="236" rx="74" ry="58" fill="#E0A05A" stroke="${TINTA}" stroke-width="5"/>
    <path d="M76,214 C110,196 160,196 190,214 M132,180 L132,288" fill="none" stroke="#B9783A" stroke-width="12" stroke-linecap="round"/>
    <circle cx="132" cy="182" r="12" fill="#B9783A" stroke="${TINTA}" stroke-width="3"/>
    ${[[214, 292], [244, 252]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="26" fill="#FF8A00" stroke="${TINTA}" stroke-width="4"/><path d="M${x},${y - 26} l6,-10" stroke="#2E7D32" stroke-width="5"/>`).join('')}
    ${[[70, 312], [100, 322], [132, 316]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="16" ry="9" fill="#C8A26A" stroke="${TINTA}" stroke-width="3"/>`).join('')}`,
  10: () => `<ellipse cx="150" cy="150" rx="118" ry="26" fill="#1C1620" stroke="${TINTA}" stroke-width="4"/>
    <path d="M98,150 C98,104 202,104 202,150 Z" fill="#1C1620" stroke="${TINTA}" stroke-width="4"/>
    ${[[96, 128, '#FF6A00'], [204, 128, '#E6007E'], [150, 106, '#FF8A00']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="15" fill="${c}" stroke="${TINTA}" stroke-width="3"/>`).join('')}
    <path d="M150,166 C200,166 214,206 210,236 C206,262 188,274 178,282 L178,306 L122,306 L122,282 C112,274 94,262 90,236 C86,206 100,166 150,166 Z" fill="#FFFDF7" stroke="${TINTA}" stroke-width="5"/>
    <ellipse cx="126" cy="232" rx="17" ry="15" fill="${TINTA}"/><ellipse cx="174" cy="232" rx="17" ry="15" fill="${TINTA}"/>
    <path d="M150,252 l-8,14 l16,0 Z" fill="${TINTA}"/>${[-2, -1, 0, 1, 2].map(k => `<line x1="${150 + k * 11}" y1="286" x2="${150 + k * 11}" y2="304" stroke="${TINTA}" stroke-width="3"/>`).join('')}
    <path d="M122,316 C140,326 160,326 178,316" fill="none" stroke="#FF6A00" stroke-width="7"/>`,
};
function cartaSVG(c) {
  const dib = DIBUJOS[c.n]();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="440" viewBox="0 0 300 440">
    <defs><linearGradient id="papel${c.n}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBF3E0"/><stop offset="1" stop-color="#EBDDBE"/></linearGradient></defs>
    <rect x="3" y="3" width="294" height="434" rx="16" fill="url(#papel${c.n})" stroke="${TINTA}" stroke-width="6"/>
    <rect x="16" y="16" width="268" height="408" rx="8" fill="none" stroke="${TINTA}" stroke-width="3"/>
    <rect x="26" y="74" width="248" height="282" rx="4" fill="${c.bg}" stroke="${TINTA}" stroke-width="4"/>
    <circle cx="26" cy="74" r="0"/>
    <text x="30" y="60" font-family="Anton" font-size="40" fill="${TINTA}">${c.n}</text>
    <text x="270" y="56" text-anchor="end" font-family="M" font-weight="900" font-size="12" letter-spacing="2" fill="${TINTA}" opacity=".8">${c.tipo}</text>
    <g>${dib}</g>
    <text x="150" y="405" text-anchor="middle" font-family="Anton" font-size="34" fill="${TINTA}" textLength="${Math.min(240, c.nom.length * 17)}" lengthAdjust="spacingAndGlyphs">${c.nom}</text>
  </svg>`;
}
function reversoSVG(logo) {
  let pts = '';
  for (let i = 0; i < 7; i++) for (let j = 0; j < 10; j++) pts += `<circle cx="${30 + i * 40 + (j % 2) * 20}" cy="${30 + j * 42}" r="3" fill="#FF5A00" opacity=".22"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="440" viewBox="0 0 300 440">
    <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14224A"/><stop offset="1" stop-color="#070B1C"/></linearGradient></defs>
    <rect x="3" y="3" width="294" height="434" rx="16" fill="url(#rev)" stroke="#FF5A00" stroke-width="6"/>${pts}
    <rect x="18" y="18" width="264" height="404" rx="10" fill="none" stroke="#FF8A3D" stroke-width="2" stroke-dasharray="8 6"/>
    <text x="150" y="92" text-anchor="middle" font-family="Anton" font-size="44" letter-spacing="4" fill="#FF8A3D">LOTERÍA</text>
    <g transform="translate(150,230) scale(.42)">${logo}</g>
    <text x="150" y="372" text-anchor="middle" font-family="M" font-weight="900" font-size="22" letter-spacing="6" fill="#fff">CENTINELA</text>
    <text x="150" y="398" text-anchor="middle" font-family="M" font-weight="800" font-size="11" letter-spacing="3" fill="#FFB38A">MISIÓN LOMAWEEN</text>
  </svg>`;
}
if (typeof module !== 'undefined') module.exports = { CARTAS, cartaSVG, reversoSVG };
