// Subtítulos tipo karaoke (@remotion/captions): la palabra que se está diciendo se pinta naranja.
// Sirven para quien ve el video en WhatsApp sin sonido.
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, FUENTE } from "../marca";

export const Subtitulos: React.FC<{ captions: Caption[]; abajo?: number }> = ({
  captions,
  abajo = 150,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 1300 }),
    [captions],
  );
  const ms = (frame / fps) * 1000;
  const i = pages.findIndex((p, j) => {
    const fin = Math.min(pages[j + 1]?.startMs ?? Infinity, p.startMs + p.durationMs + 450);
    return ms >= p.startMs && ms < fin;
  });
  if (i < 0) return null;
  const pagina = pages[i];
  const entra = spring({
    frame: frame - (pagina.startMs / 1000) * fps,
    fps,
    config: { damping: 200 },
    durationInFrames: 8,
  });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: abajo }}>
      <div
        style={{
          maxWidth: 960,
          padding: "16px 34px",
          borderRadius: 30,
          background: "rgba(8,6,14,.74)",
          boxShadow: "0 12px 36px rgba(0,0,0,.45)",
          textAlign: "center",
          fontFamily: FUENTE.texto,
          fontWeight: 900,
          fontSize: 52,
          lineHeight: 1.22,
          color: "#fff",
          whiteSpace: "pre-wrap",
          opacity: entra,
          transform: `translateY(${interpolate(entra, [0, 1], [24, 0])}px)`,
        }}
      >
        {pagina.tokens.map((tk) => {
          const activa = ms >= tk.fromMs && ms < tk.toMs;
          return (
            <span
              key={tk.fromMs}
              style={{ color: activa ? COLOR.naranja : "#fff", opacity: activa || ms >= tk.toMs ? 1 : 0.55 }}
            >
              {tk.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
