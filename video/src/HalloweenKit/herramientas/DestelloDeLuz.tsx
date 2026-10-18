// Destello de luz cálida para cubrir un corte entre escenas (@remotion/effects, WebGL).
import { lightLeak } from "@remotion/effects/light-leak";
import React from "react";
import { interpolate, Solid, useCurrentFrame, useVideoConfig } from "remotion";

export const DestelloDeLuz: React.FC<{ semilla?: number; tono?: number }> = ({ semilla = 3, tono = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  return (
    <Solid
      width={width}
      height={height}
      effects={[
        lightLeak({
          seed: semilla,
          hueShift: tono,
          progress: interpolate(frame, [0, durationInFrames - 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }),
      ]}
    />
  );
};
