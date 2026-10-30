// Fotos sueltas de la composición para revisar: node snap.js t1 t2 ...
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('ERROR:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CONSOLA:', m.text()); });
  await p.goto('file://' + __dirname + '/comp.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  for (const t of process.argv.slice(2)) { await p.evaluate(async t => await window.renderAsync(t), +t); await p.screenshot({ path: `snap/s_${(+t).toFixed(2)}.jpg`, type: 'jpeg', quality: 80 }); }
  await b.close();
})();
