// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";
import fs from "node:fs";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// El destello de luz (@remotion/effects) se dibuja con WebGL.
Config.setChromiumOpenGlRenderer("angle");

// Las sesiones de Claude en la nube no pueden descargar Chrome; ahí se usa el Chromium del contenedor.
const PW = "/opt/pw-browsers";
const chromiumLocal = fs.existsSync(PW)
  ? fs
      .readdirSync(PW)
      .filter((d) => d.startsWith("chromium_headless_shell-"))
      .map((d) => `${PW}/${d}/chrome-linux/headless_shell`)
      .find((p) => fs.existsSync(p))
  : undefined;
if (chromiumLocal) {
  Config.setBrowserExecutable(chromiumLocal);
}
