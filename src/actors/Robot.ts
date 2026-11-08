import { Actor, CollisionType, Color, Engine, vec } from "excalibur";
import { EnemyProjectile } from "./EnemyProjectile";

export class Robot extends Actor {
  private alvo: Actor; // quem o robô persegue (o player)
  private velocidade: number;
  private recarga: number; // tempo até o próximo tiro (ms)

  constructor(x: number, y: number, alvo: Actor, velocidade: number = 80) {
    super({
      name: "Robot",
      pos: vec(x, y),
      width: 40,
      height: 40,
      color: Color.Red,
      collisionType: CollisionType.Active, // barrado pelas paredes
    });
    this.alvo = alvo;
    this.velocidade = velocidade;
    this.recarga = 1500 + Math.random() * 2000; // cada robô começa num tempo diferente
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // vetor que aponta do robô até o alvo
    const ate = this.alvo.pos.sub(this.pos);

    if (ate.size > 1) {
      this.vel = ate.normalize().scale(this.velocidade);
    } else {
      this.vel = vec(0, 0);
    }

    // atira em direção ao jogador de tempos em tempos
    this.recarga -= elapsedMs;
    if (this.recarga <= 0 && ate.size > 1) {
      const direcao = ate.normalize();
      // nasce um pouco à frente do robô, pra não nascer dentro dele
      const origem = this.pos.add(direcao.scale(30));
      this.scene?.add(new EnemyProjectile(origem, direcao));
      this.recarga = 2000 + Math.random() * 2000; // próximo tiro em 2 a 4 segundos
    }
  }
}
