import { Actor, Collider, CollisionContact, CollisionType, Color, Side, vec } from "excalibur";
import { Player } from "./Player";

export class BolsaSangue extends Actor {
  constructor(x: number, y: number) {
    super({
      name: "BolsaSangue",
      pos: vec(x, y),
      width: 20,
      height: 20,
      color: Color.Red, // Pode ser substituído por um sprite de gota/bolsa depois
      collisionType: CollisionType.Passive, // Apenas avisa quando encostam nela
    });
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Se o Player encostar na bolsa
    if (other.owner instanceof Player) {
      const player = other.owner;
      
      // Cura o jogador se ele estiver com menos de 3 de vida
      if (player.vida < 3) {
        player.vida += 1;
        this.kill(); // A bolsa some do cenário
      }
    }
  }
}
