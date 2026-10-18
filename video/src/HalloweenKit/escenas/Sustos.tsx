// Escena 2 · "Los únicos sustos permitidos son los de Halloween… prevención, protocolo y cero excesos."
// Herramientas: desenfoque de movimiento en el fantasma, trazos a mano (rough-notation), neblina.
import { CameraMotionBlur } from "@remotion/motion-blur";
import { noise2D } from "@remotion/noise";
import { Circle, Highlight } from "@remotion/rough-notation";
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Entra, prog, useResorte } from "../animacion";
import { CALABAZA, cordillera, FANTASMA, SENALES } from "../arte";
import { Niebla } from "../herramientas/Niebla";
import { Subtitulos } from "../herramientas/Subtitulos";
import { COLOR, FUENTE, SOMBRA } from "../marca";
import { type Clip, momento, subtitulosDe } from "../voz";
import { AudioDelClip, Estrellas, Luna, Svg } from "./Cielo";

export const SUSTOS: Clip = { desde: 40.15, hasta: 49.85 };

const MONTANA = cordillera(650, [[70, 2, 0.6], [26, 6, 2]], 360);
const T_SUSTOS = momento("sustos", "los únicos") - 0.1;
const T_SON = momento("sustos", "son los de") - 0.1;
const T_VIAL = momento("sustos", "seguridad vial") - 0.4;
const T_SENAL = [momento("sustos", "prevención"), momento("sustos", "protocolo"), momento("sustos", "cero excesos")].map((x) => x - 0.1);
const ETIQUETAS = ["PREVENCIÓN", "PROTOCOLO", "CERO EXCESOS"];

// Va dentro de <CameraMotionBlur>: lee su propio cuadro para que cada muestra del desenfoque
// quede en un instante distinto.
const Fantasma: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resorte = useResorte();
  const t = SUSTOS.desde + frame / fps;
  const k = resorte(t, T_SUSTOS, true);
  const sale = prog(t, T_VIAL - 0.3, 0.35);
  const visible = Math.min(1, prog(t, T_SUSTOS, 0.2)) * (1 - sale);
  if (visible <= 0) return null;
  const x = 360 + noise2D("fantasma-x", t * 0.6, 0) * 50;
  const y = interpolate(k, [0, 1], [1100, 760]) + noise2D("fantasma-y", t * 0.8, 0) * 22 - sale * 520;
  const s = interpolate(k, [0, 1], [0.3, 1.15]);
  return (
    <Svg>
      <g
        opacity={visible}
        transform={`translate(${x},${y}) rotate(${noise2D("fantasma-r", t, 0) * 8}) scale(${s})`}
        dangerouslySetInnerHTML={{ __html: FANTASMA }}
      />
    </Svg>
  );
};

