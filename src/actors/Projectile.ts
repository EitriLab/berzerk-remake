import { Actor, Collider, CollisionContact, CollisionType, Color, Engine, Side, Vector } from "excalibur";
import { Wall } from "./Wall";
import { Robot } from "./Robot";
import { Placar } from "../systems/Placar";

export class Projectile extends Actor {
  constructor(pos: Vector, direcao: Vector) {
    super({
      name: "Projectile",
      pos: pos,
      width: 10,
      height: 10,
      color: Color.Yellow,
      collisionType: CollisionType.Passive, // avisa quando bate, mas não é empurrado
    });
    this.vel = direcao.scale(500); // pixels por segundo
  }

  override onPostUpdate(engine: Engine): void {
    // saiu da tela (800x600)? some do jogo
    if (this.pos.x < 0 || this.pos.x > 800 || this.pos.y < 0 || this.pos.y > 600) {
      this.kill();
    }
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    if (other.owner instanceof Wall) {
      this.kill();
    }

    if (other.owner instanceof Robot) {
      other.owner.kill(); // mata o robô
      Placar.pontos += 100; // e soma pontos
      this.kill();        // e a bala some
    }
  }
}
