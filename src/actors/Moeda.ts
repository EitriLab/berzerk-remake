import { Actor, Collider, CollisionContact, CollisionType, Color, Side, vec } from "excalibur";
import { Player } from "./Player";
import { Placar } from "../systems/Placar";

export class Moeda extends Actor {
  constructor(x: number, y: number) {
    super({
      name: "Moeda",
      pos: vec(x, y),
      width: 24, // Um pouco maior para facilitar o contato físico do Player
      height: 24,
      color: Color.Yellow, 
      collisionType: CollisionType.Passive, // Passivo para não empurrar ou bloquear o jogador
      z: 15 // Força total para ficar acima de absolutamente tudo (inclusive do HUD e do chão)
    });
  }

  override onInitialize() {
    console.log(`Moeda spawnada com sucesso na posição X: ${this.pos.x}, Y: ${this.pos.y}`);
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Verifica se quem encostou foi o Player de fato
    if (other.owner instanceof Player || other.owner.name === "Player") {
      Placar.moedas += 1;
      console.log(`Moeda Coletada! Carteira atual: ${Placar.moedas}`);
      this.kill(); // Remove do cenário
    }
  }
}
