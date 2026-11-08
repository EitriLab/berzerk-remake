import { Actor, Color, CollisionType, vec } from "excalibur";

export class Wall extends Actor {
  constructor(x: number, y: number, largura: number, altura: number) {
    super({
      name: "Wall",
      pos: vec(x, y),
      width: largura,
      height: altura,
      color: Color.Gray,
      collisionType: CollisionType.Fixed,
    });
  }
}
