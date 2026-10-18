# Video LOMAween · Recorrido por el área de Blindaje Centinela

Video para la **tele de la cabina** durante la visita de los hijos de los colaboradores (viernes 30 de octubre, 16:00–17:00, Patio Loretito). El tractor **877** da la bienvenida y lleva a los niños de recorrido por lo que hace la cabina. El cierre deja un mensaje para que las familias se lo transmitan al operador: **maneja con calma, descansa cuando tengas sueño y el celular, guardado.**

| Archivo | Uso | Formato |
|---|---|---|
| `Centinela_LOMAween_TV_1080p.mp4` | Tele de la cabina (USB, laptop por HDMI) | 1920×1080 · 3:11 · 68 MB |
| `Centinela_LOMAween_WhatsApp.mp4` | Compartir por WhatsApp | 960×540 · 3:11 · 15 MB |

Lleva **subtítulos grandes** de toda la narración (excepto la frase final, que aparece en grande en pantalla), para que se entienda aunque haya ruido. Se puede repetir en loop.

## Guion

| Tiempo | Escena | Voz |
|---|---|---|
| 0:01 | El tractor 877 (con ojos y boca animados) da la bienvenida | *(877)* ¡Hola, hola, amiguitos! Yo soy el 877. Bienvenidos al área de Blindaje Centinela, donde desde la cabina cuidamos cada kilómetro. ¡Súbanse conmigo, vamos a dar un recorrido para que conozcan lo que hacemos! |
| 0:17 | Claxon y toma real del tráiler TROB en carretera | — |
| 0:20 | Radio de Base Centinela en la Carretera 57 de noche | *(Base Centinela, por radio)* ¡Atención, atención! Aquí Base Centinela, llamando a todas las familias de nuestros 10-28. ¿Nos copian? |
| 0:30 | Casa de noche, un niño espera en la ventana | Cada noche, en muchas casas de nuestra gran familia Grupo Loma, alguien mira por la ventana, esperando a que papá o mamá regrese de la carretera. |
| 0:40 | Carretera con pétalos de cempasúchil | En Día de Muertos, los pétalos de cempasúchil marcan el camino de regreso a casa. En la cabina Centinela, nosotros también cuidamos ese camino, kilómetro a kilómetro. |
| 0:52 | Pantalla grande con **tomas reales de la cabina** | Somos los Centinelas: un equipo que, desde una cabina llena de pantallas, acompaña a cada operador en su viaje, de día y de noche. Centinelas de Ruta, Centinelas de Seguridad y Rescates Carreteros: siempre atentos, siempre listos. |
| 1:09 | Celular con la Autoevaluación Pre-Viaje y sello APTO | Antes de cada viaje, cada operador hace su autoevaluación desde su celular: si durmió bien, cómo se siente, y si su tráiler está listo. Solo cuando todo está en orden, sale a la carretera. |
| 1:22 | Command Center con 3 alertas, tomas reales de fondo | Nuestras pantallas nos avisan si un tráiler va demasiado rápido, si el operador tiene sueño, o si se distrae con el celular. |
| 1:31 | Videollamada: Centinela de Seguridad ↔ operador de la unidad 877 | Entonces llamamos: ¿cómo vas, compañero? A veces, solo necesita descansar un poco. Y eso también es cuidarlo. |
| 1:41 | Camioneta de Rescate llega con un tráiler con intermitentes | Y si algo pasa en el camino, nuestros Rescates Carreteros salen de inmediato a ayudar. Porque en esta familia, nadie se queda solo en la carretera. |
| 1:51 | Pizarrón con las 3 notas | Pero el cuidado más importante empieza en casa. Por eso hoy te pedimos algo muy especial: cuando abraces a papá o a mamá, recuérdale tres cosas. Maneja con calma. Descansa cuando tengas sueño. Y el celular, guardado. |
| 2:10 | Placa "Mini Centinela" | Desde hoy, tú también eres un Mini Centinela. Tu misión es recordárselo cada vez que salga de casa. |
| 2:18 | Dibujo con crayones de la familia | Y dile que tú eres su razón más grande para regresar. |
| 2:23 | Logo Centinela con veladoras LED | Recordamos a quienes se fueron, y cuidamos a quienes regresan. Desde la cabina, protegemos cada kilómetro, para que cada noche, la familia esté completa. |
| 2:34 | El 877 se despide y toca el claxon | *(877)* ¡Gracias por acompañarme, Mini Centinelas! No olviden su misión: con calma, con descanso, y el celular, guardado. ¡Nos vemos en la carretera! |
| 2:47 | Radio de cierre | *(Base Centinela, por radio)* Base Centinela a todas las familias: gracias por cuidarlos con nosotros. Cambio y fuera. |
| 2:55 | Atardecer: dos niños corren a abrazar a su papá | Porque el viaje más importante es el regreso a casa, donde pueden sentir el calor de quienes más los necesitan. |

## Notas de producción

- **Personajes:** el tractor 877, la Centinela con diadema y el operador son las imágenes que compartió el equipo. Al 877 se le animaron el parpadeo y la boca, sincronizada con su voz.
- **Tomas reales:** salen de la grabación del video "Proyecto Centinela", recortadas para quitar el bisel del monitor y la barra de Windows (`fuente/extraer_tomas.py`).
- **Ilustración final:** original, inspirada en la idea compartida (niños corriendo a abrazar a su papá). No usa la imagen de referencia, porque es de otro creador y trae su marca de agua.
- **Voces:** sintetizadas en español latino (Kokoro TTS). El 877 usa `em_santa`, Base Centinela `em_alex` con filtro de radio y la narradora `ef_dora`.
- **Música y efectos:** composición original generada por código, libre de derechos. Piano, guitarra, caja de música y cuerdas; radio, grillos, alertas, timbre de llamada y claxon.
- **Tipografías:** Anton, Montserrat, Gochi Hand, Patrick Hand y Playfair Display (SIL Open Font License).

## Cómo volver a generarlo

En `fuente/`: `extraer_tomas.py` (tomas reales) → `narracion.py` (voces y tiempos) → `exportar.py` (datos para la animación) → `musica.py` (música y mezcla) → `render.js` (cuadros 1920×1080 con Chromium y ffmpeg).
