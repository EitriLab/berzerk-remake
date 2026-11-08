import { Actor, Collider, CollisionContact, CollisionType, Color, Engine, Side, Vector } from "excalibur";
import type { Player } from "./Player";
import { Wall } from "./Wall";

export class EnemyProjectile extends Actor {
  constructor(pos: Vector, direcao: Vector) {
    super({
      name: "EnemyProjectile",
      pos: pos,
      width: 12,
      height: 12,
      color: Color.Orange,
      collisionType: CollisionType.Passive,
    });
    this.vel = direcao.scale(220); // mais lenta que a bala do jogador (500), dá pra desviar
  }

  override onPostUpdate(engine: Engine): void {
    if (this.pos.x < 0 || this.pos.x > 800 || this.pos.y < 0 || this.pos.y > 600) {
      this.kill();
    }
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    if (other.owner instanceof Wall) {
      this.kill();
    }

    if (other.owner.name === "Player") {
      (other.owner as Player).receberDano();
      this.kill();
    }
  }
}