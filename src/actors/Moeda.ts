import { Actor, Collider, CollisionContact, CollisionType, Color, Side, vec } from "excalibur";
import { Player } from "./Player";
import { Placar } from "../systems/Placar";

export class Moeda extends Actor {
  constructor(x: number, y: number) {
    super({
      name: "Moeda",
      pos: vec(x, y),
      width: 16,
      height: 16,
      color: Color.Yellow, // Quadrado amarelo representando a moeda de ouro
      collisionType: CollisionType.Passive, // Só avisa colisão, sem empurrar o player
    });
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Se o Player encostar na moeda
    if (other.owner instanceof Player) {
      Placar.moedas += 1; // Soma +1 moeda na carteira da Loja
      this.kill(); // A moeda some do cenário de jogo
    }
  }
}
