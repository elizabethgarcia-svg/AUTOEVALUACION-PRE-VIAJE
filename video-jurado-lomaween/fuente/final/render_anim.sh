#!/bin/bash
# Renderiza en HD las partes animadas que se quedan de la muestra 4 (sin la marca de MUESTRA).
cd /tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/jurado/muestra
export PAGINA=final4.html
r(){ nice -n 5 node render_hd.js ../final/anim_$1.mp4 $2 $3; }
r A 0 26.4 & r B 26.4 41.0 & wait
r PC1 59.9 63.6 & r PC2 67.9 71.6 & r PC3 75.7 79.2 & wait
r LL 153.6 158.0 & r CI 161.0 167.6 & wait
echo TODO_LISTO
