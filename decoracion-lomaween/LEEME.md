# Decoración LOMAween · La 57 de las Ánimas

`Plan_Maestro_La57_de_las_Animas.pdf` (64 hojas) junta todo el proyecto en un solo documento:

1. Las bases del concurso y cómo cumplimos cada una.
2. Los objetivos, uno por valor, con su meta y su evidencia.
3. El plan estructurado: las fases, el cronograma y la organización del equipo.
4. El boceto a lápiz del altar y de la cabina.
5. El diseño de la cabina.
6. El guion de producción del video.
7. El anexo con todas las ilustraciones para imprimir (hojas 21 a 64).

`Plan_Decoracion_Actualizado.pdf` (6 hojas) es solo la parte de la decoración. Trae qué cambió, el recorrido, el altar armado como tracto, la tele, los letreros de los monitores, los escritorios con ofrenda, el papel picado en líneas y la lista de material.

## Para imprimir (carpeta `imprimir/`, todo en tamaño carta y a color)

| Archivo | Hojas | Qué es |
|---|---|---|
| `Tracto_Altar.pdf` | 12 | Calavera (hojas 1 a 4, 51 × 36 cm), parrilla (5 a 10, 57 × 51 cm) y los dos faros (11 y 12) |
| `Carretera_Mantel.pdf` | 6 | Tira de 152 × 18 cm con 3 tractos para el mantel negro |
| `Lapidas_Prevencion.pdf` | 8 | El panteón de los malos hábitos, una lápida por hoja |
| `Letreros_Carretera.pdf` | 6 | KM 57, placa de Aguascalientes, placa de Saltillo, Parador, Destinos y Cruce de ánimas |
| `Letreros_Monitores.pdf` | 8 | 4 letreros de 2 hojas: Zona de restricción, Zona sin cobertura, Estatus al cliente y Parada no autorizada |
| `Pantalla_877_con_ojos.jpg` | — | Para poner a pantalla completa en la tele |

Las piezas de varias hojas traen línea punteada para recortar, marcas negras para empalmar y un mapita con el lugar de cada hoja.

## Planos

En `planos/` están las imágenes del plan: los dos bocetos a lápiz (`0_boceto_altar.jpg` y `0_boceto_cabina.jpg`), el altar como tracto, la tele con el 877 y los letreros sobre los monitores.

`version-anterior/` guarda el primer plan, con alebrijes, el altar en la esquina de las cajas y el papel picado en X. Ya no se usa.

## Cómo se regeneran (carpeta `fuente/`)

Cada imprimible es una página HTML. `node pdf.js <pagina.html> <salida.pdf> [horizontal]` la convierte a PDF con Playwright.

- La parrilla va en vertical: `tracto.html?o=v`.
- La calavera y los faros van en horizontal: `tracto.html?o=h`.
- La carretera es `tracto.html?o=carretera`.
- Los planos sobre las fotos se hacen con los `.py`, que usan `planos.py`; `boceto.py` pasa los planos a lápiz.
- El plan maestro sale de `maestro.html`, `plan.html?maestro=9,…` y `guion.html?maestro=14,…`, unidos con `pdfunite` junto con los imprimibles.
