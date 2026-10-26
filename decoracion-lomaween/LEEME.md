# Decoración LOMAween · La 57 de las Ánimas

`Plan_Maestro_La57_de_las_Animas.pdf` (58 hojas) junta todo el proyecto en un solo documento:

1. Las bases del concurso y cómo cumplimos cada una.
2. Los objetivos, uno por valor, con su meta y su evidencia.
3. El plan estructurado: las fases, el cronograma y la organización del equipo.
4. El boceto a lápiz del altar y de la cabina.
5. El diseño de la cabina.
6. El guion de producción del video.
7. El anexo con todas las ilustraciones para imprimir: el tracto en tabloide (hojas 21 a 26) y lo demás en carta (27 a 58).

`Plan_Decoracion_Actualizado.pdf` (6 hojas) es solo la parte de la decoración. Trae qué cambió, el recorrido, el altar armado como tracto, la tele, los letreros de los monitores, los escritorios con ofrenda, el papel picado en líneas y la lista de material.

## Para imprimir (carpeta `imprimir/`, a color y al 100 %, sin ajustar a la hoja)

| Archivo | Hojas | Qué es |
|---|---|---|
| `Tracto_Tabloide.pdf` | 6 tabloide | Con las medidas reales (bloque de en medio 60 × 58 cm, bloques de los lados 38 × 28 cm). Hojas 1 a 4: la parrilla (53 × 56 cm) arriba y la calavera (53 × 26 cm) abajo, que se separan con tijera. Hojas 5 y 6: un faro de 38 × 26 cm en cada una |
| `Tracto_Altar.pdf` | 12 carta | La versión anterior en carta, con otras medidas. Ya no se usa |
| `Carretera_Mantel.pdf` | 6 | Tira de 152 × 18 cm con 3 tractos para el mantel negro |
| `Lapidas_Prevencion.pdf` | 8 | El panteón de los malos hábitos, una lápida por hoja |
| `Letreros_Carretera.pdf` | 6 | KM 57, placa de Aguascalientes, placa de Saltillo, Parador, Destinos y Cruce de ánimas |
| `Letreros_Monitores.pdf` | 8 | 4 letreros de 2 hojas: Zona de restricción, Zona sin cobertura, Estatus al cliente y Parada no autorizada |
| **`Impresion_Tabloide_Completa.pdf`** | **23 tabloide** | **Todo junto para la imprenta.** Hojas 1 a 6: el tracto. Hojas 7 a 10: las 8 lápidas, dos por hoja. Hojas 11 y 12: KM 57 con Cruce de ánimas, y las dos placas. Hojas 13 y 14: Destinos (verde) y Parador (azul) en grande, de 39 × 25 cm, uno por hoja. Hojas 15 a 18: un letrero de monitor por hoja. Hojas 19 a 21: la carretera del mantel. Hojas 22 y 23: la lotería. Las hojas carta van de dos en dos sin cambiar de tamaño, con la línea de corte entre las dos |
| `Pantalla_877_con_ojos.jpg` | — | Para poner a pantalla completa en la tele |

Las piezas de varias hojas traen línea punteada para recortar, marcas negras para empalmar y un mapita con el lugar de cada hoja.

## Planos

En `planos/` están las imágenes del plan: los dos bocetos a lápiz (`0_boceto_altar.jpg` y `0_boceto_cabina.jpg`), el altar como tracto, la tele con el 877 y los letreros sobre los monitores.

`version-anterior/` guarda el primer plan, con alebrijes, el altar en la esquina de las cajas y el papel picado en X. Ya no se usa.

## Cómo se regeneran (carpeta `fuente/`)

Cada imprimible es una página HTML. `node pdf.js <pagina.html> <salida.pdf> [horizontal]` la convierte a PDF con Playwright.

- El tracto en tabloide: `node pdf_tab.js "tabloide.html?o=v" …` (parrilla y calavera) y `node pdf_tab.js "tabloide.html?o=h" … horizontal` (faros), unidos con `pdfunite`.
- La versión carta anterior: `tracto.html?o=v` (parrilla) y `tracto.html?o=h` (calavera y faros).
- `imponer_tabloide.py` arma `Impresion_Tabloide_Completa.pdf`: mete el tracto y los letreros grandes (`senales.html?o=g`, con `pdf_tab.js … horizontal`) tal cual y acomoda de dos en dos, al 100 %, las demás hojas carta.
- La carretera es `tracto.html?o=carretera`.
- Los planos sobre las fotos se hacen con los `.py`, que usan `planos.py`; `boceto.py` pasa los planos a lápiz.
- El plan maestro sale de `maestro.html`, `plan.html?maestro=9,…` y `guion.html?maestro=14,…`, unidos con `pdfunite` junto con los imprimibles.
