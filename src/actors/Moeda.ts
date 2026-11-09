import { Actor, Collider, CollisionContact, CollisionType, Color, Side, vec } from "excalibur";
import { Player } from "./Player";
import { Placar } from "../systems/Placar";

export class Moeda extends Actor {
  constructor(x: number, y: number) {
    super({
      name: "Moeda",
      pos: vec(x, y),
      width: 20,
      height: 20,
      color: Color.Yellow, // Quadrado amarelo brilhante
      collisionType: CollisionType.Passive,
      z: 10 // FORÇA a moeda a nascer POR CIMA do chão e das paredes
    });
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    if (other.owner instanceof Player) {
      Placar.moedas += 1;
      this.kill(); // Some ao coletar
    }
  }
}
