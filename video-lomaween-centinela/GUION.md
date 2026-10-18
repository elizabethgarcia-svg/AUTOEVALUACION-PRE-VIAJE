# "La entrega más importante" · Video LOMAween · Equipo Blindaje Centinela

Video reflexivo para la **tele de la cabina** durante la visita de los hijos de los colaboradores (viernes 30 de octubre, 16:00–17:00, Patio Loretito). Mensaje para que las familias se lo transmitan al operador: **maneja con calma, descansa cuando tengas sueño y el celular, guardado.**

| Archivo | Uso | Formato |
|---|---|---|
| `La_Entrega_Mas_Importante_TV_1080p.mp4` | Tele de la cabina (USB, laptop por HDMI) | 1920×1080 · 2:11 · 36 MB |
| `La_Entrega_Mas_Importante_WhatsApp.mp4` | Compartir por WhatsApp | 1280×720 · 2:11 · 15 MB |

Lleva **subtítulos grandes** de toda la narración, para que el mensaje llegue aunque haya ruido o la tele esté sin volumen. Está pensado para repetirse en loop.

## Guion

| Tiempo | Escena | Voz |
|---|---|---|
| 0:02 | Radio en la Carretera 57 de noche, tráiler "Equipo Centinela" | *(Base Centinela, por radio)* ¡Atención, atención! Aquí Base Centinela, llamando a todas las familias de nuestros 10-28. ¿Nos copian? |
| 0:11 | Casa de noche, un niño espera en la ventana | Cada noche, en muchas casas de nuestra gran familia Grupo Loma, alguien mira por la ventana, esperando a que papá o mamá regrese de la carretera. |
| 0:22 | Carretera con pétalos de cempasúchil y postes de kilometraje | En Día de Muertos, los pétalos de cempasúchil marcan el camino de regreso a casa. En la cabina Centinela, nosotros también cuidamos ese camino, kilómetro a kilómetro. |
| 0:34 | La cabina decorada: pantallas, papel picado, Centinelas con diadema | Somos los Centinelas: un equipo que, desde una cabina llena de pantallas, acompaña a cada operador en su viaje, de día y de noche. Centinelas de Ruta, Centinelas de Seguridad y Rescates Carreteros: siempre atentos, siempre listos. |
| 0:50 | Command Center con 3 alertas: velocidad, somnolencia, celular | Nuestras pantallas nos avisan si un tráiler va demasiado rápido, si el operador tiene sueño, o si se distrae con el celular. |
| 0:59 | Llamada Centinela ↔ operador: "¿Cómo vas, compañero?" → unidad en descanso | Entonces llamamos: ¿cómo vas, compañero? A veces, solo necesita descansar un poco. Y eso también es cuidarlo. |
| 1:09 | Pizarrón de corcho con dibujos y 3 notas | Pero el cuidado más importante empieza en casa. Por eso hoy te pedimos algo muy especial: cuando abraces a papá o a mamá, recuérdale tres cosas. Maneja con calma. Descansa cuando tengas sueño. Y el celular, guardado. |
| 1:28 | Placa "Mini Centinela" | Desde hoy, tú también eres un Mini Centinela. Tu misión es recordárselo cada vez que salga de casa. |
| 1:36 | Dibujo con crayones de la familia | Y dile que tú eres su razón más grande para regresar. |
| 1:41 | Amanecer: el tráiler llega a casa, claxon, abrazo | Porque no hay entrega más importante, que llegar a casa. |
| 1:48 | Logo Centinela, veladoras LED y cempasúchil | Recordamos a quienes se fueron, y cuidamos a quienes regresan. Desde la cabina, protegemos cada kilómetro, para que cada noche, la familia esté completa. |
| 1:59 | Cierre por radio | *(Base Centinela, por radio)* Base Centinela a todas las familias: gracias por cuidarlos con nosotros. Cambio y fuera. |

## Notas de producción

- **Voces:** sintetizadas en español latino (Kokoro TTS). Narradora cálida `ef_dora`; la radio de Base Centinela usa `em_alex` con filtro de radio CB, igual que el video de la dona.
- **Música y efectos:** composición original generada por código, libre de derechos. Piano y guitarra en Fa mayor, caja de música en la parte de los niños y cuerdas en el regreso a casa. Efectos: estática y "roger beep" de radio, grillos, pitidos de alerta, timbre de llamada, pájaros al amanecer y claxon del tráiler.
- **Ilustraciones:** vectoriales y originales, con la paleta de la decoración propuesta (cempasúchil, papel picado, veladoras). Sin elementos de miedo, pensado para niños. El letrero "ÁREA DE BLINDAJE CENTINELA" sigue la imagen de la propuesta de decoración.
- **Tipografías:** Anton, Montserrat, Gochi Hand y Patrick Hand (SIL Open Font License).

## Cómo volver a generarlo

En `fuente/`: `narracion.py` (voces y tiempos) → `exportar.py` (datos para la animación) → `musica.py` (música y mezcla) → `render.js` (cuadros 1920×1080 con Chromium y ffmpeg).
