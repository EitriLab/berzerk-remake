import { Actor, Collider, CollisionContact, CollisionType, Engine, Side, vec, Keys} from "excalibur";
import { Resources } from "../resources";
import { Projectile } from "./Projectile";
import { Robot } from "./Robot";

export class Player extends Actor {
  private velocidade = 200;
  private direcaoOlhando = vec(1, 0); // pra onde o jogador está virado
  private recarga = 0;                // tempo até poder atirar de novo (ms)
  private invulneravel = 0;           // tempo restante sem poder levar dano (ms)
  public vida = 3;

  constructor() {
    super({
      name: 'Player',
      pos: vec(150, 150),
      width: 50,
      height: 50,
      collisionType: CollisionType.Active, // Active: participa das colisões e é barrado pelas paredes
    });
  }

  override onInitialize() {
    const sprite = Resources.Sword.toSprite();
    // encolhe/estica a imagem pra ficar do tamanho do collider (50x50)
    sprite.scale = vec(50 / sprite.width, 50 / sprite.height);
    this.graphics.add(sprite);
  }

  public receberDano(): void {
    if (this.invulneravel > 0) return; // ainda protegido, ignora

    this.vida -= 1;
    this.invulneravel = 1000; // 1 segundo de proteção

    if (this.vida <= 0) {
      this.kill();
    }
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    const teclado = engine.input.keyboard;

    let x = 0;
    let y = 0;

    // Movimento vertical
    if (teclado.isHeld(Keys.W) || teclado.isHeld(Keys.Up)) {
      y -= 1;
    }

    if (teclado.isHeld(Keys.S) || teclado.isHeld(Keys.Down)) {
      y += 1;
    }

    // Movimento horizontal
    if (teclado.isHeld(Keys.A) || teclado.isHeld(Keys.Left)) {
      x -= 1;
    }

    if (teclado.isHeld(Keys.D) || teclado.isHeld(Keys.Right)) {
      x += 1;
    }

    // Só normaliza e move se alguma tecla estiver apertada
    if (x !== 0 || y !== 0) {
      const direcao = vec(x, y).normalize();
      this.vel = direcao.scale(this.velocidade);
      this.direcaoOlhando = direcao; // lembra pra onde está virado
    } else {
      this.vel = vec(0, 0);
    }

    // Disparo com espaço
    this.recarga -= elapsedMs;
    if (teclado.isHeld(Keys.Space) && this.recarga <= 0) {
      this.scene?.add(new Projectile(this.pos.clone(), this.direcaoOlhando));
      this.recarga = 250; // 4 tiros por segundo
    }

    // Contagem da invulnerabilidade + efeito de piscar
    if (this.invulneravel > 0) {
      this.invulneravel -= elapsedMs;
      this.graphics.opacity = Math.floor(this.invulneravel / 100) % 2 === 0 ? 0.3 : 1;
    } else {
      this.graphics.opacity = 1;
    }
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    // Put any update logic here runs every frame after Actor builtins
  }

  override onPreCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called before a collision is resolved, if you want to opt out of this specific collision call contact.cancel()
  }

  override onPostCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Roda todo frame enquanto está encostando: se for um robô, leva dano
    if (other.owner instanceof Robot) {
      this.receberDano();
    }
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Called when a pair of objects are in contact
  }

  override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
    // Called when a pair of objects separates
  }
}
