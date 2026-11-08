import { Actor, CollisionType, Scene, Vector, vec } from "excalibur";
import { Wall, TipoParede } from "../actors/Wall";

export type Obstaculo = { x: number; y: number; w: number; h: number };

// Cada sala tem seu desenho de obstáculos (x e y do CENTRO, largura, altura).
// Depois da última, volta pro primeiro desenho (com mais robôs e mais rápidos).
const LAYOUTS: Obstaculo[][] = [
  [
    { x: 220, y: 180, w: 64, h: 64 },
    { x: 580, y: 420, w: 64, h: 64 },
    { x: 580, y: 160, w: 32, h: 120 },
  ],
  [
    { x: 250, y: 150, w: 200, h: 20 },
    { x: 400, y: 300, w: 20, h: 200 },
    { x: 550, y: 450, w: 200, h: 20 },
  ],
  [
    { x: 200, y: 300, w: 20, h: 300 },
    { x: 400, y: 150, w: 20, h: 200 },
    { x: 400, y: 450, w: 20, h: 200 },
    { x: 600, y: 300, w: 20, h: 300 },
  ],
  [
    { x: 300, y: 200, w: 150, h: 20 },
    { x: 300, y: 400, w: 150, h: 20 },
    { x: 550, y: 300, w: 20, h: 250 },
  ],
];

export class Room {
  public playerSpawnPoint: Vector = vec(80, 300); // lado esquerdo, a saída é na direita

  // Tamanho da sala (igual ao da Engine em main.ts)
  private largura = 800;
  private altura = 600;
  private espessura = 32;

  // Cria as paredes (com um buraco de porta na direita) e os obstáculos da sala.
  // Devolve tudo que foi criado pra GameScene poder apagar na troca de sala.
  public buildWalls(scene: Scene, sala: number): { paredes: Wall[]; porta: Wall; obstaculos: Obstaculo[] } {
    const w = this.largura;
    const h = this.altura;
    const t = this.espessura;
    const paredes: Wall[] = [];

    const criar = (x: number, y: number, largura: number, altura: number, tipo: TipoParede = "parede"): Wall => {
      const parede = new Wall(x, y, largura, altura, tipo);
      scene.add(parede);
      paredes.push(parede);
      return parede;
    };

    // Paredes externas
    criar(w / 2, t / 2, w, t);     // topo
    criar(w / 2, h - t / 2, w, t); // baixo
    criar(t / 2, h / 2, t, h);     // esquerda

    // Direita: duas partes com um buraco de 120px no meio (y de 240 a 360)
    criar(w - t / 2, 136, t, 208); // parte de cima
    criar(w - t / 2, 464, t, 208); // parte de baixo

    // A porta fecha o buraco (madeira) e some quando todos os robôs morrem
    const porta = criar(w - t / 2, 300, t, 120, "porta");

    // Obstáculos da sala
    const obstaculos = LAYOUTS[(sala - 1) % LAYOUTS.length];
    for (const o of obstaculos) {
      criar(o.x, o.y, o.w, o.h, "obstaculo");
    }

    return { paredes, porta, obstaculos };
  }

  public configurePlayerLimits(player: Actor): void {
    player.body.collisionType = CollisionType.Active;
    player.pos = this.playerSpawnPoint.clone();
    player.vel = vec(0, 0);
  }
}
