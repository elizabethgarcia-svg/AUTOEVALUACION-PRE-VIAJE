const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const [,, dir, ...ts] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('console', m => console.log('console:', m.text()));
  p.on('pageerror', e => console.log('ERROR:', e.message));
  await p.goto('file://' + dir + '/video.html');
  await p.evaluate(() => document.fonts.ready); await p.evaluate(() => Promise.all([...document.querySelectorAll('image')].map(i => new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = i.getAttribute('href'); })))); await p.waitForTimeout(500);
  for (const t of ts) {
    await p.evaluate(async t => await window.renderAsync(t), +t);
    await p.screenshot({ path: `${dir}/st_${(+t).toFixed(1).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 80 });
  }
  await b.close();
})();
