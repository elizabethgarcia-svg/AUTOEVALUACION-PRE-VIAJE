// Renderiza un tramo de la muestra (1280x720, 30 fps) y lo entrega a ffmpeg.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn } = require('child_process');
(async () => {
  const [,, salida, desde, hasta] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  p.on('pageerror', e => { console.log('ERROR:', e.message); process.exit(1); });
  await p.goto('file://' + __dirname + '/' + (process.env.PAGINA || 'muestra.html'));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const n0 = Math.round(+desde * 30), n1 = Math.round(+hasta * 30);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', salida], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = n0; i < n1; i++) {
    await p.evaluate(async t => await window.renderAsync(t), i / 30);
    const img = await p.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`${salida}: cuadro ${i}/${n1}  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  console.log('listo', salida);
})();
