// El recorrido del plan dentro de la bitácora, antes del sello de APROBADO: el boceto se dibuja a lápiz,
// se llena de color y se hojea el plan maestro. Se intercala en 31.5 s y dura 7 s; el resto del video se recorre.
(function () {
  const A = 31.5, INS = 7.0;
  const PAG = ['01', '03', '04', '05', '08', '09', '11', '20', '25', '39'];
  const CHIPS = [[1, 'Las bases'], [2, 'Los objetivos'], [3, 'El plan'], [4, 'El boceto'], [5, 'El diseño'], [7, 'Las ilustraciones']];  // [página del plan, letrero]
  // hojeo: 11 vueltas (la del boceto y una por página) que se van acelerando
  const VUELTAS = []; { let t = 3.2; for (let i = 0; i < 11; i++) { const d = .42 * Math.pow(.88, i); VUELTAS.push([t, t + d]); t += d; } }
  const $ = id => document.getElementById(id);
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const pr = (t, a, b) => cl((t - a) / (b - a));
  const eo = k => 1 - Math.pow(1 - cl(k), 3), ei = k => Math.pow(cl(k), 3);
  const eio = k => { k = cl(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
  const lerp = (a, b, k) => a + (b - a) * k;
  const tw = (s, k) => s.slice(0, Math.floor(s.length * cl(k)));

  const async0 = window.renderAsync;
  window.TOTAL = window.TOTAL + INS;
  const base = t0 => t0 < A ? t0 : t0 < A + INS ? A : t0 - INS;

  function escenaPlan(u) {
    // el subtítulo de la radio se va al entrar el plan y no regresa al salir
    if (u >= 0 && u < INS + .3) { const sb = $('sub'); if (u < .3) sb.style.opacity = 1 - u / .3; else sb.style.visibility = 'hidden'; }
    else $('sub').style.opacity = 1;
    const on = u >= 0 && u < INS;
    $('plan').style.visibility = on ? 'visible' : 'hidden';
    if (!on) return;
    // fondo que se oscurece y el documento que entra y sale
    const entra = eo(pr(u, 0, .5)), sale = eio(pr(u, 6.15, 6.95));
    $('plOsc').style.opacity = .84 * entra * (1 - sale);
    const doc = $('plDoc');
    doc.style.transform = `translate(${lerp(0, 60, sale)}px,${(1 - entra) * 460 + lerp(0, 40, sale)}px) rotate(${lerp(7, -2, entra) + lerp(0, -9, sale)}deg) scale(${lerp(.92, 1, entra) * lerp(1, .3, sale)})`;
    doc.style.opacity = 1 - pr(u, 6.75, 6.97);
    // el lápiz dibuja el boceto de arriba hacia abajo
    const k = pr(u, .45, 2.25), img = $('plImgBoc'), col = $('plImgCol');
    img.style.clipPath = `inset(0 0 ${(1 - eio(k)) * 100}% 0)`;
    const lap = $('plLapiz'), dib = u >= .45 && u < 2.3;
    lap.style.visibility = dib ? 'inherit' : 'hidden';
    if (dib) {
      const box = [36, 64, 308, 410], y = box[1] + box[3] * eio(k), x = box[0] + box[2] * (.5 + .46 * Math.sin(u * 23) * Math.sin(u * 3.1 + 1));
      lap.style.transform = `translate(${x}px,${y}px) rotate(${-38 + 6 * Math.sin(u * 23)}deg)`;
    }
    // el boceto se llena de color desde el centro, como tinta
    const c = eo(pr(u, 2.25, 3.05));
    col.style.clipPath = `circle(${c * 75}% at 50% 55%)`;
    $('plBrillo').style.opacity = Math.sin(Math.PI * pr(u, 2.25, 3.1)) * .9;
    $('plBrillo').style.transform = `rotate(${u * 40}deg) scale(${lerp(.4, 1.4, c)})`;
    // hojeo de las páginas del plan
    let i = VUELTAS.findIndex(([a, b]) => u >= a && u < b); const fin = u >= VUELTAS[10][1];
    const ultima = fin ? 10 : i < 0 ? -1 : i;  // vuelta en curso
    const pagTop = $('plTop'), boc = $('plBoc'), sombra = $('plSombra');
    if (u < VUELTAS[0][0]) { boc.style.visibility = 'inherit'; boc.style.transform = 'none'; boc.style.opacity = 1; pagTop.style.visibility = 'hidden'; $('plUnder').style.visibility = 'hidden'; sombra.style.opacity = 0; }
    else {
      const [a, b] = VUELTAS[ultima], f = fin ? 1 : eio(pr(u, a, b));
      const turn = el => { el.style.transform = `perspective(1500px) rotateY(${-f * 180}deg)`; el.style.opacity = f < .5 ? 1 : 0; el.querySelector('.sh').style.opacity = f * .8; };
      boc.style.visibility = ultima === 0 && !fin ? 'inherit' : 'hidden';
      pagTop.style.visibility = ultima > 0 && !fin ? 'inherit' : 'hidden';
      const debajo = $('plUnder'); debajo.style.visibility = 'inherit';
      const sig = Math.min(ultima, 9); if (!debajo.src.endsWith(`pg-${PAG[sig]}.jpg`)) debajo.src = `plan/pg-${PAG[sig]}.jpg`;
      if (ultima === 0 && !fin) turn(boc);
      else if (!fin) { const im = $('plTopImg'); if (!im.src.endsWith(`pg-${PAG[ultima - 1]}.jpg`)) im.src = `plan/pg-${PAG[ultima - 1]}.jpg`; turn(pagTop); }
      sombra.style.opacity = fin ? 0 : Math.sin(Math.PI * f) * .45;
    }
    // letreros a mano y la lista de lo que trae el plan
    $('plT1').textContent = tw('Así empezamos:', pr(u, .55, 1.0));
    $('plT2').textContent = tw('con un boceto a lápiz…', pr(u, 1.0, 1.8));
    $('plT3').textContent = tw('…que se volvió nuestro altar', pr(u, 2.35, 3.0));
    $('plT4').textContent = tw('…y un plan con todo:', pr(u, 3.3, 3.9));
    $('plLetra').style.opacity = 1 - pr(u, 6.1, 6.5);
    // la página k se descubre al empezar la vuelta k; su letrero entra ahí y se ilumina mientras se ve
    const pagActual = u < VUELTAS[0][0] ? -1 : fin ? 9 : ultima;
    CHIPS.forEach(([p], j) => {
      const el = $('plC' + j), t0 = VUELTAS[p][0], kk = eo(pr(u, t0, t0 + .25)), vis = u >= t0;
      el.style.opacity = vis ? kk * (1 - pr(u, 6.1, 6.5)) : 0; el.style.transform = `translateX(${(1 - kk) * 40}px)`;
      const hasta = j + 1 < CHIPS.length ? CHIPS[j + 1][0] : 99;
      el.classList.toggle('act', vis && pagActual >= p && pagActual < hasta);
    });
    $('plGrano').style.backgroundPosition = `${Math.floor(Math.random() * 640)}px ${Math.floor(Math.random() * 360)}px`;
  }

  // window.render no se toca: render() es global en m2.js y renderAsync lo llama por dentro
  window.renderAsync = async t0 => {
    await async0(base(t0)); escenaPlan(t0 - A);
    await Promise.all([...$('plan').querySelectorAll('img')].map(i => i.decode().catch(() => {})));
  };
})();
