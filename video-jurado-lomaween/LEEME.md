# Video para el jurado · Centinelas: Misión LOMAween

`Muestra_Video_Jurado_Centinelas_WhatsApp.mp4` es la muestra (1:16) que enseña dónde entra cada Centinela en el video final. Los recuadros "AQUÍ ENTRA SU VIDEO" se cambian por sus grabaciones.

El guion completo está en el documento "Guion del video para el jurado".

## Cómo se arma (carpeta `fuente/`)

1. `globo.py` hace los cuadros del zoom satelital hasta TROB Loretito (21.9895 N, 102.2471 O). Usa la textura Blue Marble de la NASA del paquete npm `three-globe`.
2. `voces.py` genera las llamadas de radio de "Base Centinela" con Kokoro TTS y efecto de radio.
3. `muestra.html` es la animación (1280x720, 30 fps). `render_m.js <salida.mp4> <desde> <hasta>` la graba con Chromium y ffmpeg.
4. `musica_m.py` compone el swing de Halloween (original, sintetizado) y mezcla la música, los efectos y las voces.

La vista aérea y la foto nocturna de la entrada salen de la presentación de instalaciones; la imagen satelital lleva el crédito "Imágenes ©Google".
