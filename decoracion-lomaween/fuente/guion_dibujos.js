// Dibujitos del guion de producción: "así sí / así no" y los esquemas de cada receta de grabación.
(function () {
  const T = '#221a2c', S = '#5d5468', P = '#f2d3b3', N = '#ff6a00', V = '#1e8e4e', R = '#c62828';
  const cabeza = (x, y, s, piel = P, ojos = 'frente') => {
    const dy = ojos === 'abajo' ? 3 * s : 0;
    return `<circle cx="${x}" cy="${y}" r="${10 * s}" fill="${piel}" stroke="${T}" stroke-width="${1.2 * s}"/>
      <circle cx="${x - 3.4 * s}" cy="${y - 1 * s + dy}" r="${1.4 * s}" fill="${T}"/><circle cx="${x + 3.4 * s}" cy="${y - 1 * s + dy}" r="${1.4 * s}" fill="${T}"/>`;
  };
  const persona = (x, y, s, piel = P, ropa = S, ojos) => `<path d="M${x - 22 * s},${y + 34 * s} C${x - 21 * s},${y + 14 * s} ${x + 21 * s},${y + 14 * s} ${x + 22 * s},${y + 34 * s} Z" fill="${ropa}"/>${cabeza(x, y, s, piel, ojos)}`;
  const marco = (w, h, dentro, fondo = '#e9e4ef') => `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="5" fill="${fondo}" stroke="${T}" stroke-width="2"/><g>${dentro}</g>`;
  const rejilla = (w, h) => [1, 2].map(k => `<line x1="${w * k / 3}" y1="2" x2="${w * k / 3}" y2="${h - 2}" stroke="#fff" stroke-width="1"/><line x1="2" y1="${h * k / 3}" x2="${w - 2}" y2="${h * k / 3}" stroke="#fff" stroke-width="1"/>`).join('');
  const sello = (ok, x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="${ok ? V : R}"/>` + (ok ? `<path d="M${x - 4.5},${y} l3,3.2 l6,-6.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M${x - 4},${y - 4} l8,8 M${x + 4},${y - 4} l-8,8" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`);
  const mini = (ok, contenido, pie) => `<div><svg width="104" height="74" viewBox="0 0 104 74">${contenido}${sello(ok, 94, 10)}</svg><span style="color:${ok ? V : R}">${pie}</span></div>`;

  const PARES = [
    ['Celular acostado', mini(true, marco(96, 58, rejilla(96, 58) + persona(48, 22, 1)), 'horizontal'),
      mini(false, `<g transform="translate(34,0)">${marco(34, 62, persona(17, 26, .6))}</g>`, 'vertical')],
    ['Luz de frente', mini(true, marco(96, 58, persona(48, 22, 1, '#f7dcbd', '#7b6e88')), 'la cara se ve clara'),
      mini(false, marco(96, 58, `<rect x="10" y="4" width="76" height="40" fill="#fff8d6"/>` + persona(48, 22, 1, '#3a3340', '#2a2430'), '#fffbe8'), 'contraluz: sale oscura')],
    ['A la altura de los ojos', mini(true, `<rect x="8" y="22" width="16" height="10" rx="2" fill="${T}"/><line x1="24" y1="27" x2="70" y2="27" stroke="${N}" stroke-width="2" stroke-dasharray="3 3"/>${persona(80, 27, .9)}`, 'derecho'),
      mini(false, `<rect x="8" y="56" width="16" height="10" rx="2" fill="${T}"/><line x1="24" y1="58" x2="72" y2="30" stroke="${R}" stroke-width="2" stroke-dasharray="3 3"/>${persona(80, 27, .9)}`, 'desde abajo')],
    ['De pecho para arriba', mini(true, marco(96, 58, rejilla(96, 58) + persona(48, 22, 1.25)), 'ojos en la línea de arriba'),
      mini(false, marco(96, 58, rejilla(96, 58) + persona(48, 36, .38)), 'muy lejos')],
    ['Te acercas tú', mini(true, marco(96, 58, persona(48, 22, 1)), 'nítido'),
      mini(false, marco(96, 58, `<g filter="url(#borroso)">${persona(48, 22, 1)}</g><text x="10" y="52" font-family="M" font-weight="900" font-size="9" fill="${R}">ZOOM ×5</text>`), 'con zoom: borroso')],
    ['Mira a la lente', mini(true, marco(96, 58, persona(48, 22, 1.25)), 'mira a la cámara'),
      mini(false, marco(96, 58, persona(48, 22, 1.25, P, S, 'abajo')), 'mira la pantalla')],
  ];
  const defs = `<svg width="0" height="0" style="position:absolute"><defs><filter id="borroso"><feGaussianBlur stdDeviation="2.4"/></filter></defs></svg>`;
  const pares = document.getElementById('pares');
  if (pares) pares.innerHTML = defs + PARES.map(([t, a, b]) => `<div class="par"><div class="t">${t}</div><div class="dos">${a}${b}</div></div>`).join('');

  const DIB = {
    tarjeta: () => marco(150, 100, rejilla(150, 100) + `<path d="M46,100 C46,64 104,64 104,100 Z" fill="${S}"/>${cabeza(75, 40, 1.5)}
      <rect x="62" y="64" width="26" height="34" rx="3" fill="${N}" stroke="${T}" stroke-width="1.5"/><text x="75" y="84" text-anchor="middle" font-family="M" font-weight="900" font-size="8" fill="#fff">EL TRACTO</text>
      <path d="M150,58 H122" stroke="${T}" stroke-width="7" stroke-linecap="round"/><path d="M118,52 l-8,6 l8,6" fill="none" stroke="${N}" stroke-width="2.4"/>
      <text x="146" y="48" text-anchor="end" font-family="M" font-weight="800" font-size="8" fill="${S}">la mano entra</text>`),
    frase: () => marco(150, 100, rejilla(150, 100) + persona(75, 40, 1.7) + `<text x="6" y="30" font-family="M" font-weight="800" font-size="8" fill="${N}">ojos aquí ›</text>`),
    pieza: () => `<rect x="0" y="0" width="150" height="100" rx="6" fill="#f6f2f9"/>
      <rect x="98" y="20" width="40" height="34" rx="4" fill="${N}"/><text x="118" y="41" text-anchor="middle" font-family="M" font-weight="900" font-size="8" fill="#fff">PIEZA</text>
      ${cabeza(84, 40, .9)}<rect x="10" y="32" width="18" height="11" rx="2" fill="${T}"/><line x1="28" y1="37" x2="70" y2="37" stroke="${S}" stroke-dasharray="3 3"/>
      <text x="12" y="62" font-family="M" font-weight="800" font-size="8" fill="${S}">1 · abierta, a 3 pasos</text>
      <rect x="104" y="72" width="16" height="10" rx="2" fill="${T}"/><path d="M90,92 H134" stroke="${N}" stroke-width="2"/><path d="M130,88 l5,4 l-5,4 M94,88 l-5,4 l5,4" fill="none" stroke="${N}" stroke-width="2"/>
      <text x="12" y="90" font-family="M" font-weight="800" font-size="8" fill="${S}">2 · de cerca, despacio ›</text>`,
    antes: () => `<g>${marco(70, 50, `<rect x="10" y="20" width="16" height="16" fill="#c9a77c"/><rect x="28" y="24" width="14" height="12" fill="#d8b98f"/>`)}<text x="35" y="62" text-anchor="middle" font-family="M" font-weight="800" font-size="8" fill="${S}">antes</text></g>
      <g transform="translate(80,0)">${marco(70, 50, `<rect x="22" y="14" width="26" height="22" fill="#fff" stroke="${T}"/><rect x="28" y="20" width="14" height="12" fill="#9aa1aa"/><rect x="14" y="36" width="42" height="10" fill="#222"/>`)}<text x="35" y="62" text-anchor="middle" font-family="M" font-weight="800" font-size="8" fill="${S}">después</text></g>
      <path d="M60,86 l12,0 M66,80 l0,12" stroke="${N}" stroke-width="3"/><text x="78" y="90" font-family="M" font-weight="800" font-size="8" fill="${S}">misma marca, misma altura</text>`,
    caminar: () => `<rect x="0" y="0" width="150" height="100" rx="6" fill="#f6f2f9"/>
      <circle cx="60" cy="20" r="9" fill="${P}" stroke="${T}" stroke-width="1.4"/><path d="M60,29 L60,56 M60,56 L50,70 L54,88 M60,56 L72,68 L70,88" fill="none" stroke="${T}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M60,36 L72,44 L82,40 M60,36 L70,46 L82,42" fill="none" stroke="${T}" stroke-width="2.4" stroke-linecap="round"/><rect x="80" y="34" width="12" height="10" rx="2" fill="${T}"/>
      <path d="M100,70 H138" stroke="${N}" stroke-width="2.5"/><path d="M133,65 l6,5 l-6,5" fill="none" stroke="${N}" stroke-width="2.5"/>
      <text x="98" y="88" font-family="M" font-weight="800" font-size="8" fill="${S}">pasos cortitos</text>`,
    grupo: () => marco(150, 100, `<rect x="52" y="8" width="46" height="30" rx="3" fill="#fff" stroke="${T}"/><rect x="62" y="14" width="26" height="20" fill="#9aa1aa"/><rect x="40" y="38" width="70" height="14" fill="#222"/>
      ${[24, 48, 72, 96, 120].map(x => persona(x, 54, .62)).join('')}${[14, 36, 58, 80, 102, 124, 140].map(x => persona(x, 70, .7)).join('')}`),
  };
  document.querySelectorAll('.dib').forEach(el => { const f = DIB[el.dataset.d]; if (f) el.innerHTML = `<svg width="150" height="100" viewBox="0 0 150 100">${f()}</svg>`; });
})();
