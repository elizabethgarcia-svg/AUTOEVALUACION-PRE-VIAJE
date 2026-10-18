// Muestra de herramientas sobre tres escenas del video Halloween · Equipo Centinela.
// Las escenas usan el audio final del video v2 y los tiempos exactos de la voz.
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { useVideoConfig } from "remotion";
import { z } from "zod";
import { cuadros } from "./escenas/Cielo";
import { LEMA, Lema } from "./escenas/Lema";
import { RADIO, Radio } from "./escenas/Radio";
import { SUSTOS, Sustos } from "./escenas/Sustos";
import { DestelloDeLuz } from "./herramientas/DestelloDeLuz";

export const esquemaMuestra = z.object({
  subtitulos: z.boolean(),
});

const BARRIDO = 20; // cuadros del barrido de radar entre "sustos" y "lema"

export const duracionMuestra = (fps: number) =>
  cuadros(RADIO, fps) + cuadros(SUSTOS, fps) + cuadros(LEMA, fps) - BARRIDO;

export const MuestraHerramientas: React.FC<z.infer<typeof esquemaMuestra>> = ({ subtitulos }) => {
  const { fps, width, height } = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Radio" durationInFrames={cuadros(RADIO, fps)}>
        <Radio subtitulos={subtitulos} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={30}>
        <DestelloDeLuz />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="Sustos" durationInFrames={cuadros(SUSTOS, fps)}>
        <Sustos subtitulos={subtitulos} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={clockWipe({ width, height })}
        timing={linearTiming({ durationInFrames: BARRIDO })}
      />
      <TransitionSeries.Sequence name="Lema" durationInFrames={cuadros(LEMA, fps)}>
        <Lema subtitulos={subtitulos} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
