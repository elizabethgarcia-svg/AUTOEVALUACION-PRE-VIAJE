# Video para el jurado · Centinelas: Misión LOMAween

`Muestra_Completa_Video_Jurado.mp4` (3:27) junta la muestra 4 y las tomas falsas en un solo video.

`Muestra4_Video_Jurado_Centinelas_WhatsApp.mp4` es la muestra vigente (2:50). Va así:

1. La Catrina que se quema en brasas y el logo Centinela en 3D que se enciende con chispas.
2. La bitácora con el recorrido del plan antes del sello de APROBADO: el boceto del altar se dibuja a lápiz, se llena de color y se hojea el plan maestro.
3. La lotería de las misiones.
4. Los puntos de control, en orden: Trabajo en Equipo, Resultados y Pasión.
5. La frase de los días difíciles.
6. Un fragmento del 877.
7. La llegada a destino.
8. El cierre «Cambio y fuera» con el tracto 501 y su claxon.

Los recuadros "AQUÍ ENTRA SU VIDEO" se cambian por las grabaciones.

`Guion_Produccion_Video.pdf` (12 hojas) dice qué grabar, quién, dónde, cómo y cuándo, pensado para quien nunca ha grabado:

- el plan de grabación por bloques del lunes 26 al miércoles 28;
- antes de grabar: los cuatro papeles del equipo, lo que se necesita, la claqueta casera y cómo preparar el celular (iPhone y Android);
- cada toma en 5 pasos, con dibujos de «así sí / así no»;
- las recetas de cada tipo de toma (de la A a la J);
- la lista de tomas T01 a T37 y la ficha de cada Centinela con sus frases;
- la lista del día de grabación, cómo mandar lo grabado y los errores que más pasan;
- la hoja de bolsillo para quien graba.

## Libreto de los Centinelas

`Libreto_Centinelas.pdf` (14 hojas) trae lo que dice y lo que hace cada quien en todo el video. Cada línea lleva una etiqueta:

- **DICE**: se dice en voz alta;
- **HACE**: se actúa sin hablar;
- **CANTA**: lo canta La Base, fuera de cuadro;
- **SOLO VOZ**: solo se graba la voz, para la radio;
- **IMAGEN**: nadie habla.

Las hojas van así:

1. El reparto, con un renglón para el nombre real y la carta de cada Centinela.
2. Cómo se canta la lotería y los 10 cantos, en el orden en que se reparten.
3. Cómo se entregan las tarjetas, paso a paso, con los tres casos especiales: La Base, Ojo de Halcón y El de la Llamada.
4. a 9. El guion completo, escena por escena.
10. a 14. La hoja de cada Centinela, para recortar.

## Muestra ilustrada del martes 27

Es para que el equipo vea cómo se actúa en cada toma antes de grabar.

- `Muestra_Ilustrativa_Grabacion_Martes.pdf` (4 hojas, tipo historieta). Trae el horario de la mañana, cómo se acomodan frente al altar visto desde arriba, los 5 papeles, lo que se revisa antes de la primera toma y las 4 reglas de oro. Luego vienen los 14 pasos con dibujo: los 8 de cada Centinela en el reclutamiento, las manos y la voz de La Base, el «¡10-4!», las frases de Trabajo en Equipo, el choque de manos y cómo mandar lo grabado. Cierra con qué hacer si algo sale mal.
- `Muestra_Ilustrativa_Martes_Video.mp4` (2:28, vertical para el celular). Son las mismas escenas, con voz que explica cada paso.

`Muestra_Tomas_Falsas.mp4` (0:37) es la muestra de las tomas falsas, que van después de «Cambio y fuera»: cámara VHS, claqueta, rebobinado, la toma trabada del 877 y, después de los créditos, el 877 abriendo los ojos. Lleva una cumbia original.

`Loteria_Centinela_para_imprimir.pdf` trae las 10 tarjetas de misión y sus reversos, en tamaño carta, para que cada Centinela reciba la suya en cámara.

El guion completo está en el documento "Guion del video para el jurado".

## Cómo se arma (carpeta `fuente/`)

1. `globo.py` hace los cuadros del zoom satelital hasta TROB Loretito (21.9895 N, 102.2471 O). Usa la textura Blue Marble de la NASA del paquete npm `three-globe`.
2. `voces.py` genera las llamadas de radio de "Base Centinela" con Kokoro TTS y efecto de radio.
3. `muestra.html` es la animación de la primera muestra. La muestra 2 se arma con `m2_partes.py` (escenas) y `m2.js` (animación), con `catrina.js` y `loteria.js`; se graba con `PAGINA=muestra2.html node render_m.js <salida.mp4> <desde> <hasta>`.
4. `musica_m.py` compone el swing de Halloween (original, sintetizado); `musica_m2.py` hace el arreglo de la muestra 2 con la música de acción de la lotería y el audio del 877.
5. `pdf_cartas.js` genera el PDF de la lotería desde `cartas_imprimir.html`.
6. Las tomas falsas son `tomas.html` (se graba con `PAGINA=tomas.html node render_m.js …`) y su cumbia, `musica_tomas.py`.
7. La muestra 4 intercala el recorrido del plan en la bitácora (31.5 s, 7 s): `plan_html.py` arma `muestra4.html` con `plan.js`, que recorre el resto del video. El audio es `musica_plan.py` y `empalme_audio.py` lo mete en la mezcla.
8. La muestra ilustrada del martes: el PDF sale de `decoracion-lomaween/fuente/muestra_martes.html`, con los dibujos de `dibujos_grabar.js`. El video está en `fuente/martes/`: `escenas.js` trae lo que sale en pantalla y lo que dice la voz, `voz.py` hace la voz con Kokoro (`ef_dora`), `render.js` graba `escenas.html` cuadro por cuadro y `audio.py` mezcla la voz con una marimba suave.

La vista aérea y la foto nocturna de la entrada salen de la presentación de instalaciones; la imagen satelital lleva el crédito "Imágenes ©Google".
