import { Actor, Color, CollisionType, vec } from "excalibur";

export class Wall extends Actor {
  constructor(x: number, y: number, largura: number, altura: number, cor: Color = Color.Gray) {
    super({
      name: "Wall",
      pos: vec(x, y),
      width: largura,
      height: altura,
      color: cor,
      collisionType: CollisionType.Fixed, // Fixed: nunca se mexe
    });
  }
}
