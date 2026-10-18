// Barras de radio que se mueven con el audio real (@remotion/media-utils), no con una simulación.
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import React from "react";
import { useVideoConfig } from "remotion";
import { COLOR } from "../marca";

// Espectro del audio en `frame` (cuadro dentro del archivo de audio, no de la escena).
// Devuelve valores 0-1 en escala de decibeles: graves a la izquierda, agudos a la derecha.
export const useEspectro = (src: string, frame: number, muestras = 64) => {
  const { fps } = useVideoConfig();
  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({ src, frame, fps, windowInSeconds: 10 });
  if (!audioData) return null;
  return visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: muestras,
    optimizeFor: "speed",
    dataOffsetInSeconds,
  }).map((v) => Math.min(1, Math.max(0, (20 * Math.log10(v + 1e-6) + 62) / 50)));
};

// Nivel general (0-1) para encender luces, latidos, ondas de radar, etc.
export const nivel = (espectro: number[] | null, desde = 1, hasta = 14) =>
  espectro ? espectro.slice(desde, hasta).reduce((a, b) => a + b, 0) / (hasta - desde) : 0;

export const Ecualizador: React.FC<{
  espectro: number[] | null;
  barras?: number;
  alto?: number;
  ancho?: number;
  color?: string;
}> = ({ espectro, barras = 26, alto = 84, ancho = 12, color = COLOR.naranja }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 9, height: alto }}>
    {Array.from({ length: barras }, (_, i) => {
      // forma de espejo: graves al centro, agudos en las orillas
      const banda = 1 + Math.round(Math.abs(i - (barras - 1) / 2) * 1.1);
      const v = espectro ? espectro[banda] ?? 0 : 0;
      return (
        <div
          key={i}
          style={{ width: ancho, height: 9 + v * (alto - 9), borderRadius: ancho / 2, background: color, opacity: 0.45 + 0.55 * v }}
        />
      );
    })}
  </div>
);
