#!/usr/bin/env node
/* Extrae del HTML de la Consola del Centinela los datos que ve el operador
   y los deja en datos/cabina.json (+ CSV de revisión) y embebidos en index.html.
   Uso: node scripts/extraer-consola.js ruta/Consola_del_Centinela.html */
const fs = require('fs'), path = require('path');
const archivo = process.argv[2]; if (!archivo) { console.error('Uso: node scripts/extraer-consola.js <consola.html>'); process.exit(1); }
const html = fs.readFileSync(archivo, 'utf8');
function literal(nombre) {
  const m = new RegExp('(?:^|\\n)\\s*const ' + nombre + '\\s*=\\s*', 'm').exec(html); if (!m) return null;
  let i = m.index + m[0].length; const open = html[i]; const close = open === '[' ? ']' : '}'; let depth = 0, inStr = null, esc = false, j = i;
  for (; j < html.length; j++) { const c = html[j];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '/' && html[j + 1] === '/') { j = html.indexOf('\n', j); continue; }
    if (c === '/' && html[j + 1] === '*') { j = html.indexOf('*/', j) + 1; continue; }
    if (c === open) depth++; else if (c === close) { depth--; if (depth === 0) break; } }
  return new Function('return (' + html.slice(i, j + 1) + ')')();
}
const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const PARADAS = literal('PARADAS'), ZONAS = literal('ZONAS'), PUNTOS = literal('PUNTOS'), NOPARADA = literal('NOPARADA'), PROHIB = literal('PROHIB'),
      PERMANENTES = literal('PERMANENTES'), ESCALA = literal('ESCALA'), CLIENTES = literal('CLIENTES'), GAZ = literal('GAZ');

const tipoDe = n => { const s = n.toLowerCase(); if (/patio|cedis/.test(s)) return 'patio'; if (/pensi|pension|pits|xstop|gran tracto/.test(s)) return 'pensión'; if (/gas|oxxo|hidrosina|pemex|estacion de servicio|estación de servicio|cargo/.test(s)) return 'gasolinera'; return 'parador'; };
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const serviciosDe = (texto) => { const t = norm(texto), out = []; if (/pernoct/.test(t) && !/no pernoct|no autoriza pernocta/.test(t)) out.push('pernocta'); if (/aliment|comida|restaurante/.test(t)) out.push('alimentos'); if (/bano|baño/.test(t)) out.push('baño'); if (/combustible|gas/.test(t)) out.push('combustible'); if (/descanso/.test(t)) out.push('descanso'); return out; };
const puntoDe = p => PUNTOS.find(x => (x.lat === p.lat && x.lon === p.lon) || x.a.some(a => norm(p.nombre).includes(a)) || norm(x.n) === norm(p.nombre));

const paradas = PARADAS.map(p => {
  const pt = puntoDe(p); const rojo = /A52714/.test(p.style);
  return { id: slug(p.nombre), nombre: p.nombre.trim(), tipo: rojo ? 'patio' : tipoDe(p.nombre), region: p.region, estado: p.estado, lat: p.lat, lon: p.lon,
    nota: [p.nota, pt && pt.uso].filter(Boolean).join(' · '), ojo: pt ? pt.ojo || '' : '', servicios: serviciosDe((p.nota || '') + ' ' + (pt ? pt.uso : '')),
    zonas: pt ? pt.z : [], especial: /E65100/.test(p.style) ? 'con PM' : rojo ? 'cliente' : '' };
});
const zonas = ZONAS.map(z => ({ id: z.id, nombre: z.n, tipo: z.tipo, desde: z.d, hasta: z.h, estados: z.est || [], regla: z.regla }));
const clave = n => (norm(n).match(/[a-z]{4,}/g) || []).filter(w => !['parador', 'restaurantes', 'carr'].includes(w))[0] || norm(n);
const prohibidos = NOPARADA.map(x => ({ nombre: x.t, detalle: x.d }));
PROHIB.forEach(p => { const n = prohibidos.find(x => clave(x.nombre) === clave(p.n)); if (n) { n.lat = p.lat; n.lon = p.lon; } else prohibidos.push({ nombre: p.n, detalle: '', lat: p.lat, lon: p.lon }); });
const puntosClave = PUNTOS.map(p => ({ nombre: p.n, alias: p.a, estado: p.e, lat: p.lat, lon: p.lon, zonas: p.z, uso: p.uso, ojo: p.ojo || '' }));
const reglas = PERMANENTES.map(x => ({ titulo: x.t, detalle: x.d }));
const escalamiento = ESCALA.map((e, i) => ({ nivel: i + 1, rol: e.rol, tel: e.tel, cuando: e.cuando }));
const clientes = CLIENTES.map(c => ({ nombre: c.n, alias: c.a, corredor: c.res, zonas: c.z, reglas: c.reglas }));
const lugares = GAZ.map(g => ({ nombre: g.n, alias: g.a, lat: g.lat, lon: g.lon, zonas: g.z, estado: g.e, tipo: g.tipo }));
const cabina = { origen: path.basename(archivo), extraido: new Date().toISOString(), paradas, zonas, prohibidos, puntosClave, reglas, escalamiento, clientes, lugares };

fs.writeFileSync('datos/cabina.json', JSON.stringify(cabina, null, 1));
const csv = (filas, cols) => [cols.join(','), ...filas.map(f => cols.map(c => '"' + String(Array.isArray(f[c]) ? f[c].join(' | ') : f[c] ?? '').replace(/"/g, '""') + '"').join(','))].join('\n');
fs.writeFileSync('datos/paradas-cabina.csv', '﻿' + csv(paradas, ['id', 'nombre', 'tipo', 'region', 'estado', 'lat', 'lon', 'servicios', 'nota', 'especial']));
fs.writeFileSync('datos/zonas-cabina.csv', '﻿' + csv(zonas, ['id', 'nombre', 'tipo', 'desde', 'hasta', 'estados', 'regla']));
fs.writeFileSync('datos/escalamiento-cabina.csv', '﻿' + csv(escalamiento, ['nivel', 'rol', 'tel', 'cuando']));

// Embebido en index.html entre marcadores
const idx = fs.readFileSync('index.html', 'utf8');
const bloque = '/* CABINA-INICIO (generado por scripts/extraer-consola.js, no editar a mano) */\nconst CABINA = ' + JSON.stringify(cabina) + ';\n/* CABINA-FIN */';
const re = /\/\* CABINA-INICIO[\s\S]*?\/\* CABINA-FIN \*\//;
if (!re.test(idx)) { console.error('index.html no tiene los marcadores CABINA-INICIO/FIN'); process.exit(1); }
fs.writeFileSync('index.html', idx.replace(re, () => bloque));
console.log('paradas', paradas.length, '| zonas', zonas.length, '| prohibidos', prohibidos.length, '| puntos clave', puntosClave.length, '| reglas', reglas.length, '| escalamiento', escalamiento.length, '| clientes', clientes.length, '| lugares', lugares.length, '| bytes embebidos', bloque.length);
