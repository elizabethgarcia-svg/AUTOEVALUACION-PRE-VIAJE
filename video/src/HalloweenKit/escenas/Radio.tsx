// Escena 1 · "¡Atención, atención! Aquí Base Centinela…" en la Carretera 57 de noche.
// Herramientas: ecualizador con el audio real, neblina con ruido, subtítulos karaoke.
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Entra, prog } from "../animacion";
import { cordillera, ESCUDO_57, LLANTA, LLANTAS_X, RIN, TRAILER } from "../arte";
import { Ecualizador, nivel, useEspectro } from "../herramientas/Ecualizador";
import { LogoCentinela } from "../herramientas/LogoCentinela";
import { Niebla } from "../herramientas/Niebla";
import { Subtitulos } from "../herramientas/Subtitulos";
import { BRILLO, COLOR, FUENTE, SOMBRA } from "../marca";
import { AUDIO, type Clip, momento, subtitulosDe } from "../voz";
import { AudioDelClip, Estrellas, Luna, Svg } from "./Cielo";

export const RADIO: Clip = { desde: 0, hasta: 8.45 };

const MONTANA_LEJOS = cordillera(820, [[90, 2, 1], [40, 5, 2.2]], 720);
const MONTANA_CERCA = cordillera(880, [[60, 3, 0.3], [24, 7, 1.7]], 720);

