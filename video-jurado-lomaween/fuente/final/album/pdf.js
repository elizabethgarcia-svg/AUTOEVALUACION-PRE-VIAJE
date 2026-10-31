// album.html → PDF horizontal tamaño carta, esperando a que carguen letras y fotos.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + __dirname + '/album.html', { waitUntil: 'networkidle' });
  await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
  await p.pdf({ path: process.argv[2], width: '11in', height: '8.5in', printBackground: true, preferCSSPageSize: true });
  await b.close(); console.log('listo', process.argv[2]);
})();
