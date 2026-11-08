import { Actor, Color, CollisionType, vec } from "excalibur";

export class Wall extends Actor {
  constructor(
    x: number,
    y: number,
    largura: number,
    altura: number,
    cor: Color = Color.Gray,
  ) {
    super({
      name: "Wall",
      pos: vec(x, y), // pos é o CENTRO da parede
      width: largura,
      height: altura,
      color: cor,
      collisionType: CollisionType.Fixed, // nunca se move, barra quem é Active
    });
  }
}
