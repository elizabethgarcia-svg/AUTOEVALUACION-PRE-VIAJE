// Graba un tramo de comp.html a 1920x1080, 30 fps: node render_comp.js salida.mp4 desde hasta
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn } = require('child_process');
(async () => {
  const [,, salida, desde, hasta] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => { console.log('ERROR:', e.message); process.exit(1); });
  await p.goto('file://' + __dirname + '/comp.html');
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const n0 = Math.round(+desde * 30), n1 = Math.round(+hasta * 30);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', salida], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = n0; i < n1; i++) {
    await p.evaluate(async t => await window.renderAsync(t), i / 30);
    const img = await p.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    if ((i - n0) % 300 === 0) console.log(`${salida}: ${i - n0}/${n1 - n0} cuadros, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  console.log('listo', salida);
})();
