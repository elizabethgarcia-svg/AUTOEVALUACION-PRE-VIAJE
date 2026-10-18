// Renderiza todos los cuadros con Chromium y los entrega a ffmpeg por tubería.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn } = require('child_process');
(async () => {
  const [,, dir, salida, desde = '0', hasta = ''] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => { console.log('ERROR:', e.message); process.exit(1); });
  await p.goto('file://' + dir + '/video.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const total = await p.evaluate(() => window.TOTAL);
  const n0 = Math.round(+desde * 30), n1 = hasta ? Math.round(+hasta * 30) : Math.floor(total * 30);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', salida], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = n0; i < n1; i++) {
    await p.evaluate(t => window.render(t), i / 30);
    const img = await p.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`cuadro ${i}/${n1}  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  console.log('listo', salida);
})();
