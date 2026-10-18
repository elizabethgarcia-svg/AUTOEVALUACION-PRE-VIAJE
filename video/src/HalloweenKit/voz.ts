// Tiempos de la voz (timeline.json, generado por narracion.py del video original).
import type { Caption } from "@remotion/captions";
import { staticFile } from "remotion";
import timeline from "./timeline.json";

// Audio final del video v2 (voz + música + efectos).
export const AUDIO = staticFile("halloween/voz-y-musica.mp3");

// Un tramo del audio original: segundos [desde, hasta).
export type Clip = { desde: number; hasta: number };

const linea = (escena: string) => {
  const l = timeline.lineas.find((x) => x.escena === escena);
  if (!l) throw new Error(`Escena desconocida: ${escena}`);
  return l;
};

// Segundo exacto en que la voz dice `fragmento` dentro de la escena.
export const momento = (escena: string, fragmento: string) => {
  for (const f of linea(escena).frases) {
    const i = f.texto.indexOf(fragmento);
    if (i >= 0) return f.inicio + ((f.fin - f.inicio) * i) / f.texto.length;
  }
  throw new Error(`${escena}: no se encontró "${fragmento}"`);
};

// La voz se sintetizó con la pronunciación escrita; en pantalla va la ortografía real.
const ESCRITURA: [RegExp, string][] = [
  [/Jálouin/g, "Halloween"],
  [/diez veintiocho/g, "10-28"],
];

// Subtítulos palabra por palabra de unas escenas, con tiempos relativos al inicio del clip.
// Cada frase se reparte entre sus palabras según su largo.
export const subtitulosDe = (escenas: string[], clip: Clip): Caption[] => {
  const caps: Caption[] = [];
  for (const escena of escenas) {
    for (const frase of linea(escena).frases) {
      let texto = frase.texto;
      for (const [patron, real] of ESCRITURA) texto = texto.replace(patron, real);
      const palabras = texto.split(" ");
      const letras = palabras.reduce((n, p) => n + p.length + 1, 0);
      let t = frase.inicio;
      for (const p of palabras) {
        const d = ((frase.fin - frase.inicio) * (p.length + 1)) / letras;
        caps.push({
          text: (caps.length ? " " : "") + p,
          startMs: Math.round((t - clip.desde) * 1000),
          endMs: Math.round((t + d - clip.desde) * 1000),
          timestampMs: null,
          confidence: null,
        });
        t += d;
      }
    }
  }
  return caps;
};
