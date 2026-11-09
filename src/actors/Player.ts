import { Actor, Collider, CollisionContact, CollisionType, Engine, Side, vec, Keys} from "excalibur";
import { Resources } from "../resources";
import { Projectile } from "./Projectile";
import { Robot } from "./Robot";
import { BombaAlho } from "./BombaAlho"; 
import { Placar } from "../systems/Placar"; // Importado para ler o estado da pausa

export class Player extends Actor {
  private velocidade = 200;
  private direcaoOlhando = vec(1, 0); 
  private recarga = 0;                
  private invulneravel = 0;           
  
  public vida = 3;
  public armaEquipada: "besta" | "alho" = "besta"; 

  constructor() {
    super({
      name: 'Player',
      pos: vec(150, 150),
      width: 50,
      height: 50,
      collisionType: CollisionType.Active, 
    });
  }

  override onInitialize() {
    const sprite = Resources.Sword.toSprite();
    sprite.scale = vec(50 / sprite.width, 50 / sprite.height);
    this.graphics.add(sprite);
  }

  public receberDano(): void {
    if (this.invulneravel > 0) return; 

    this.vida -= 1;
    this.invulneravel = 1000; 

    if (this.vida <= 0) {
      this.kill();
    }
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // SE O JOGO ESTIVER PAUSADO: Zera a velocidade e trava o processamento de inputs
    if (Placar.jogoPausado) {
      this.vel = vec(0, 0);
      return;
    }

    const teclado = engine.input.keyboard;
    let x = 0;
    let y = 0;

    if (teclado.isHeld(Keys.W) || teclado.isHeld(Keys.Up)) y -= 1;
    if (teclado.isHeld(Keys.S) || teclado.isHeld(Keys.Down)) y += 1;
    if (teclado.isHeld(Keys.A) || teclado.isHeld(Keys.Left)) x -= 1;
    if (teclado.isHeld(Keys.D) || teclado.isHeld(Keys.Right)) x += 1;

    if (x !== 0 || y !== 0) {
      const direcao = vec(x, y).normalize();
      this.vel = direcao.scale(this.velocidade);
      this.direcaoOlhando = direcao; 
    } else {
      this.vel = vec(0, 0);
    }

    if (teclado.wasPressed(Keys.Q)) {
      this.armaEquipada = this.armaEquipada === "besta" ? "alho" : "besta";
    }

    this.recarga -= elapsedMs;
    if (teclado.isHeld(Keys.Space) && this.recarga <= 0) {
      if (this.armaEquipada === "besta") {
        this.scene?.add(new Projectile(this.pos.clone(), this.direcaoOlhando));
        this.recarga = 250; 
      } else {
        this.scene?.add(new BombaAlho(this.pos.clone(), this.direcaoOlhando));
        this.recarga = 1000; 
      }
    }

    if (this.invulneravel > 0) {
      this.invulneravel -= elapsedMs;
      this.graphics.opacity = Math.floor(this.invulneravel / 100) % 2 === 0 ? 0.3 : 1;
    } else {
      this.graphics.opacity = 1;
    }
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {}
  override onPreCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {}

  override onPostCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    if (other.owner instanceof Robot) {
      this.receberDano();
    }
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {}
  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {}
}