export const Sustos: React.FC<{ subtitulos: boolean }> = ({ subtitulos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resorte = useResorte();
  const t = SUSTOS.desde + frame / fps;
  const caps = useMemo(() => subtitulosDe(["sustos"], SUSTOS), []);
  const boo = resorte(t, T_SON - 0.25, true);
  const booFuera = prog(t, T_VIAL - 0.3, 0.35);
  const tiembla = t < T_SON + 0.2 ? Math.sin(t * 80) * 6 : 0;

  return (
    <AbsoluteFill style={{ background: "#07070B" }}>
      <AudioDelClip clip={SUSTOS} entrada={6} salida={20} />
      <Svg>
        <rect width="720" height="1280" fill="url(#gNoche)" />
        <Estrellas t={t} n={80} hastaY={620} semilla="sustos" />
        <Luna x={580} y={430} escala={0.7} />
        <path d={MONTANA} fill="#1A0D30" />
        <polygon points="332,650 388,650 980,1280 -260,1280" fill="#16151C" />
        <polygon points="334,650 340,650 -120,1280 -150,1280" fill="#fff" opacity={0.75} />
        <polygon points="380,650 386,650 870,1280 840,1280" fill="#fff" opacity={0.75} />
        {Array.from({ length: 9 }, (_, i) => {
          const s = (i / 9 + t * 0.32) % 1;
          const s2 = Math.min(1, s + 0.05);
          const [y1, y2] = [650 + 630 * s * s, 650 + 630 * s2 * s2];
          const [w1, w2] = [1 + 22 * s * s, 1 + 22 * s2 * s2];
          return <polygon key={i} fill="#FFC400" points={`${360 - w1},${y1} ${360 + w1},${y1} ${360 + w2},${y2} ${360 - w2},${y2}`} />;
        })}
        <ellipse cx="360" cy="660" rx="520" ry="70" fill="#C9B8FF" opacity={0.08} />
        {[[80, 1290, 0.7], [650, 1270, 0.62]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <g dangerouslySetInnerHTML={{ __html: CALABAZA }} />
            <ellipse cx="0" cy="-70" rx="150" ry="110" fill="url(#gGlowY)" opacity={0.28 + 0.2 * noise2D("vela", t * 3, i)} />
          </g>
        ))}
        {SENALES.map((senal, i) => {
          const k = resorte(t, T_SENAL[i], true);
          if (t < T_SENAL[i]) return null;
          return (
            <g
              key={i}
              opacity={Math.min(1, prog(t, T_SENAL[i], 0.2))}
              transform={`translate(${[130, 360, 590][i]},${780 + (1 - k) * 120}) scale(${Math.max(0.001, k)}) rotate(${noise2D("senal", t, i) * 3})`}
              dangerouslySetInnerHTML={{ __html: senal }}
            />
          );
        })}
      </Svg>
      <Niebla arriba={880} opacidad={0.13} />

      <CameraMotionBlur shutterAngle={240} samples={8}>
        <Fantasma />
      </CameraMotionBlur>

      {boo > 0 && booFuera < 1 ? (
        <div
          style={{
            position: "absolute",
            top: 690,
            width: "100%",
            textAlign: "center",
            fontFamily: FUENTE.terror,
            fontSize: 225,
            color: COLOR.naranja,
            WebkitTextStroke: "9px #000",
            paintOrder: "stroke",
            opacity: 1 - booFuera,
            transform: `translateX(${tiembla}px) scale(${boo}) rotate(-6deg)`,
          }}
        >
          ¡BOO!
        </div>
      ) : null}

      <Entra t={t} en={SUSTOS.desde + 0.3} sale={T_VIAL - 0.2} style={{ top: 165 }}>
        <div style={{ fontFamily: FUENTE.texto, fontWeight: 900, fontSize: 66, lineHeight: 1.12, color: "#fff", textShadow: SOMBRA }}>
          LOS ÚNICOS SUSTOS
          <br />
          PERMITIDOS…
        </div>
      </Entra>
      <Entra t={t} en={T_SON} sale={T_VIAL - 0.2} escala={0.4} dy={0} giro={-8} rebote style={{ top: 345 }}>
        <div style={{ fontFamily: FUENTE.terror, fontSize: 104, letterSpacing: 3, color: COLOR.naranja, textShadow: "0 0 39px rgba(255,90,0,.7), 0 9px 0 #000" }}>
          ¡son los de Halloween!
        </div>
      </Entra>
      <Entra t={t} en={T_VIAL} escala={0.6} dy={0} rebote style={{ top: 160 }}>
        <div style={{ fontFamily: FUENTE.texto, fontWeight: 900, fontSize: 52, letterSpacing: 1, color: "#fff", textShadow: SOMBRA }}>
          TRABAJEMOS CON APEGO A LA
        </div>
        <div style={{ fontFamily: FUENTE.titulo, fontSize: 160, lineHeight: 1.15, color: "#fff", textShadow: SOMBRA }}>
          <Highlight color={COLOR.naranja} progress={prog(t, T_VIAL + 0.35, 0.6)} iterations={2}>
            SEGURIDAD VIAL
          </Highlight>
        </div>
      </Entra>
      {ETIQUETAS.map((texto, i) => (
        <Entra key={texto} t={t} en={T_SENAL[i] + 0.2} escala={0.5} dy={0} rebote style={{ top: 1500, left: [22, 367, 712][i], width: 345 }}>
          <span style={{ display: "inline-block", padding: "12px 21px", borderRadius: 999, background: "rgba(0,0,0,.78)", fontFamily: FUENTE.texto, fontWeight: 900, fontSize: 33, color: "#fff", whiteSpace: "nowrap" }}>
            {i === 2 ? (
              <Circle color={COLOR.amarillo} progress={prog(t, T_SENAL[i] + 0.6, 0.7)} strokeWidth={4} padding={{ top: 12, bottom: 12, left: 22, right: 22 }} iterations={2}>
                {texto}
              </Circle>
            ) : (
              texto
            )}
          </span>
        </Entra>
      ))}

      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 220px rgba(0,0,0,.6)`, pointerEvents: "none" }} />
      {subtitulos ? <Subtitulos captions={caps} /> : null}
    </AbsoluteFill>
  );
};
