import { Actor, Collider, CollisionContact, CollisionType, Color, Engine, Side, Vector, vec } from "excalibur";
import type { Player } from "./Player";
import { Wall } from "./Wall";
import { Placar } from "../systems/Placar"; // Importado para ler o estado de pausa

export class EnemyProjectile extends Actor {
  // Guardamos a direção original para restaurar o movimento correto após o despauso
  private direcaoOriginal: Vector;

  constructor(pos: Vector, direcao: Vector) {
    super({
      name: "EnemyProjectile",
      pos: pos,
      width: 12,
      height: 12,
      color: Color.Orange,
      collisionType: CollisionType.Passive,
    });
    this.direcaoOriginal = direcao.normalize();
    this.vel = this.direcaoOriginal.scale(220); // mais lenta que a bala do jogador (500), dá pra desviar
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // SE O JOGO ESTIVER PAUSADO: Congela a bola laranja no ar na hora
    if (Placar.jogoPausado) {
      this.vel = vec(0, 0);
      return;
    }

    // QUANDO O JOGO VOLTA DA PAUSA: Restaura a velocidade original de perseguição
    if (this.vel.size === 0) {
      this.vel = this.direcaoOriginal.scale(220);
    }
  }

  override onPostUpdate(engine: Engine): void {
    if (this.pos.x < 0 || this.pos.x > 800 || this.pos.y < 0 || this.pos.y > 600) {
      this.kill();
    }
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Impede que o jogador leve dano por balas se o jogo estiver pausado
    if (Placar.jogoPausado) return;

    if (other.owner instanceof Wall) {
      this.kill();
    }

    if (other.owner.name === "Player") {
      (other.owner as Player).receberDano();
      this.kill();
    }
  }
}
