// Neblina que se arrastra con ruido orgánico (@remotion/noise) en lugar de senos repetitivos.
import { noise3D } from "@remotion/noise";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export const Niebla: React.FC<{
  arriba?: number;
  bancos?: number;
  color?: string; // "r,g,b"
  opacidad?: number;
}> = ({ arriba = 1250, bancos = 10, color = "214,200,255", opacidad = 0.12 }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const t = frame / 150;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: bancos }, (_, i) => {
        const x = (i / (bancos - 1)) * width - 330 + noise3D("niebla-x", i, 0, t) * 260;
        const y = arriba + (i % 3) * 110 + noise3D("niebla-y", i, 0, t) * 70;
        const o = opacidad * (0.55 + 0.45 * noise3D("niebla-o", i, 0, t));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 680,
              height: 280,
              borderRadius: "50%",
              background: `radial-gradient(closest-side, rgba(${color},${o}), rgba(${color},0))`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
