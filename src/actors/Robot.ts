import { Actor, CollisionType, Engine, vec } from "excalibur"; 
import { Resources } from "../resources";
import { EnemyProjectile } from "./EnemyProjectile"; 
import { Wall } from "./Wall"; 
import { Placar } from "../systems/Placar"; // Importado para ler o estado da pausa

const TAMANHO = 44; 

export class Robot extends Actor {
  private alvo: Actor; 
  private velocidade: number;
  private recarga: number; 

  constructor(x: number, y: number, alvo: Actor, velocidade: number = 80) {
    super({
      name: "Robot",
      pos: vec(x, y),
      width: TAMANHO - 8, 
      height: TAMANHO - 8,
      collisionType: CollisionType.Active, 
    });
    this.alvo = alvo;
    this.velocidade = velocidade;
    this.recarga = 1500 + Math.random() * 2000; 
  }

  override onInitialize() {
    const sprite = Resources.Vampiro.toSprite();
    sprite.scale = vec(TAMANHO / sprite.width, TAMANHO / sprite.height);
    this.graphics.add(sprite);
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // SE O JOGO ESTIVER PAUSADO: Trava o movimento e impede a IA/Disparos de rodarem
    if (Placar.jogoPausado) {
      this.vel = vec(0, 0);
      return;
    }

    const ateJogador = this.alvo.pos.sub(this.pos);
    let direcaoFinal = ateJogador.normalize();

    const raioSensor = 40; 
    const atoresProximos = engine.currentScene.actors;
    
    for (const ator of atoresProximos) {
      if (ator instanceof Wall) {
        const distancia = this.pos.distance(ator.pos);
        
        if (distancia < raioSensor + Math.max(ator.width, ator.height) / 2) {
          const vetorParaParede = ator.pos.sub(this.pos);
          
          if (direcaoFinal.dot(vetorParaParede.normalize()) > 0) {
            const desvioLateral = vec(-vetorParaParede.y, vetorParaParede.x).normalize();
            
            if (desvioLateral.dot(direcaoFinal) < 0) {
              desvioLateral.scaleEqual(-1);
            }
            
            direcaoFinal = direcaoFinal.add(desvioLateral.scale(1.5)).normalize();
          }
        }
      }
    }

    if (ateJogador.size > 1) {
      this.vel = direcaoFinal.scale(this.velocidade);
    } else {
      this.vel = vec(0, 0);
    }

    if (this.vel.x !== 0) {
      this.graphics.flipHorizontal = this.vel.x > 0;
    }

    this.recarga -= elapsedMs;
    if (this.recarga <= 0 && ateJogador.size > 1) {
      const direcaoTiro = ateJogador.normalize();
      const origem = this.pos.add(direcaoTiro.scale(30));
      this.scene?.add(new EnemyProjectile(origem, direcaoTiro));
      this.recarga = 2000 + Math.random() * 2000; 
    }
  }
}
