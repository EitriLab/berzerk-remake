import { Actor, CollisionType, Engine, vec } from "excalibur";
import { Resources } from "../resources";

const TAMANHO = 44; // tamanho do vampiro na tela, em pixels

export class Robot extends Actor {
  private alvo: Actor; // quem o robô persegue (o player)
  private velocidade: number;

  constructor(x: number, y: number, alvo: Actor, velocidade: number = 80) {
    super({
      name: "Robot",
      pos: vec(x, y),
      width: TAMANHO - 8, // o collider é um pouco menor que o desenho, fica mais justo
      height: TAMANHO - 8,
      collisionType: CollisionType.Active, // barrado pelas paredes
    });
    this.alvo = alvo;
    this.velocidade = velocidade;
  }

  override onInitialize() {
    const sprite = Resources.Vampiro.toSprite();
    // ajusta o desenho pro tamanho desejado, qualquer que seja o tamanho do PNG
    sprite.scale = vec(TAMANHO / sprite.width, TAMANHO / sprite.height);
    this.graphics.add(sprite);
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // vetor que aponta do robô até o alvo
    const ate = this.alvo.pos.sub(this.pos);

    if (ate.size > 1) {
      this.vel = ate.normalize().scale(this.velocidade);
    } else {
      this.vel = vec(0, 0);
    }

    // o vampiro do desenho olha pra esquerda: espelha quando o jogador está à direita
    this.graphics.flipHorizontal = ate.x > 0;
  }
}
