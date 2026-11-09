import { Actor, Collider, CollisionContact, CollisionType, Color, Side, vec, Rectangle } from "excalibur";
import { Player } from "./Player";
import { Placar } from "../systems/Placar";

export class Moeda extends Actor {
  constructor(x: number, y: number) {
    super({
      name: "Moeda",
      pos: vec(x, y),
      width: 16,
      height: 16,
      collisionType: CollisionType.Passive,
      z: 50 // Garante que fica muito acima do chão (-10) e dos inimigos
    });
  }

  override onInitialize() {
    // Força o Excalibur a desenhar um quadrado amarelo puro na camada gráfica superior
    const desenhoMoeda = new Rectangle({
      width: 16,
      height: 16,
      color: Color.Yellow
    });
    
    this.graphics.add(desenhoMoeda);
    console.log(`Moeda renderizada visualmente em X: ${this.pos.x}, Y: ${this.pos.y}`);
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    if (other.owner instanceof Player || other.owner.name === "Player") {
      Placar.moedas += 1;
      console.log(`Moeda Coletada! Total na carteira: ${Placar.moedas}`);
      this.kill(); 
    }
  }
}
