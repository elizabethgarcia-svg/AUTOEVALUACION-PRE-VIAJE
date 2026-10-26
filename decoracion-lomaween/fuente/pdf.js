// Convierte una página HTML de imprimibles a PDF tamaño carta: node pdf.js <pagina.html> <salida.pdf> [horizontal]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const [inp, out, hz] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage();
  p.on('pageerror', e => console.log('ERROR', e.message));
  await p.goto('file://' + __dirname + '/' + inp); await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => document.body.dataset.listo === '1', null, { timeout: 15000 }).catch(() => console.log('sin marca de listo'));
  await p.waitForTimeout(300);
  await p.pdf({ path: __dirname + '/' + out, format: 'Letter', landscape: hz === 'horizontal', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  await b.close();
})();
