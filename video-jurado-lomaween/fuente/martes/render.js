// Renderiza el video «Así se graba el martes» (1080x1920, 30 fps) y lo entrega a ffmpeg
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn } = require('child_process');
const fs = require('fs');
(async () => {
  const [,, salida, soloEscena] = process.argv;
  const dur = JSON.parse(fs.readFileSync(__dirname + '/aud/dur.json'));
  const largo = dur.map((d, i) => d + (i === 0 ? 2.2 : i === dur.length - 1 ? 1.6 : 1.0));
  fs.writeFileSync(__dirname + '/aud/largo.json', JSON.stringify(largo));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => { console.log('ERROR:', e.message); process.exit(1); });
  await p.goto('file://' + __dirname + '/escenas.html');
  await p.waitForFunction(() => document.body.dataset.listo === '1'); await p.waitForTimeout(400);
  if (soloEscena !== undefined) {  // vista previa: un cuadro por escena a la mitad
    for (let i = 0; i < largo.length; i++) { await p.evaluate(([i, t, T]) => render(i, t, T), [i, largo[i] - .1, largo[i]]); await p.screenshot({ path: `${__dirname}/prev/e${String(i).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 80 }); }
    await b.close(); return;
  }
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', salida], { stdio: ['pipe', 'inherit', 'inherit'] });
  let n = 0;
  for (let i = 0; i < largo.length; i++) {
    const cuadros = Math.round(largo[i] * 30);
    for (let f = 0; f < cuadros; f++, n++) {
      await p.evaluate(([i, t, T]) => render(i, t, T), [i, f / 30, largo[i]]);
      const img = await p.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
    }
    console.log('escena', i, 'lista,', n, 'cuadros');
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
})();
