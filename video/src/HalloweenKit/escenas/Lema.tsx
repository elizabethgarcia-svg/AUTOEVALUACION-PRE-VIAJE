// Escena 3 · "Un Centinela nunca descansa… Desde la cabina, protegemos cada kilómetro."
// Herramientas: radar que late con la voz (audio real), ruta 57 que se traza sola (@remotion/paths).
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Entra, prog, useResorte } from "../animacion";
import { MONITORES } from "../arte";
import { nivel, useEspectro } from "../herramientas/Ecualizador";
import { LogoCentinela } from "../herramientas/LogoCentinela";
import { Subtitulos } from "../herramientas/Subtitulos";
import { COLOR, FUENTE, SOMBRA } from "../marca";
import { AUDIO, type Clip, momento, subtitulosDe } from "../voz";
import { AudioDelClip, Svg } from "./Cielo";

export const LEMA: Clip = { desde: 49.2, hasta: 57.45 };

const T_INICIO = momento("lema", "Porque") - 0.2;
const T_VIGILA = momento("lema", "siempre vigila") - 0.1;
const T_PROTEGE = momento("lema", "siempre protege") - 0.1;
const T_CABINA = momento("lema", "Desde la cabina") - 0.1;

// Carretera 57 estilizada, de Querétaro a Saltillo, en la franja superior.
const RUTA = "M70,190 C150,130 210,240 290,180 S440,120 520,185 S630,215 655,150";
const LARGO = getLength(RUTA);
const punto = (largo: number) => getPointAtLength(RUTA, largo) ?? { x: 0, y: 0 };
const CIUDADES: [string, number][] = [
  ["QUERÉTARO", 0],
  ["SAN LUIS POTOSÍ", 0.36],
  ["MATEHUALA", 0.66],
  ["SALTILLO", 1],
];

const arco = (r: number) => {
  const q = Math.PI / 180;
  return `M${r * Math.cos(-95 * q)},${r * Math.sin(-95 * q)} A${r},${r} 0 0 1 ${r * Math.cos(5 * q)},${r * Math.sin(5 * q)}`;
};

