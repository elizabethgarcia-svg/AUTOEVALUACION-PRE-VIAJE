# Video Halloween · Equipo Centinela · Octubre 0 siniestros

**Archivo:** `Centinela_Halloween_0_Siniestros_v2.mp4` · vertical 720×1280 · 65.5 s · 12 MB (cabe en WhatsApp, límite 16 MB).

**Concepto:** "Una dona tiene forma de cero." La dona que se entrega al equipo es el recordatorio de la meta del mes: **cero siniestros**. El mensaje abre como una llamada de radio de la Base Centinela a los 10-28 y cierra con "Cambio y fuera".

## Guion (voz)

| Tiempo | Escena | Voz |
|---|---|---|
| 0:00 | Radio en la Carretera 57 de noche, tráiler "Equipo Centinela", escudo MEX 57 | ¡Atención, atención! Aquí Base Centinela, llamando a todos los 10-28. ¿Me copian? |
| 0:08 | Caja de donas: calaveritas y glaseadas, calabazas, telaraña | Esta temporada de Halloween y Día de Muertos les dejé algo dulce: una dona para cada uno. ¡Disfrútenla, se la ganaron! |
| 0:16 | La dona se convierte en el "0" de OCTUBRE · 0 · SINIESTROS | Pero fíjense bien: una dona tiene forma de cero. Y ese es nuestro número este mes: ¡cero siniestros! |
| 0:23 | Decoración de Día de Muertos: papel picado, arco de cempasúchil y altar | Este octubre vamos por dos victorias: ganar el concurso de decoración de oficinas de Grupo Loma, ¡y cerrar el mes sin un solo siniestro! |
| 0:32 | Command Center: Ruta 57 Querétaro–SLP–Matehuala–Saltillo, checklist | Cada alerta atendida a tiempo, cada llamada al operador, cada descanso respetado, es un 10-28 que regresa a casa con su familia. |
| 0:40 | Carretera de noche, fantasma "¡BOO!", señales Prevención · Protocolo · 100 km/h | En la carretera, los únicos sustos permitidos son los de Halloween. Trabajemos con apego a la seguridad vial: prevención, protocolo y cero excesos. |
| 0:49 | Logo Centinela con ondas de radar | Porque un Centinela nunca descansa: siempre vigila, siempre protege. Desde la cabina, protegemos cada kilómetro. |
| 0:57 | Amanecer en la 57, confeti de cempasúchil | ¡Vamos, equipo Centinela! ¡Este octubre, triunfamos! |
| 1:01 | Cierre con logo | Cambio y fuera. |

## Texto para acompañar el video en WhatsApp

> 🎃 ¡Equipo Centinela!
> Les dejé un detalle dulce en la cabina para recargar energía en esta temporada. 🍩
> Este octubre vamos por dos metas: ganar el concurso de decoración de oficinas de Grupo Loma 🏆 y cerrar el mes con cero siniestros. 🛡️
> Cada alerta atendida a tiempo cuenta. Vamos a elevar el nivel con prevención, protocolo y apego a la seguridad vial.
> Desde la cabina, protegemos cada kilómetro. ¡Vamos con todo! 📻

**v2:** el concurso es de decoración de oficinas (no de altares); se corrigió la voz, la tarjeta de la escena 4 y la insignia del final.

## Notas de producción

- **Voz:** sintetizada en español latino (Kokoro TTS, voz masculina `em_alex`). La radio del inicio y el "Cambio y fuera" llevan filtro de radio CB.
- **Música y efectos:** composición original generada por código (libre de derechos): clavecín y theremin de Halloween en re menor, marimba en el altar, final triunfal en re mayor, campana, estática y "roger beep" de radio, claxon de tráiler.
- **Ilustraciones:** todas vectoriales y originales. El logo Centinela se redibujó a partir de la imagen compartida. Las donas se dibujaron como las que se compraron (calaverita con corona de flores y glaseada clásica). No se usan personajes de la caja (Disney·Pixar), porque tienen derechos de autor.
- **Tipografías:** Anton, Montserrat y Creepster (licencia SIL Open Font License).

## Cómo volver a generarlo

En `fuente/`: `narracion.py` (voz + tiempos) → `exportar.py` (datos para la animación) → `musica.py` (música y mezcla) → `render.js` (cuadros con Chromium y ffmpeg). La animación completa está en `video.html` + `video.js`; cada texto aparece sincronizado con la frase exacta de la voz (`timeline.json`). Para cambiar la voz a femenina se usa `ef_dora` en `narracion.py`.
