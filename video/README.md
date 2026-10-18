# Videos con Remotion

Proyecto de video hecho con [Remotion](https://www.remotion.dev): cada video es código React, se previsualiza en vivo y se exporta a MP4.

## Comandos

```console
npm i                                    # instalar (una vez)
npm run dev                              # abrir Remotion Studio (vista previa en vivo)
npx remotion render Muestra-Herramientas # exportar la muestra Halloween a out/
npm run lint                             # revisar el código
```

En las sesiones de Claude en la nube, `remotion.config.ts` usa el Chromium del contenedor porque ahí no se puede descargar Chrome.

## Kit Halloween · Equipo Centinela (`src/HalloweenKit/`)

`Muestra-Herramientas` (1080×1920, 25 s) aplica las herramientas a tres escenas del video *Halloween Equipo Centinela* (rama `claude/compassionate-einstein-eyikwb`), con su audio final y los tiempos exactos de la voz (`timeline.json` de `narracion.py`). En Studio se pueden prender o apagar los subtítulos desde el panel de propiedades.

| Herramienta | Paquete | Qué aporta al video | Dónde está |
|---|---|---|---|
| Subtítulos karaoke | `@remotion/captions` | La palabra que se dice se pinta naranja; sirve para ver el video en WhatsApp sin sonido. Se generan solos desde `timeline.json` y corrigen la ortografía ("Jálouin" → Halloween, "diez veintiocho" → 10-28). | `herramientas/Subtitulos.tsx`, `voz.ts` |
| Audio que mueve la imagen | `@remotion/media-utils` | Las barras del radio, la luz TX y las ondas del radar del logo se mueven con el audio real, no con una simulación. | `herramientas/Ecualizador.tsx` |
| Neblina orgánica | `@remotion/noise` | Niebla que se arrastra sin repetirse; también hace flotar al fantasma y titilar las calabazas. | `herramientas/Niebla.tsx` |
| Desenfoque de movimiento | `@remotion/motion-blur` | El fantasma sale disparado con estela, como en cámara real. | `escenas/Sustos.tsx` |
| Trazos a mano | `@remotion/rough-notation` | Subrayado naranja en "SEGURIDAD VIAL" y círculo en "CERO EXCESOS", dibujados en sincronía con la voz. | `escenas/Sustos.tsx` |
| Destello de luz | `@remotion/effects` | Destello cálido que tapa el corte entre escenas. | `herramientas/DestelloDeLuz.tsx` |
| Transiciones | `@remotion/transitions` | Barrido de radar (reloj) entre escenas; hay otras 18: `fade`, `slide`, `wipe`, `film-burn`, `ripple`, `zoom-blur`… | `MuestraHerramientas.tsx` |
| Trazado de rutas | `@remotion/paths` | La Carretera 57 Querétaro → Saltillo se dibuja sola y la unidad avanza sobre ella. | `escenas/Lema.tsx` |
| Fuentes locales | `@remotion/fonts` | Anton, Montserrat y Creepster cargadas desde `public/` (sin internet). | `marca.ts` |
| Recorte de audio | `@remotion/media` | Cada escena toma su tramo del audio original con entrada y salida suaves. | `escenas/Cielo.tsx` |

También quedan instalados, listos para usarse: `@remotion/shapes` (estrellas, corazones, polígonos), `@remotion/layout-utils` (ajustar textos al ancho), `@remotion/lottie` (animaciones de LottieFiles) y `@remotion/gif` (GIFs animados).

Las ilustraciones (`arte.ts`), el logo y las fuentes son las del video original. El audio (`public/halloween/voz-y-musica.mp3`) se extrajo del MP4 v2; se guarda en MP3 porque el Chromium de las sesiones en la nube no decodifica AAC.

## Skills de Remotion para Claude

`.claude/skills/remotion-*` (oficiales de Remotion, registradas en `skills-lock.json`) le enseñan a Claude a usar todo lo anterior: animación, subtítulos, audio, transiciones, mapas, render. Se actualizan con `npx skills update`.

## Licencia

Remotion es gratis para equipos de hasta 3 personas; empresas más grandes necesitan licencia: <https://www.remotion.pro/license>.
