// Renderiza cada letrero de monitor completo a PNG (para los planos)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 1500 } });
  await p.goto('file://' + __dirname + '/pantallas.html?full');
  await p.waitForFunction(() => document.body.dataset.listo === '1');
  const els = await p.$$('svg.full');
  for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: __dirname + `/png/mon-${i + 1}.png`, omitBackground: true });
  await b.close();
})();
