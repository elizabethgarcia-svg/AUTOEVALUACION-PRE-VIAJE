// Dibujos de la muestra ilustrada de la grabación: el acomodo visto desde arriba y lo que ve la cámara en cada paso.
// Todo se dibuja en SVG; cada viñeta mide 320 × 180 (16:9, como el video).
const DG = (function () {
  const PIEL = '#f1c9a5', PELO = '#2b1d14', TINTA = '#221a2c';
  const ROL = { centinela: '#ff6a00', graba: '#1f5fae', dirige: '#7b2ff7', ayuda: '#1e8e4e', anota: '#5d5468', base: '#c62828' };

  // ---------- piezas sueltas ----------
  function globo(x, y, w, h, texto, cola, tam = 13, borde = TINTA) {
    const [tx, ty] = cola, cx = Math.min(Math.max(tx, x + 14), x + w - 14), base = ty > y + h ? y + h : y;
    const lineas = texto.split('\n');
    return `<g><path d="M${cx - 9},${base} L${tx},${ty} L${cx + 9},${base}" fill="#fff" stroke="${borde}" stroke-width="1.6" stroke-linejoin="round"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#fff" stroke="${borde}" stroke-width="1.6"/>
      <path d="M${cx - 8},${base} L${cx + 8},${base}" stroke="#fff" stroke-width="3"/>
      ${lineas.map((l, i) => `<text x="${x + w / 2}" y="${y + h / 2 + (i - (lineas.length - 1) / 2) * tam * 1.12 + tam * .36}" text-anchor="middle" font-family="G" font-size="${tam}" fill="${TINTA}">${l}</text>`).join('')}</g>`;
  }
  function tarjeta(x, y, w, h, cara, rot = 0) {   // cara: true = se ve la carta; false = boca abajo
    const c = `<g transform="translate(${x},${y}) rotate(${rot})">` + (cara
      ? `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="3" fill="#fbf3e4" stroke="${TINTA}" stroke-width="1.2"/>
         <rect x="${-w / 2 + 3}" y="${-h / 2 + 3}" width="${w - 6}" height="${h * .62}" rx="2" fill="#1E7FD6"/>
         <rect x="${-w * .28}" y="${-h * .22}" width="${w * .56}" height="${h * .26}" rx="2" fill="#fff"/><rect x="${-w * .2}" y="${-h * .17}" width="${w * .4}" height="${h * .14}" fill="#9aa1aa"/>
         <text x="0" y="${h / 2 - 5}" text-anchor="middle" font-family="M" font-weight="900" font-size="${w * .16}" fill="${TINTA}">EL TRACTO</text>`
      : `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="3" fill="#1b2340" stroke="${TINTA}" stroke-width="1.2"/>
         <circle cx="0" cy="0" r="${w * .24}" fill="none" stroke="#ff6a00" stroke-width="${w * .11}" stroke-dasharray="${w * 1.05} ${w * .5}"/>
         <text x="0" y="${h / 2 - 5}" text-anchor="middle" font-family="M" font-weight="900" font-size="${w * .14}" fill="#ffb300">LOTERÍA</text>`);
    return c + '</g>';
  }
  function mano(x, y, r = 7) { return `<circle cx="${x}" cy="${y}" r="${r}" fill="${PIEL}" stroke="${TINTA}" stroke-width="1"/>`; }
  function brazo(x1, y1, x2, y2, col, g = 11) { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${g}" stroke-linecap="round"/>`; }

  // ---------- el fondo: el altar visto por la cámara ----------
  function fondoAltar(dim = 1) {
    let s = `<defs><linearGradient id="luzv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6dc" stop-opacity=".55"/><stop offset=".6" stop-color="#fff6dc" stop-opacity="0"/></linearGradient></defs>
      <rect width="320" height="180" fill="#cfc9c1"/>`;
    const PP = ['#ffd23a', '#f2f2f2', '#2f8cff', '#ff3e7a', '#3fd06b', '#a34dff'];
    for (let i = 0; i < 16; i++) s += `<path d="M${6 + i * 20},2 h16 v12 l-8,4 l-8,-4 Z" fill="${PP[i % 6]}"/>`;
    s += `<line x1="0" y1="2" x2="320" y2="2" stroke="#fff" stroke-width="1"/>
      <rect x="128" y="34" width="64" height="34" rx="6" fill="#18141a"/><circle cx="160" cy="49" r="9" fill="#ead6b8"/><circle cx="157" cy="48" r="2.4" fill="#18141a"/><circle cx="163" cy="48" r="2.4" fill="#18141a"/>
      ${Array.from({ length: 12 }, (_, i) => { const a = Math.PI * i / 11; return `<circle cx="${160 - 38 * Math.cos(a)}" cy="${70 - 40 * Math.sin(a)}" r="4.5" fill="${i % 2 ? '#ff8a00' : '#ffa400'}"/>`; }).join('')}
      <rect x="122" y="68" width="76" height="60" rx="4" fill="#f4f4f2" stroke="#9aa1aa"/>
      ${Array.from({ length: 9 }, (_, i) => `<line x1="130" y1="${76 + i * 6}" x2="190" y2="${76 + i * 6}" stroke="#9aa1aa" stroke-width="2"/>`).join('')}
      <rect x="62" y="96" width="60" height="32" rx="3" fill="#f4f4f2"/><rect x="198" y="96" width="60" height="32" rx="3" fill="#f4f4f2"/>
      <rect x="70" y="104" width="44" height="18" rx="4" fill="#25272c"/><circle cx="82" cy="113" r="6" fill="#eef1f4"/><circle cx="96" cy="113" r="6" fill="#eef1f4"/>
      <rect x="206" y="104" width="44" height="18" rx="4" fill="#25272c"/><circle cx="224" cy="113" r="6" fill="#eef1f4"/><circle cx="238" cy="113" r="6" fill="#eef1f4"/>
      <rect x="50" y="128" width="220" height="52" fill="#141216"/>
      <rect x="0" y="0" width="320" height="180" fill="url(#luzv)"/>`;
    if (dim < 1) s += `<rect width="320" height="180" fill="#cfc9c1" opacity="${1 - dim}"/>`;
    return s;
  }

  // ---------- una persona de frente, de la cintura para arriba ----------
  function persona(cx, o = {}) {
    const col = o.camisa || ROL.centinela, cy = o.y || 70, k = o.s || 1;
    const S = v => v * k;
    let s = `<g>`;
    s += `<path d="M${cx - S(42)},200 C${cx - S(44)},${cy + S(36)} ${cx - S(30)},${cy + S(26)} ${cx},${cy + S(26)} C${cx + S(30)},${cy + S(26)} ${cx + S(44)},${cy + S(36)} ${cx + S(42)},200 Z" fill="${col}"/>`;
    s += `<rect x="${cx - S(6)}" y="${cy + S(14)}" width="${S(12)}" height="${S(14)}" fill="${PIEL}"/>`;
    // brazos según la pose
    const hom = [cx - S(36), cy + S(36)], homD = [cx + S(36), cy + S(36)];
    const p = o.pose || 'abajo';
    if (p === 'abajo') s += brazo(hom[0], hom[1], cx - S(44), 200, col, S(13)) + brazo(homD[0], homD[1], cx + S(44), 200, col, S(13));
    if (p === 'recibe') s += brazo(hom[0], hom[1], cx - S(44), 200, col, S(13)) + brazo(homD[0], homD[1], cx + S(66), cy + S(56), col, S(13)) + mano(cx + S(72), cy + S(58), S(7));
    if (p === 'tarjeta') s += brazo(hom[0], hom[1], cx - S(30), cy + S(92), col, S(13)) + brazo(homD[0], homD[1], cx + S(30), cy + S(92), col, S(13))
      + brazo(cx - S(30), cy + S(92), cx - S(21), cy + S(64), col, S(12)) + brazo(cx + S(30), cy + S(92), cx + S(21), cy + S(64), col, S(12))
      + tarjeta(cx, cy + S(60), S(40), S(54), true) + mano(cx - S(21), cy + S(62), S(6)) + mano(cx + S(21), cy + S(62), S(6));
    if (p === 'presenta') s += brazo(hom[0], hom[1], cx - S(56), cy + S(64), col, S(13)) + mano(cx - S(60), cy + S(62), S(7)) + brazo(homD[0], homD[1], cx + S(46), 200, col, S(13))
      + tarjeta(cx + S(50), cy + S(104), S(26), S(36), true, 8);
    if (p === 'pose') s += brazo(hom[0], hom[1], cx - S(80), cy + S(40), col, S(13)) + brazo(homD[0], homD[1], cx + S(80), cy + S(40), col, S(13))
      + mano(cx - S(86), cy + S(36), S(7)) + mano(cx + S(86), cy + S(36), S(7));
    if (p === 'pulgar') s += brazo(hom[0], hom[1], cx - S(44), 200, col, S(13)) + brazo(homD[0], homD[1], cx + S(52), cy + S(54), col, S(13))
      + `<rect x="${cx + S(46)}" y="${cy + S(36)}" width="${S(12)}" height="${S(16)}" rx="${S(4)}" fill="${PIEL}" stroke="${TINTA}" stroke-width="1"/><rect x="${cx + S(48)}" y="${cy + S(26)}" width="${S(6)}" height="${S(14)}" rx="${S(3)}" fill="${PIEL}" stroke="${TINTA}" stroke-width="1"/>`;
    // cabeza
    s += `<path d="M${cx - S(21)},${cy + S(2)} C${cx - S(24)},${cy - S(30)} ${cx + S(24)},${cy - S(30)} ${cx + S(21)},${cy + S(2)} Z" fill="${PELO}"/>
      <circle cx="${cx}" cy="${cy}" r="${S(19)}" fill="${PIEL}" stroke="${TINTA}" stroke-width="1"/>
      <path d="M${cx - S(19)},${cy - S(4)} C${cx - S(16)},${cy - S(22)} ${cx + S(16)},${cy - S(22)} ${cx + S(19)},${cy - S(4)} C${cx + S(8)},${cy - S(12)} ${cx - S(8)},${cy - S(12)} ${cx - S(19)},${cy - S(4)} Z" fill="${PELO}"/>`;
    if (o.flor !== false) s += `<circle cx="${cx + S(15)}" cy="${cy - S(14)}" r="${S(5.5)}" fill="#ff8a00"/><circle cx="${cx + S(15)}" cy="${cy - S(14)}" r="${S(2.2)}" fill="#ffd23a"/>`;
    const dx = o.mira === 'derecha' ? S(2.6) : o.mira === 'abajo' ? 0 : 0, dy = o.mira === 'abajo' ? S(2.5) : 0;
    s += `<circle cx="${cx - S(6.5) + dx}" cy="${cy - S(1) + dy}" r="${S(2.1)}" fill="${TINTA}"/><circle cx="${cx + S(6.5) + dx}" cy="${cy - S(1) + dy}" r="${S(2.1)}" fill="${TINTA}"/>`;
    s += o.habla ? `<ellipse cx="${cx}" cy="${cy + S(9)}" rx="${S(5)}" ry="${S(3.6)}" fill="#7a2b2b"/>` : `<path d="M${cx - S(6)},${cy + S(8)} Q${cx},${cy + S(13)} ${cx + S(6)},${cy + S(8)}" fill="none" stroke="${TINTA}" stroke-width="${S(1.6)}" stroke-linecap="round"/>`;
    if (o.audifonos) s += `<path d="M${cx - S(21)},${cy} C${cx - S(22)},${cy - S(30)} ${cx + S(22)},${cy - S(30)} ${cx + S(21)},${cy}" fill="none" stroke="#333" stroke-width="${S(3.5)}"/><rect x="${cx - S(25)}" y="${cy - S(6)}" width="${S(8)}" height="${S(14)}" rx="${S(3)}" fill="#333"/><rect x="${cx + S(17)}" y="${cy - S(6)}" width="${S(8)}" height="${S(14)}" rx="${S(3)}" fill="#333"/><path d="M${cx - S(21)},${cy + S(6)} Q${cx - S(18)},${cy + S(16)} ${cx - S(6)},${cy + S(14)}" fill="none" stroke="#333" stroke-width="${S(2)}"/>`;
    return s + '</g>';
  }

  // ---------- el acomodo visto desde arriba ----------
  function cabezaArriba(x, y, col, ang = -90, et = '', lado = 'der') {
    const a = ang * Math.PI / 180, nx = x + Math.cos(a) * 15, ny = y + Math.sin(a) * 15;
    let s = `<ellipse cx="${x}" cy="${y}" rx="22" ry="11" transform="rotate(${ang + 90} ${x} ${y})" fill="${col}"/><circle cx="${x}" cy="${y}" r="10" fill="${PELO}"/>
      <path d="M${nx},${ny} l${Math.cos(a + 2.6) * 7},${Math.sin(a + 2.6) * 7} l${Math.cos(a - 2.6) * 7 - Math.cos(a + 2.6) * 7},${Math.sin(a - 2.6) * 7 - Math.sin(a + 2.6) * 7} Z" fill="${PIEL}"/>`;
    if (et) { const [t1, t2] = et.split('\n'); const tx = lado === 'der' ? x + 30 : x - 30, an = lado === 'der' ? 'start' : 'end';
      s += `<text x="${tx}" y="${y - 2}" text-anchor="${an}" font-family="M" font-weight="900" font-size="12" fill="${col}">${t1}</text>` + (t2 ? `<text x="${tx}" y="${y + 13}" text-anchor="${an}" font-family="Inter" font-size="10.5" fill="${TINTA}">${t2}</text>` : ''); }
    return s;
  }
  function plano() {
    let s = `<rect width="720" height="420" rx="14" fill="#fbf6ee"/>
      <text x="22" y="30" font-family="M" font-weight="900" font-size="13" fill="#ff6a00" letter-spacing="1.5">VISTO DESDE ARRIBA</text>
      <rect x="270" y="26" width="180" height="56" rx="6" fill="#1b181d"/><rect x="310" y="30" width="100" height="40" rx="4" fill="#f4f4f2"/><text x="360" y="55" text-anchor="middle" font-family="M" font-weight="900" font-size="12" fill="#1b181d">ALTAR</text>
      <polygon points="360,318 222,104 498,104" fill="#ff6a00" opacity=".13"/><line x1="360" y1="318" x2="222" y2="104" stroke="#ff6a00" stroke-dasharray="5 4"/><line x1="360" y1="318" x2="498" y2="104" stroke="#ff6a00" stroke-dasharray="5 4"/>
      <text x="236" y="150" font-family="G" font-size="14" fill="#c94a00" transform="rotate(-57 236 150)">lo que ve la cámara</text>
      <line x1="300" y1="134" x2="300" y2="312" stroke="${TINTA}" stroke-width="1.2"/><path d="M296,140 l4,-8 l4,8 M296,306 l4,8 l4,-8" fill="none" stroke="${TINTA}" stroke-width="1.2"/>
      <text x="292" y="228" text-anchor="end" font-family="M" font-weight="800" font-size="11" fill="${TINTA}">3 pasos (2 m)</text>`;
    s += cabezaArriba(360, 122, ROL.centinela, 90, 'CENTINELA\n1 paso delante del altar', 'der');
    s += cabezaArriba(540, 132, ROL.ayuda, 180, 'QUIEN AYUDA\na la derecha,', 'der') + `<text x="570" y="158" font-family="Inter" font-size="10.5" fill="${TINTA}">fuera de la toma,</text><text x="570" y="171" font-family="Inter" font-size="10.5" fill="${TINTA}">con la tarjeta boca abajo</text>`;
    s += `<g transform="translate(520,150)">${tarjeta(0, 0, 14, 19, false, 20)}</g>`;
    s += `<rect x="344" y="314" width="32" height="12" rx="3" fill="#111"/><circle cx="360" cy="320" r="3" fill="#6fb6ff"/>
      <path d="M360,326 L344,352 M360,326 L376,352 M360,326 L360,354" stroke="#555" stroke-width="3"/>
      <text x="386" y="324" font-family="M" font-weight="900" font-size="12" fill="${ROL.graba}">CELULAR EN TRIPIÉ</text><text x="386" y="338" font-family="Inter" font-size="10.5" fill="${TINTA}">acostado, a la altura de los ojos</text>`;
    s += cabezaArriba(318, 370, ROL.graba, -90, 'QUIEN GRABA\ndetrás del celular', 'izq');
    s += cabezaArriba(452, 360, ROL.dirige, -110, 'QUIEN DIRIGE\njunto a la cámara', 'der');
    s += cabezaArriba(150, 320, ROL.anota, -60, 'QUIEN ANOTA\ncon la lista y la pluma', 'izq');
    s += `<rect x="230" y="398" width="260" height="17" rx="3" fill="#bfe3ff" stroke="#6aa9d8"/><text x="360" y="410" text-anchor="middle" font-family="M" font-weight="800" font-size="10" fill="#1f5fae">VENTANA O LÁMPARA (detrás de la cámara)</text>
      ${[-60, -20, 20, 60].map(dx => `<line x1="${360 + dx}" y1="396" x2="${360 + dx * .5}" y2="376" stroke="#f5b800" stroke-width="2" stroke-dasharray="3 3"/>`).join('')}`;
    return s;
  }

  // ---------- las viñetas: lo que ve la cámara en cada paso ----------
  const V = {
    claqueta: () => fondoAltar(.55) + persona(160, { flor: true, s: .9, y: 74 }) + `<rect width="320" height="180" fill="#cfc9c1" opacity=".35"/>
      <g transform="translate(150,104) rotate(-6)"><rect x="-74" y="-46" width="148" height="92" rx="4" fill="#fff" stroke="${TINTA}" stroke-width="1.4"/>
        <text x="0" y="-18" text-anchor="middle" font-family="M" font-weight="900" font-size="15" fill="${TINTA}">TOMA 9</text><text x="0" y="4" text-anchor="middle" font-family="G" font-size="16" fill="${TINTA}">La Arquitecta</text><text x="0" y="28" text-anchor="middle" font-family="G" font-size="16" fill="#c94a00">la 1</text></g>
      ${mano(70, 150, 15)}${mano(232, 148, 15)}<path d="M84,128 l8,-10 M98,134 l12,-6 M216,128 l-8,-10 M204,134 l-12,-6" stroke="${TINTA}" stroke-width="2" stroke-linecap="round"/>` + globo(176, 10, 136, 40, 'Toma nueve, La Arquitecta,\nla uno... 👏', [226, 60], 11.5),
    accion: () => fondoAltar() + persona(160, {}) + globo(8, 10, 92, 38, '¡Silencio...\n¡acción!', [-10, 70], 12.5, ROL.dirige) + `<text x="250" y="168" text-anchor="middle" font-family="G" font-size="13" fill="#fff">mil uno, mil dos...</text>`,
    entra: () => fondoAltar() + persona(150, { pose: 'recibe', mira: 'derecha' }) + brazo(330, 128, 236, 128, ROL.ayuda, 15) + mano(232, 128, 8) + tarjeta(226, 116, 26, 36, false, -10),
    muestra: () => fondoAltar() + persona(160, { pose: 'tarjeta', habla: true }) + globo(196, 12, 116, 40, '¡Me tocó\nEl Tracto!', [180, 62], 14),
    presenta: () => fondoAltar() + persona(160, { pose: 'presenta', habla: true }) + globo(186, 8, 128, 66, 'Si coordinamos rutas\nde miles de km, ¿cómo\nno íbamos a armar un\ntracto de cartón?', [178, 66], 10.5),
    pose: () => fondoAltar() + persona(160, { pose: 'pose' }) + `<text x="160" y="172" text-anchor="middle" font-family="G" font-size="14" fill="#fff">3 segundos quieta, como foto</text>`,
    corte: () => fondoAltar() + persona(160, { pose: 'abajo' }) + globo(8, 10, 132, 50, '¡Corte! Otra vez,\ncon más energía', [-10, 80], 12, ROL.dirige),
    revisa: () => `<rect width="320" height="180" fill="#2a2433"/>
      <g transform="translate(100,92) rotate(-4)"><rect x="-74" y="-44" width="148" height="88" rx="10" fill="#111"/><rect x="-66" y="-37" width="132" height="74" rx="4" fill="#cfc9c1"/>
        <g transform="translate(-66,-37) scale(.4125)">${fondoAltar()}${persona(160, { pose: 'tarjeta' })}</g><circle cx="0" cy="0" r="12" fill="#fff" opacity=".85"/><path d="M-4,-7 L8,0 L-4,7 Z" fill="#111"/></g>
      ${mano(30, 128, 12)}${mano(170, 128, 12)}
      <path d="M232,52 C232,24 288,24 288,52" fill="none" stroke="#ddd" stroke-width="6"/><rect x="224" y="48" width="16" height="26" rx="6" fill="#ddd"/><rect x="280" y="48" width="16" height="26" rx="6" fill="#ddd"/>
      <g transform="translate(222,96)"><rect width="84" height="70" rx="5" fill="#fbf6ee"/><rect x="30" y="-6" width="24" height="10" rx="3" fill="#888"/>
        <text x="8" y="22" font-family="G" font-size="12" fill="${TINTA}">T09 ✓</text><text x="8" y="38" font-family="G" font-size="12" fill="#c94a00">la 2 es</text><text x="8" y="53" font-family="G" font-size="12" fill="#c94a00">la buena</text></g>`,
    manos: () => { let s = `<rect width="320" height="180" fill="#8a5a2e"/>`; const C = ['#e6007e', '#ff6a00', '#ffc400', '#1e8e4e', '#00a3e0', '#7b2ff7'];
      for (let i = 0; i < 18; i++) s += `<rect x="40" y="${10 + i * 9}" width="240" height="9" fill="${C[i % 6]}"/>`;
      s += [0, 1, 2, 3].map(i => tarjeta(70 + i * 46, 60, 34, 46, false, -6 + i * 4)).join('') + tarjeta(200, 128, 34, 46, false, 8) + tarjeta(206, 124, 34, 46, false, 4)
        + brazo(330, 150, 226, 132, ROL.base, 16) + mano(222, 132, 10) + brazo(-10, 170, 160, 74, ROL.base, 16) + mano(162, 72, 10);
      return s + globo(10, 120, 120, 44, 'cámara arriba,\nmirando a la mesa', [60, 108], 12); },
    voz: () => `<rect width="320" height="180" fill="#3a3341"/><rect x="0" y="0" width="90" height="180" fill="#5b4f66"/>${[10, 30, 50, 70].map(x => `<rect x="${x}" y="0" width="10" height="180" fill="#4d4357"/>`).join('')}`
      + persona(190, { camisa: ROL.base, mira: 'abajo', habla: true, flor: false })
      + `<rect x="138" y="72" width="16" height="28" rx="3" fill="#111" transform="rotate(-20 146 86)"/>` + brazo(156, 110, 142, 92, ROL.base, 12) + mano(142, 90, 6)
      + `<line x1="150" y1="66" x2="178" y2="70" stroke="#ffb300" stroke-width="1.6" stroke-dasharray="3 3"/><text x="140" y="60" font-family="G" font-size="12" fill="#ffd27a">un palmo</text>`
      + globo(216, 12, 98, 58, 'Base Centinela\na todas las\nunidades...', [206, 70], 11.5),
    diez4: () => `<rect width="320" height="180" fill="#2a3442"/><rect x="200" y="52" width="104" height="64" rx="4" fill="#111"/><rect x="206" y="58" width="92" height="52" fill="#30343b"/><rect x="236" y="116" width="32" height="16" fill="#111"/>
      <rect x="0" y="150" width="320" height="30" fill="#6b5a46"/>` + persona(120, { camisa: '#3a4a6b', pose: 'pulgar', audifonos: true, habla: true, flor: true }) + globo(176, 8, 90, 38, '¡10-4!', [156, 52], 17),
    frase: () => `<rect width="320" height="180" fill="#2a3442"/><rect x="214" y="56" width="96" height="60" rx="4" fill="#111"/><rect x="220" y="62" width="84" height="48" fill="#30343b"/>
      <rect x="0" y="150" width="320" height="30" fill="#6b5a46"/>` + persona(128, { camisa: '#3a4a6b', habla: true, audifonos: true })
      + globo(176, 10, 138, 40, 'Ningún viaje se hace solo:\naquí todos jalamos parejo', [150, 56], 11),
    chocan: () => { let s = `<rect width="320" height="180" fill="#6b5a46"/><circle cx="160" cy="92" r="70" fill="#5c4d3b"/>`;
      const cols = [ROL.centinela, ROL.ayuda, ROL.dirige, ROL.graba, '#c62828', '#3a4a6b', '#e6007e', '#ffb300'];
      cols.forEach((c, i) => { const a = i / cols.length * Math.PI * 2, x = 160 + Math.cos(a) * 150, y = 92 + Math.sin(a) * 110;
        s += brazo(x, y, 160 + Math.cos(a) * 18, 92 + Math.sin(a) * 14, c, 18) + mano(160 + Math.cos(a) * 14, 92 + Math.sin(a) * 11, 10); });
      return s + globo(196, 8, 116, 36, '¡10-4!', [186, 52], 18) + `<text x="10" y="170" font-family="G" font-size="13" fill="#fff">grabado desde arriba</text>`; },
    mandar: () => `<rect width="320" height="180" fill="#e9f7ef"/><g transform="translate(160,92)"><rect x="-52" y="-84" width="104" height="168" rx="14" fill="#111"/><rect x="-46" y="-74" width="92" height="148" rx="6" fill="#fff"/>
        <rect x="-46" y="-74" width="92" height="22" fill="#128c7e"/><text x="-38" y="-59" font-family="M" font-weight="800" font-size="9" fill="#fff">Videos LOMAween</text>
        <rect x="-36" y="-40" width="72" height="26" rx="5" fill="#dcf8c6"/><text x="-30" y="-24" font-family="Inter" font-size="7.5" fill="#222">📄 T09_la2.mp4</text>
        <rect x="-36" y="-8" width="72" height="26" rx="5" fill="#dcf8c6"/><text x="-30" y="8" font-family="Inter" font-size="7.5" fill="#222">📄 T10_la1.mp4</text>
        <text x="0" y="44" text-anchor="middle" font-family="G" font-size="11" fill="#128c7e">como documento</text></g>`
      + globo(222, 20, 92, 46, 'Bloque A,\nT02 a T11', [210, 64], 12),
  };
  function vineta(nombre) { return `<svg viewBox="0 0 320 180" width="100%" style="display:block;border-radius:8px">${V[nombre]()}</svg>`; }
  return { vineta, plano, ROL, V };
})();
