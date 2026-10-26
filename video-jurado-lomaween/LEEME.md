# Video para el jurado · Centinelas: Misión LOMAween

`Muestra2_Video_Jurado_Centinelas_WhatsApp.mp4` es la muestra 2 (2:17), la vigente: Catrina que se quema en brasas, logo Centinela con chispas, la lotería de las misiones, los puntos de control en orden Trabajo en Equipo → Resultados → Pasión, la frase de los días difíciles y un fragmento del 877. Los recuadros "AQUÍ ENTRA SU VIDEO" se cambian por las grabaciones.

`Muestra_Video_Jurado_Centinelas_WhatsApp.mp4` es la primera muestra (1:16).

`Loteria_Centinela_para_imprimir.pdf` trae las 10 tarjetas de misión y sus reversos, en tamaño carta, para que cada Centinela reciba la suya en cámara.

El guion completo está en el documento "Guion del video para el jurado".

## Cómo se arma (carpeta `fuente/`)

1. `globo.py` hace los cuadros del zoom satelital hasta TROB Loretito (21.9895 N, 102.2471 O). Usa la textura Blue Marble de la NASA del paquete npm `three-globe`.
2. `voces.py` genera las llamadas de radio de "Base Centinela" con Kokoro TTS y efecto de radio.
3. `muestra.html` es la animación de la primera muestra. La muestra 2 se arma con `m2_partes.py` (escenas) y `m2.js` (animación), con `catrina.js` y `loteria.js`; se graba con `PAGINA=muestra2.html node render_m.js <salida.mp4> <desde> <hasta>`.
4. `musica_m.py` compone el swing de Halloween (original, sintetizado); `musica_m2.py` hace el arreglo de la muestra 2 con la música de acción de la lotería y el audio del 877.
5. `pdf_cartas.js` genera el PDF de la lotería desde `cartas_imprimir.html`.

La vista aérea y la foto nocturna de la entrada salen de la presentación de instalaciones; la imagen satelital lleva el crédito "Imágenes ©Google".
