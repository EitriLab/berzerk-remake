import { ImageSource, Loader } from "excalibur";
import swordPath from "./images/sword.png"; // for rollup this is configured using the image() plugin
import vampiroPath from "./images/vampiro.png";
import chaoPath from "./images/chao.png";
import paredePath from "./images/parede.png";
import obstaculoPath from "./images/obstaculo.png";
import portaPath from "./images/porta.png";

// It is convenient to put your resources in one place
export const Resources = {
  Sword: new ImageSource(swordPath),
  Vampiro: new ImageSource(vampiroPath),
  Chao: new ImageSource(chaoPath),
  Parede: new ImageSource(paredePath),
  Obstaculo: new ImageSource(obstaculoPath),
  Porta: new ImageSource(portaPath),
} as const;

// We build a loader and add all of our resources to the boot loader
export const loader = new Loader();
loader.backgroundColor = "#0d0a10"; // tela de carregamento (antes era o azul padrão)
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
