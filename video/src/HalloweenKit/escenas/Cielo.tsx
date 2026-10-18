// Piezas compartidas por las escenas: lienzo SVG, audio del clip, estrellas y luna.
import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, random, useVideoConfig } from "remotion";
import { DEFS, LUNA } from "../arte";
import { AUDIO, type Clip } from "../voz";

// Lienzo en coordenadas del video original (720×1280) que llena el cuadro a cualquier tamaño.
export const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 720 1280" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
    <defs dangerouslySetInnerHTML={{ __html: DEFS }} />
    {children}
  </svg>
);

export const cuadros = (clip: Clip, fps: number) => Math.round((clip.hasta - clip.desde) * fps);

// Recorta el tramo del audio original, con entrada y salida suaves (en cuadros).
export const AudioDelClip: React.FC<{ clip: Clip; entrada?: number; salida?: number }> = ({
  clip,
  entrada = 4,
  salida = 6,
}) => {
  const { fps } = useVideoConfig();
  const n = cuadros(clip, fps);
  return (
    <Audio
      src={AUDIO}
      trimBefore={Math.round(clip.desde * fps)}
      trimAfter={Math.round(clip.hasta * fps)}
      volume={(f) =>
        interpolate(f, [0, entrada, n - salida, n], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

export const Estrellas: React.FC<{ t: number; n: number; hastaY: number; semilla: string }> = ({ t, n, hastaY, semilla }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const r = (k: string) => random(`${semilla}-${k}-${i}`);
      return (
        <circle
          key={i}
          cx={r("x") * 720}
          cy={r("y") * hastaY}
          r={0.6 + r("r") * 1.8}
          fill="#fff"
          opacity={0.35 + 0.65 * Math.abs(Math.sin(t * (1 + r("v") * 3) + r("f") * 6))}
        />
      );
    })}
  </g>
);

export const Luna: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g>
    <circle cx={x} cy={y} r={260 * escala} fill="url(#gGlowW)" opacity={0.33} />
    <g transform={`translate(${x},${y}) scale(${escala})`} dangerouslySetInnerHTML={{ __html: LUNA }} />
  </g>
);
