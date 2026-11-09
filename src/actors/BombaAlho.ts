import { Actor, Collider, CollisionContact, CollisionType, Color, Engine, Side, Vector, vec } from "excalibur";
import { Robot } from "./Robot";
import { Wall } from "./Wall";
import { Placar } from "../systems/Placar"; // Importado para dar pontos ao matar com alho
import { Moeda } from "./Moeda"; // Adicionado o import da moeda coletável

export class BombaAlho extends Actor {
  private tempoExplosao = 600; // 0.6 segundos voando até explodir

  constructor(pos: Vector, direcao: Vector) {
    super({
      name: "BombaAlho",
      pos: pos,
      width: 16,
      height: 16,
      color: Color.White, // Cabeça de alho voando
      collisionType: CollisionType.Passive,
    });
    this.vel = direcao.scale(350); // Voa um pouco mais devagar que a seta da besta
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // SE O JOGO ESTIVER PAUSADO: Trava o alho voando no ar
    if (Placar.jogoPausado) {
      this.vel = vec(0, 0);
      return;
    }

    this.tempoExplosao -= elapsedMs;
    if (this.tempoExplosao <= 0) {
      this.explodir();
    }
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    if (other.owner instanceof Wall || other.owner instanceof Robot) {
      this.explodir();
    }
  }

  private explodir(): void {
    this.kill();
    
    // Cria a fumaça de área baseada na classe auxiliar abaixo para capturar colisões nativas
    const explosao = new ExplosaoAlho(this.pos.clone());
    this.scene?.add(explosao);
  }
}

// Nova classe auxiliar interna para processar o dano por contato físico imediato da engine
class ExplosaoAlho extends Actor {
  private tempoVida = 150; // Duração da fumaça na tela (ms)

  constructor(pos: Vector) {
    super({
      name: "ExplosaoAlho",
      pos: pos,
      width: 110, // Área grande de impacto do alho
      height: 110,
      color: Color.fromHex("#e0eee0"), // Verde claro translúcido
      collisionType: CollisionType.Passive, // Dispara eventos de colisão sem empurrar fisicamente
    });
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Se estiver pausado, congela o tempo de dissipação da fumaça
    if (Placar.jogoPausado) return;

    this.tempoVida -= elapsedMs;
    if (this.tempoVida <= 0) {
      this.kill(); // Some com a fumaça após o tempo de vida
    }
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Se qualquer vampiro for tocado pela fumaça em expansão
    if (other.owner instanceof Robot) {
      const posicaoMorte = other.owner.pos.clone(); // Salva a posição exata da morte
      other.owner.kill(); // Destrói o vampiro instantaneamente
      Placar.pontos += 100; // Soma os pontos devidos no placar

      // 50% de chance de dropar uma moeda amarela ao explodir o robô com alho
      if (Math.random() > 0.5) {
        this.scene?.add(new Moeda(posicaoMorte.x, posicaoMorte.y));
      }
    }
  }
}
