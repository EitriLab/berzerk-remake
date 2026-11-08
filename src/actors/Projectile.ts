import { Actor, Color, Engine, Vector } from "excalibur";

export class Projectile extends Actor {
  constructor(pos: Vector, direcao: Vector) {
    super({
      name: "Projectile",
      pos: pos,
      width: 10,
      height: 10,
      color: Color.Yellow,
    });
    this.vel = direcao.scale(500); // pixels por segundo
  }

  override onPostUpdate(engine: Engine): void {
    // saiu da tela (800x600)? some do jogo
    if (this.pos.x < 0 || this.pos.x > 800 || this.pos.y < 0 || this.pos.y > 600) {
      this.kill();
    }
  }
}