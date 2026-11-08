import { Actor, CollisionType, Color, Engine, vec } from "excalibur";

export class Robot extends Actor {
  private alvo: Actor; // quem o robô persegue (o player)
  private velocidade = 80;

  constructor(x: number, y: number, alvo: Actor) {
    super({
      name: "Robot",
      pos: vec(x, y),
      width: 40,
      height: 40,
      color: Color.Red,
      collisionType: CollisionType.Active, // barrado pelas paredes
    });
    this.alvo = alvo;
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // vetor que aponta do robô até o alvo
    const ate = this.alvo.pos.sub(this.pos);

    if (ate.size > 1) {
      this.vel = ate.normalize().scale(this.velocidade);
    } else {
      this.vel = vec(0, 0);
    }
  }
}