export const Lema: React.FC<{ subtitulos: boolean }> = ({ subtitulos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const resorte = useResorte();
  const t = LEMA.desde + frame / fps;
  const voz = nivel(useEspectro(AUDIO, Math.round(t * fps)));
  const caps = useMemo(() => subtitulosDe(["lema"], LEMA), []);

  const avance = prog(t, T_INICIO, LEMA.hasta - 0.8 - T_INICIO);
  const trazo = evolvePath(avance, RUTA);
  const cabeza = punto(Math.max(0.01, avance * LARGO));
  const logo = resorte(t, T_INICIO - 0.3);
  const radar = resorte(t, T_INICIO + 0.3, true);
  const negro = prog(t, LEMA.hasta - 0.45, 0.45);

  return (
    <AbsoluteFill style={{ background: "#0A0B0E" }}>
      <AudioDelClip clip={LEMA} entrada={20} salida={14} />
      <Svg>
        <g transform={`translate(${-(t - LEMA.desde) * 6},0)`} dangerouslySetInnerHTML={{ __html: MONITORES }} />
        <rect width="720" height="1280" fill="url(#gFondoMorado)" opacity={0.25} />
        <circle cx="360" cy="470" r={420} fill="url(#gGlowO)" opacity={0.25 + voz * 0.35} />

        {/* Ruta 57 */}
        <path d={RUTA} stroke="#1F2D47" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d={RUTA} stroke={COLOR.naranja} strokeWidth="20" fill="none" opacity={0.18} strokeLinecap="round" strokeDasharray={trazo.strokeDasharray} strokeDashoffset={trazo.strokeDashoffset} />
        <path d={RUTA} stroke={COLOR.naranja} strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray={trazo.strokeDasharray} strokeDashoffset={trazo.strokeDashoffset} />
        {CIUDADES.map(([nombre, f], i) => {
          const p = punto(f * LARGO);
          const alcanzada = avance >= f - 0.001;
          return (
            <g key={nombre}>
              <circle cx={p.x} cy={p.y} r={alcanzada ? 8 : 6} fill={alcanzada ? "#fff" : "#3A4560"} />
              <text
                x={p.x}
                y={p.y + (i % 2 ? -22 : 36)}
                textAnchor={i === 0 ? "start" : i === 3 ? "end" : "middle"}
                fontFamily={FUENTE.texto}
                fontWeight={800}
                fontSize={17}
                fill={alcanzada ? "#fff" : "#5D6B88"}
              >
                {nombre}
              </text>
            </g>
          );
        })}
        {avance > 0 ? (
          <g transform={`translate(${cabeza.x},${cabeza.y})`}>
            {[0, 1, 2].map((i) => {
              const k = ((t * 0.9 + i / 3) % 1 + 1) % 1;
              return <circle key={i} r={12 + k * 40} fill="none" stroke={COLOR.naranja} strokeWidth="3" opacity={1 - k} />;
            })}
            <circle r="12" fill={COLOR.naranja} stroke="#fff" strokeWidth="3" />
          </g>
        ) : null}

        {/* Logo con ondas de radar que laten con la voz */}
        <g transform={`translate(360,500) scale(${(0.7 + 0.3 * logo) * (1 + voz * 0.04)})`} opacity={Math.min(1, logo * 2)}>
          {[0, 1, 2].map((i) => {
            const k = ((t * 0.8 + i / 3) % 1 + 1) % 1;
            return (
              <path
                key={i}
                d={arco(80 + k * 260)}
                transform="translate(36,-40)"
                fill="none"
                stroke={COLOR.naranja}
                strokeLinecap="round"
                strokeWidth={5 + voz * 9}
                opacity={radar * (1 - k) * (0.35 + voz * 0.8)}
              />
            );
          })}
          <LogoCentinela radar={radar} />
        </g>
      </Svg>

      <Entra t={t} en={T_INICIO + 0.4} sale={T_CABINA - 0.2} style={{ top: 1060 }}>
        <div style={{ fontFamily: FUENTE.titulo, fontSize: 150, lineHeight: 1, textShadow: SOMBRA }}>
          <span style={{ color: "#fff" }}>UN CENTINELA</span>
          <br />
          <span style={{ color: COLOR.naranja }}>NUNCA DESCANSA</span>
        </div>
      </Entra>
      <Entra t={t} en={T_VIGILA} sale={T_CABINA - 0.2} dx={-120} dy={0} style={{ top: 1395 }}>
        <div style={{ fontFamily: FUENTE.texto, fontWeight: 900, fontSize: 63, color: "#fff", textShadow: SOMBRA }}>SIEMPRE VIGILA.</div>
      </Entra>
      <Entra t={t} en={T_PROTEGE} sale={T_CABINA - 0.2} dx={120} dy={0} style={{ top: 1479 }}>
        <div style={{ fontFamily: FUENTE.texto, fontWeight: 900, fontSize: 63, color: COLOR.naranja, textShadow: SOMBRA }}>SIEMPRE PROTEGE.</div>
      </Entra>
      {["DESDE LA CABINA,", "PROTEGEMOS", "CADA KILÓMETRO."].map((texto, i) => (
        <Entra key={texto} t={t} en={T_CABINA + [0, 0.45, 0.8][i]} style={{ top: 1080 + i * 114 }}>
          <div style={{ fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 90, color: i ? COLOR.naranja : "#fff", textShadow: SOMBRA }}>{texto}</div>
        </Entra>
      ))}

      {subtitulos ? <Subtitulos captions={caps} /> : null}
      <AbsoluteFill style={{ background: "#000", opacity: negro }} />
    </AbsoluteFill>
  );
};