export const Radio: React.FC<{ subtitulos: boolean }> = ({ subtitulos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = RADIO.desde + frame / fps;
  const espectro = useEspectro(AUDIO, Math.round(t * fps));
  const voz = nivel(espectro);
  const habla = t > 1.5 && t < 7.8 && voz > 0.2;
  const caps = useMemo(() => subtitulosDe(["radio"], RADIO), []);

  const tLl = momento("radio", "llamando") - 0.1;
  const tDiez = momento("radio", "diez") - 0.1;
  const tCop = momento("radio", "¿Me copian") - 0.1;
  const bote = Math.sin(t * 9) * 1.2 + Math.sin(t * 23) * 0.5;
  const giro = (t * 520) % 360;
  const panel = prog(t, 0.15, 0.5);

  return (
    <AbsoluteFill style={{ background: "#07070B" }}>
      <AudioDelClip clip={RADIO} entrada={1} />
      <Svg>
        <rect width="720" height="1280" fill="url(#gNoche)" />
        <Estrellas t={t} n={110} hastaY={820} semilla="radio" />
        <Luna x={560} y={470} />
        <path d={MONTANA_LEJOS} fill="#2B1650" transform={`translate(${-((t * 14) % 720)},0)`} />
        <path d={MONTANA_CERCA} fill="#170C2C" transform={`translate(${-((t * 36) % 720)},0)`} />
        <g transform={`translate(${820 - 170 * t},760)`} dangerouslySetInnerHTML={{ __html: ESCUDO_57 }} />
        <rect x="0" y="898" width="720" height="200" fill="#18171E" />
        <rect x="0" y="900" width="720" height="5" fill="#fff" opacity={0.75} />
        <rect x="0" y="1084" width="720" height="6" fill="#FFC400" opacity={0.85} />
        <g fill="#fff" opacity={0.85} transform={`translate(${-((t * 650) % 120)},0)`}>
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={-120 + i * 120} y="1042" width="64" height="7" rx="2" />
          ))}
        </g>
        <rect x="0" y="1090" width="720" height="190" fill="#0D0A12" />
        <polygon points="666,928 980,850 980,1030" fill="url(#gBeam)" transform={`translate(0,${bote})`} />
        <g transform={`translate(38,${770 + bote})`}>
          <g dangerouslySetInnerHTML={{ __html: TRAILER }} />
          <g transform="translate(86,114) scale(.27)">
            <LogoCentinela />
          </g>
          {LLANTAS_X.map((x) => (
            <g key={x} transform={`translate(${x},222)`}>
              <g dangerouslySetInnerHTML={{ __html: LLANTA }} />
              <g transform={`rotate(${giro})`} dangerouslySetInnerHTML={{ __html: RIN }} />
            </g>
          ))}
        </g>
        <circle cx="667" cy={928 + bote} r="40" fill="url(#gGlowW)" />
      </Svg>
      <Niebla arriba={1020} opacidad={0.11} />

      {/* Panel de radio: las barras y la luz TX responden a la voz real */}
      <div
        style={{
          position: "absolute",
          left: 54,
          top: 84,
          width: 972,
          height: 294,
          borderRadius: 39,
          boxSizing: "border-box",
          background: "rgba(10,8,18,.78)",
          border: `4.5px solid ${COLOR.naranja}`,
          boxShadow: `0 0 ${57 + voz * 40}px rgba(255,90,0,${0.35 + voz * 0.4}), inset 0 0 45px rgba(255,90,0,.12)`,
          opacity: panel,
          transform: `translateY(${(1 - panel) * -60}px) scale(${0.92 + 0.08 * panel})`,
        }}
      >
        <svg width="210" height="285" viewBox="0 0 140 190" style={{ position: "absolute", left: 18, top: 0 }}>
          <path d="M70,150 C40,150 50,168 30,168 C10,168 20,186 0,186" stroke="#55575E" strokeWidth="5" fill="none" />
          <rect x="38" y="30" width="64" height="122" rx="26" fill="#1D1F25" stroke="#3A3D45" strokeWidth="3" />
          <path d="M54,56 H86 M54,68 H86 M54,80 H86 M54,92 H86" stroke="#3F434C" strokeWidth="4" strokeLinecap="round" />
          <rect x="98" y="70" width="10" height="38" rx="4" fill={COLOR.naranja} />
          <circle cx="70" cy="122" r="8" fill={habla ? "#FF2D2D" : "#4A1010"} />
        </svg>
        <div style={{ position: "absolute", left: 222, top: 36, fontFamily: FUENTE.texto, fontWeight: 900, fontSize: 60, color: "#fff", letterSpacing: 1 }}>
          BASE CENTINELA
        </div>
        <div style={{ position: "absolute", left: 225, top: 114, fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 32, color: COLOR.naranjaClaro, letterSpacing: 3 }}>
          CANAL 10-28 · CARRETERA 57
        </div>
        <div style={{ position: "absolute", left: 225, top: 170 }}>
          <Ecualizador espectro={t > 1.4 ? espectro : null} />
        </div>
        <div style={{ position: "absolute", right: 36, top: 190, fontFamily: FUENTE.texto, fontWeight: 900, fontSize: 38, color: "#FF2D2D", opacity: habla ? 1 : 0.3 }}>
          ● TX
        </div>
      </div>

      <Entra t={t} en={1.5} sale={tLl - 0.05} escala={1.6} dy={0} rebote style={{ top: 430 }}>
        <div style={{ fontFamily: FUENTE.titulo, fontSize: 168, lineHeight: 1, color: "#fff", textShadow: BRILLO }}>
          ¡ATENCIÓN,
          <br />
          ATENCIÓN!
        </div>
      </Entra>
      <Entra t={t} en={tLl} style={{ top: 450 }}>
        <div style={{ fontFamily: FUENTE.texto, fontWeight: 800, fontSize: 60, letterSpacing: 3, color: "#fff", textShadow: SOMBRA }}>
          LLAMANDO A TODOS LOS
        </div>
      </Entra>
      <Entra t={t} en={tDiez} escala={0.3} dy={0} rebote style={{ top: 515 }}>
        <div style={{ fontFamily: FUENTE.titulo, fontSize: 370, lineHeight: 1, color: COLOR.naranja, textShadow: BRILLO }}>10-28</div>
      </Entra>
      <Entra t={t} en={tCop} escala={0.4} dy={0} giro={-12} rebote style={{ top: 950 }}>
        <span
          style={{
            display: "inline-block",
            transform: "rotate(-4deg)",
            padding: "15px 39px",
            borderRadius: 999,
            background: "#fff",
            color: "#111",
            fontFamily: FUENTE.texto,
            fontWeight: 900,
            fontSize: 54,
          }}
        >
          ¿ME COPIAN?
        </span>
      </Entra>

      {subtitulos ? <Subtitulos captions={caps} /> : null}
    </AbsoluteFill>
  );
};
