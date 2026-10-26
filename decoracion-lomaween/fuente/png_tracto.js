// Renderiza cada pieza del tracto completa a PNG (para el plano del altar)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 1200 } });
  p.on('pageerror', e => console.log('ERROR', e.message));
  for (const n of ['parrilla', 'faroIzq', 'faroDer', 'calavera', 'carretera']) {
    await p.goto('file://' + __dirname + '/tracto.html?full=' + n);
    await p.waitForFunction(() => document.body.dataset.listo === '1');
    await (await p.$('svg.full')).screenshot({ path: __dirname + `/png/tr-${n}.png` });
  }
  await b.close();
})();
