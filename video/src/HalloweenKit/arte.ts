// Ilustraciones del video original (video.html / video.js), en coordenadas de 720×1280.
// Cada escena las dibuja dentro de un <svg viewBox="0 0 720 1280"> que llena el cuadro.

export const DEFS = `
<linearGradient id="gTrailer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBFBFC"/><stop offset=".72" stop-color="#E2E5EA"/><stop offset="1" stop-color="#C3C8CF"/></linearGradient>
<linearGradient id="gCab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7424"/><stop offset=".55" stop-color="#FF5A00"/><stop offset="1" stop-color="#CF4300"/></linearGradient>
<linearGradient id="gChrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F6F9"/><stop offset=".5" stop-color="#9EA5AF"/><stop offset="1" stop-color="#E4E7EB"/></linearGradient>
<radialGradient id="gRim"><stop offset="0" stop-color="#EEF0F3"/><stop offset="1" stop-color="#8A919B"/></radialGradient>
<linearGradient id="gBeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF1C4" stop-opacity=".62"/><stop offset="1" stop-color="#FFF1C4" stop-opacity="0"/></linearGradient>
<radialGradient id="gGlowW"><stop offset="0" stop-color="#FFF6D8" stop-opacity=".95"/><stop offset=".35" stop-color="#FFE9A8" stop-opacity=".35"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient>
<radialGradient id="gGlowO"><stop offset="0" stop-color="#FF6A00" stop-opacity=".75"/><stop offset="1" stop-color="#FF5A00" stop-opacity="0"/></radialGradient>
<radialGradient id="gGlowY"><stop offset="0" stop-color="#FFD54A" stop-opacity=".9"/><stop offset="1" stop-color="#FFB300" stop-opacity="0"/></radialGradient>
<radialGradient id="gGlowP"><stop offset="0" stop-color="#8E3BFF" stop-opacity=".55"/><stop offset="1" stop-color="#5A1EA0" stop-opacity="0"/></radialGradient>
<radialGradient id="gLuna" cx=".42" cy=".4"><stop offset="0" stop-color="#FFFBEA"/><stop offset=".8" stop-color="#FBE9BE"/><stop offset="1" stop-color="#EBD39A"/></radialGradient>
<linearGradient id="gNoche" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04021A"/><stop offset=".42" stop-color="#150A3A"/><stop offset=".66" stop-color="#3B1553"/><stop offset=".74" stop-color="#6A2350"/></linearGradient>
<radialGradient id="gFondoMorado" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#3D1468"/><stop offset=".6" stop-color="#1A0930"/><stop offset="1" stop-color="#08040F"/></radialGradient>
<linearGradient id="gFantasma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D6CEF2"/></linearGradient>`;

export const LUNA = `<circle r="92" fill="url(#gLuna)"/><circle cx="-30" cy="-18" r="16" fill="#E9D3A0" opacity=".55"/><circle cx="26" cy="22" r="22" fill="#E9D3A0" opacity=".5"/><circle cx="34" cy="-36" r="9" fill="#E9D3A0" opacity=".5"/><circle cx="-18" cy="40" r="10" fill="#E9D3A0" opacity=".45"/>`;

let costillas = "";
for (let x = 40; x < 400; x += 40) costillas += `<rect x="${x}" y="52" width="2" height="114" fill="#000" opacity=".05"/>`;
let marcadores = "";
for (let x = 22; x < 400; x += 62) marcadores += `<circle cx="${x}" cy="46" r="3.2" fill="#FFB300"/>`;

// Tractocamión "Equipo Centinela" sin llantas ni logo (esos se dibujan aparte para animarlos).
export const TRAILER = `
<ellipse cx="320" cy="252" rx="335" ry="11" fill="#000" opacity=".5"/>
<rect x="0" y="40" width="402" height="152" rx="6" fill="url(#gTrailer)"/>
<rect x="0" y="40" width="402" height="9" rx="4" fill="#fff" opacity=".6"/>${costillas}${marcadores}
<rect x="5" y="46" width="3" height="140" fill="#B4BAC2"/>
<rect x="0" y="166" width="402" height="10" fill="#FF5A00"/>
<rect x="0" y="186" width="402" height="14" fill="#25272C"/>
<text x="146" y="100" font-family="Anton" font-size="30" fill="#1C1C22" letter-spacing="2">EQUIPO</text>
<text x="144" y="152" font-family="Anton" font-size="58" fill="#FF5A00" letter-spacing="1">CENTINELA</text>
<rect x="292" y="198" width="7" height="34" fill="#3A3D44"/><rect x="286" y="230" width="19" height="5" fill="#3A3D44"/>
<rect x="152" y="196" width="10" height="44" rx="2" fill="#141414"/>
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
<path d="M560,226 A38,38 0 0 1 632,226" stroke="#121214" stroke-width="9" fill="none"/>`;
export const LLANTAS_X = [62, 122, 420, 476, 596];
export const LLANTA = `<circle r="28" fill="#0D0D10"/><circle r="22" fill="#27282D"/>`;
export const RIN = `<circle r="15" fill="url(#gRim)"/><path d="M0,-14V14M-14,0H14M-10,-10L10,10M-10,10L10,-10" stroke="#7F8690" stroke-width="2.6"/><circle r="5" fill="#59606A"/>`;

export const ESCUDO_57 = `<rect x="-5" y="40" width="10" height="150" fill="#8B9099"/>
<path d="M-46,-52 L-30,-60 L0,-52 L30,-60 L46,-52 L46,-8 C46,26 24,46 0,60 C-24,46 -46,26 -46,-8 Z" fill="#fff" stroke="#111" stroke-width="5"/>
<text x="0" y="-28" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="15" fill="#111">MEX</text>
<text x="0" y="30" text-anchor="middle" font-family="Anton" font-size="56" fill="#111">57</text>`;

