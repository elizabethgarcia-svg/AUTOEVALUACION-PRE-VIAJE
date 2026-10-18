// Logo Centinela en vector (mismo trazo que logo.js del video original):
// "C" naranja con relieve y semicírculo interior (radar).
import React, { useId } from "react";

const sectorAnular = (ro: number, ri: number, a0: number, a1: number) => {
  const r = Math.PI / 180;
  const P = (R: number, a: number) => `${R * Math.cos(a * r)},${R * Math.sin(a * r)}`;
  const grande = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${P(ro, a0)} A${ro},${ro} 0 ${grande} 0 ${P(ro, a1)} L${P(ri, a1)} A${ri},${ri} 0 ${grande} 1 ${P(ri, a0)} Z`;
};
const C = sectorAnular(175, 82, -118, -332);
const D = "M-10,-83 A61,61 0 0 0 82,3 Z";

// Dibuja centrado en (0,0), unos 360 px de ancho; `radar` (0-1) hace crecer el semicírculo.
export const LogoCentinela: React.FC<{ radar?: number }> = ({ radar = 1 }) => {
  const id = useId();
  const sD = `translate(36,-40) scale(${Math.max(0.001, radar)}) translate(-36,40)`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="-1" x2="0.4" y2="1">
          <stop offset="0" stopColor="#FF6A10" />
          <stop offset="1" stopColor="#FF5000" />
        </linearGradient>
      </defs>
      {Array.from({ length: 12 }, (_, k) => {
        const i = 12 - k;
        return (
          <g key={i} transform={`translate(${i},${i * 1.4})`} fill={i > 2 ? "#A93500" : "#D94600"}>
            <path d={C} />
            <path d={D} transform={sD} />
          </g>
        );
      })}
      <path d={C} fill={`url(#${id})`} />
      <path d={D} transform={sD} fill={`url(#${id})`} />
    </g>
  );
};
