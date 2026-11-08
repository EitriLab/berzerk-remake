import { Actor, Color, CollisionType, Scene, Vector, vec } from "excalibur";
import { Wall } from "../actors/Wall";

export class Room {
  public playerSpawnPoint: Vector = vec(400, 300);

  // Tamanho da sala (igual ao da Engine em main.ts)
  private largura = 800;
  private altura = 600;
  private espessura = 32;

  // Cria as 4 paredes e os obstáculos da sala
  public buildWalls(scene: Scene): void {
    const w = this.largura;
    const h = this.altura;
    const t = this.espessura;

    // Paredes externas
    scene.add(new Wall(w / 2, t / 2, w, t));     // topo
    scene.add(new Wall(w / 2, h - t / 2, w, t)); // baixo
    scene.add(new Wall(t / 2, h / 2, t, h));     // esquerda
    scene.add(new Wall(w - t / 2, h / 2, t, h)); // direita

    // Obstáculos (longe do spawn em 400,300)
    const corObstaculo = Color.fromHex("#4a3a55");
    scene.add(new Wall(220, 180, 64, 64, corObstaculo));
    scene.add(new Wall(580, 420, 64, 64, corObstaculo));
    scene.add(new Wall(580, 160, 32, 120, corObstaculo));
  }

  public configurePlayerLimits(player: Actor): void {
    player.body.collisionType = CollisionType.Active;
    player.pos = this.playerSpawnPoint.clone();
  }
}
