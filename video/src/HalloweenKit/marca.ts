// Colores, tipografías y sombras del video Halloween · Equipo Centinela.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const COLOR = {
  naranja: "#FF5A00",
  naranjaClaro: "#FFB27A",
  amarillo: "#FFC400",
  verde: "#2ED573",
};

export const FUENTE = {
  titulo: "Anton",
  texto: "Montserrat",
  terror: "Creepster",
};

export const SOMBRA = "0 7px 0 rgba(0,0,0,.45), 0 0 39px rgba(0,0,0,.75)";
export const BRILLO =
  "0 0 27px rgba(255,90,0,.9), 0 0 69px rgba(255,90,0,.55), 0 9px 0 rgba(0,0,0,.5)";

// Mismas fuentes que el video original (SIL Open Font License), servidas desde public/.
const archivo = (nombre: string) =>
  staticFile(`halloween/fonts/${nombre}.woff2`);
loadFont({ family: FUENTE.titulo, url: archivo("anton-latin-400-normal") });
loadFont({ family: FUENTE.terror, url: archivo("creepster-latin-400-normal") });
for (const peso of ["700", "800", "900"]) {
  loadFont({
    family: FUENTE.texto,
    url: archivo(`montserrat-latin-${peso}-normal`),
    weight: peso,
  });
}