export const CALABAZA = `
<ellipse cx="0" cy="-80" rx="112" ry="82" fill="#D85300"/>
<ellipse cx="-52" cy="-80" rx="58" ry="80" fill="#FF7A1A"/><ellipse cx="52" cy="-80" rx="58" ry="80" fill="#FF7A1A"/>
<ellipse cx="0" cy="-80" rx="46" ry="82" fill="#FF8C2E"/>
<path d="M-8,-158 Q-4,-182 14,-190 L20,-183 Q6,-172 9,-158 Z" fill="#4E6B1F"/>
<g fill="#FFD34D"><path d="M-66,-96 L-26,-96 L-46,-130 Z"/><path d="M26,-96 L66,-96 L46,-130 Z"/><path d="M-10,-74 L10,-74 L0,-92 Z"/>
<path d="M-72,-54 Q0,-14 72,-54 L60,-36 L44,-46 L30,-26 L14,-40 L0,-20 L-14,-40 L-30,-26 L-44,-46 L-60,-36 Z"/></g>`;

export const FANTASMA = `
<ellipse cx="0" cy="0" rx="190" ry="190" fill="url(#gGlowP)" opacity=".8"/>
<path d="M-90,40 C-90,-60 -50,-120 0,-120 C50,-120 90,-60 90,40 L90,110 Q75,90 60,110 Q45,130 30,110 Q15,90 0,110 Q-15,130 -30,110 Q-45,90 -60,110 Q-75,130 -90,110 Z" fill="url(#gFantasma)"/>
<path d="M-90,10 C-120,0 -130,-30 -122,-48 C-110,-30 -100,-20 -88,-22 Z M90,10 C120,0 130,-30 122,-48 C110,-30 100,-20 88,-22 Z" fill="#EDE8FA"/>
<ellipse cx="-32" cy="-42" rx="13" ry="19" fill="#120A1E"/><ellipse cx="32" cy="-42" rx="13" ry="19" fill="#120A1E"/>
<ellipse cx="0" cy="12" rx="17" ry="24" fill="#120A1E"/><ellipse cx="-56" cy="-10" rx="12" ry="7" fill="#FF9AC2" opacity=".55"/><ellipse cx="56" cy="-10" rx="12" ry="7" fill="#FF9AC2" opacity=".55"/>`;

// Prevención · Protocolo · 100 km/h
export const SENALES = [
  `<rect x="-5" y="40" width="10" height="200" fill="#8B9099"/><path d="M0,-80 L80,0 L0,80 L-80,0 Z" fill="#FFC400" stroke="#111" stroke-width="6"/><rect x="-7" y="-44" width="14" height="52" rx="5" fill="#111"/><circle cy="28" r="9" fill="#111"/>`,
  `<rect x="-5" y="40" width="10" height="200" fill="#8B9099"/><rect x="-72" y="-74" width="144" height="148" rx="12" fill="#fff" stroke="#111" stroke-width="6"/><rect x="-40" y="-52" width="80" height="104" rx="8" fill="#1F4FB8"/><rect x="-16" y="-60" width="32" height="16" rx="4" fill="#111"/><path d="M-24,-22 l7,7 l12,-14 M-24,8 l7,7 l12,-14 M-24,36 l7,7 l12,-14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M4,-18 H28 M4,12 H28 M4,40 H28" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
  `<rect x="-5" y="40" width="10" height="200" fill="#8B9099"/><circle r="80" fill="#fff" stroke="#111" stroke-width="3"/><circle r="70" fill="none" stroke="#E01E1E" stroke-width="16"/><text y="20" text-anchor="middle" font-family="Anton" font-size="64" fill="#111">100</text><text y="46" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="17" fill="#111">km/h</text>`,
];

export const MONITORES = `<g opacity=".32">
<rect x="-60" y="120" width="380" height="250" rx="10" fill="#10161D" stroke="#1E3A40" stroke-width="3"/><rect x="400" y="100" width="420" height="270" rx="10" fill="#10161D" stroke="#1E3A40" stroke-width="3"/>
<rect x="-40" y="420" width="340" height="220" rx="10" fill="#10161D" stroke="#1E3A40" stroke-width="3"/><rect x="420" y="420" width="380" height="230" rx="10" fill="#10161D" stroke="#1E3A40" stroke-width="3"/>
<g stroke="#2E5A60" stroke-width="3" fill="none"><path d="M430,150 l60,40 l40,-20 l70,50 l50,-30 l60,60 M440,300 l80,-30 l60,40 l90,-50"/><path d="M-30,480 l70,30 l50,-20 l60,50 l80,-30 M-20,600 l90,-40 l70,20"/><path d="M450,470 h300 M450,520 h220 M450,570 h260"/><path d="M-40,160 h300 M-40,210 h240 M-40,260 h280 M-40,310 h200"/></g></g>`;

// Silueta de montañas que se repite cada `periodo` px (para el paralaje).
export const cordillera = (y0: number, amps: [number, number, number][], periodo: number) => {
  let d = `M0,1280 L0,${y0}`;
  for (let x = 0; x <= periodo * 2; x += 8) {
    let y = y0;
    for (const [a, k, f] of amps) y -= a * (0.5 + 0.5 * Math.sin(((2 * Math.PI * x) / periodo) * k + f));
    d += ` L${x},${y.toFixed(1)}`;
  }
  return d + ` L${periodo * 2},1280 Z`;
};
