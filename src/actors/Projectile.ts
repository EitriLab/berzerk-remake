import { Actor, Collider, CollisionContact, CollisionType, Color, Engine, Side, Vector } from "excalibur";
import { Wall } from "./Wall";
import { Robot } from "./Robot"; // Importado para a Issue #8

export class Projectile extends Actor {
  constructor(pos: Vector, direcao: Vector) {
    super({
      name: "Projectile",
      pos: pos,
      width: 10,
      height: 10,
      color: Color.Yellow,
      collisionType: CollisionType.Passive, // Avisa quando bate, mas não sofre impacto físico
    });
    this.vel = direcao.scale(500); // Velocidade do tiro (Issue #11)
  }

  override onPostUpdate(engine: Engine): void {
    // Se o projétil sair dos limites da tela (800x600), ele é destruído (Issue #11)
    if (this.pos.x < 0 || this.pos.x > 800 || this.pos.y < 0 || this.pos.y > 600) {
      this.kill();
    }
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Se colidir com uma parede, a bala some (Issue #11)
    if (other.owner instanceof Wall) {
      this.kill();
    }

    // Se colidir com um robô, destrói o inimigo e some com a bala (Issue #8)
    if (other.owner instanceof Robot) {
      other.owner.kill(); 
      this.kill();        
    }
  }
}
