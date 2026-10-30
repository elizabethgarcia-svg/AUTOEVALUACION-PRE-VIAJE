#!/bin/bash
# final4.html: la muestra 4 sin la marca de MUESTRA y con el subtítulo del título en una sola línea (para el render HD).
cd /tmp/claude-0/-home-user-AUTOEVALUACION-PRE-VIAJE/b599cfc6-b7b2-58da-82fa-6d7dac97df15/scratchpad/jurado/muestra
sed -e 's|<div id="marca">MUESTRA</div>|<div id="marca" style="display:none"></div>|' -e 's|</head>|<style>#titB{white-space:nowrap}</style></head>|' muestra4.html > final4.html
