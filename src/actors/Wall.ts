import { Actor, CollisionType, ImageSource, TiledSprite, vec } from "excalibur";
import { Resources } from "../resources";

export type TipoParede = "parede" | "obstaculo" | "porta";

const ESCALA = 2; // cada tile de 16px aparece com 32px na tela (mesma espessura da parede)

export class Wall extends Actor {
  private tipo: TipoParede;

  constructor(x: number, y: number, largura: number, altura: number, tipo: TipoParede = "parede") {
    super({
      name: "Wall",
      pos: vec(x, y), // pos é o CENTRO da parede
      width: largura,
      height: altura,
      collisionType: CollisionType.Fixed, // Fixed: nunca se mexe
    });
    this.tipo = tipo;
  }

  override onInitialize() {
    const imagens: Record<TipoParede, ImageSource> = {
      parede: Resources.Parede,
      obstaculo: Resources.Obstaculo,
      porta: Resources.Porta,
    };

    // Repete o tile pela área inteira da parede (largura e altura em pixels da imagem)
    const sprite = new TiledSprite({
      image: imagens[this.tipo],
      width: this.width / ESCALA,
      height: this.height / ESCALA,
    });
    sprite.scale = vec(ESCALA, ESCALA);
    this.graphics.use(sprite);
  }
}
