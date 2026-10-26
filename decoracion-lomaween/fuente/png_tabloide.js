// Vistas completas de las piezas en tabloide (para revisar y para el plano)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1300, height: 1800 } });
  p.on('pageerror', e => console.log('ERROR', e.message));
  for (const n of ['calavera', 'lamina', 'faro', 'faroDer', 'parrilla']) {
    await p.goto('file://' + __dirname + '/tabloide.html?full=' + n);
    await p.waitForFunction(() => document.body.dataset.listo === '1');
    await (await p.$('svg.full')).screenshot({ path: __dirname + `/png/tab-${n}.png` });
  }
  await b.close();
})();
