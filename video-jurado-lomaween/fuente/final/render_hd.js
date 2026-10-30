// Renderiza un tramo de una página de la muestra a 1920x1080 (escala 1.5), 30 fps, y lo entrega a ffmpeg.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn } = require('child_process');
(async () => {
  const [,, salida, desde, hasta] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  p.on('pageerror', e => { console.log('ERROR:', e.message); process.exit(1); });
  await p.goto('file://' + __dirname + '/' + (process.env.PAGINA || 'muestra4.html'));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  const n0 = Math.round(+desde * 30), n1 = Math.round(+hasta * 30);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', salida], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = n0; i < n1; i++) {
    await p.evaluate(async t => await window.renderAsync(t), i / 30);
    const img = await p.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  console.log('listo', salida);
})();
