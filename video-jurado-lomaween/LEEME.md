# Video para el jurado · Centinelas: Misión LOMAween

`Muestra_Completa_Video_Jurado.mp4` (3:20) junta la muestra 3 y las tomas falsas en un solo video.

`Muestra3_Video_Jurado_Centinelas_WhatsApp.mp4` es la muestra vigente (2:43): Catrina que se quema en brasas, logo Centinela en 3D que se enciende con chispas, la lotería de las misiones, los puntos de control en orden Trabajo en Equipo → Resultados → Pasión, la frase de los días difíciles, un fragmento del 877 (bienvenida, la casita, el Rescate Carretero, «Recordemos a quienes se fueron» y el regreso a casa con los niños), la llegada a destino y el cierre «Cambio y fuera» con el tracto 501 y su claxon. Los recuadros "AQUÍ ENTRA SU VIDEO" se cambian por las grabaciones.

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

La vista aérea y la foto nocturna de la entrada salen de la presentación de instalaciones; la imagen satelital lleva el crédito "Imágenes ©Google".
