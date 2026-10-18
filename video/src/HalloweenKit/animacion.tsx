// Ayudas de animación: todo se calcula a partir de `t`, el segundo del audio original,
// para que cada texto quede amarrado a la palabra exacta de la voz.
import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";

export const prog = (t: number, desde: number, dur: number) =>
  interpolate(t, [desde, desde + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const useResorte = () => {
  const { fps } = useVideoConfig();
  return (t: number, desde: number, rebote = false) =>
    spring({
      frame: Math.max(0, (t - desde) * fps),
      fps,
      config: rebote ? { damping: 9, stiffness: 150 } : { damping: 200 },
    });
};

// Bloque que entra en `en` (con resorte) y sale en `sale`.
export const Entra: React.FC<{
  t: number;
  en: number;
  sale?: number;
  dx?: number;
  dy?: number;
  escala?: number;
  giro?: number;
  rebote?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ t, en, sale, dx = 0, dy = 54, escala = 1, giro = 0, rebote, style, children }) => {
  const resorte = useResorte();
  const k = resorte(t, en, rebote);
  const fuera = sale === undefined ? 0 : prog(t, sale, 0.3);
  const visible = prog(t, en, 0.15) * (1 - fuera);
  if (visible <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: "100%",
        textAlign: "center",
        opacity: visible,
        transform: `translate(${(1 - k) * dx}px, ${(1 - k) * dy - fuera * 45}px) scale(${escala + (1 - escala) * k}) rotate(${(1 - k) * giro}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
