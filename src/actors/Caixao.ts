import { Actor, Collider, CollisionContact, CollisionType, Color, Side, vec } from "excalibur";
import { Projectile } from "./Projectile";
import { BolsaSangue } from "./BolsaSangue";

export class Caixao extends Actor {
  private aberto: boolean = false;

  constructor(x: number, y: number) {
    super({
      name: "Caixao",
      pos: vec(x, y),
      width: 40,
      height: 60,
      color: Color.fromHex("#5c4033"), // Cor marrom de madeira
      collisionType: CollisionType.Fixed, // Fica imóvel como uma parede até abrir
    });
  }

  public abrir(): void {
    if (this.aberto) return; // Se já está aberto, não faz nada
    
    this.aberto = true;
    this.color = Color.fromHex("#8b5a2b"); // Muda para uma cor de madeira aberta/clara
    this.body.collisionType = CollisionType.Passive; // Deixa de bloquear o caminho

    // Nasce uma bolsa de sangue ligeiramente acima do caixão
    const bolsa = new BolsaSangue(this.pos.x, this.pos.y - 40);
    this.scene?.add(bolsa);
    
    // Adiciona a bolsa na lista de entidades da cena atual para sumir ao trocar de sala
    if (this.scene && 'entidadesSala' in this.scene) {
      (this.scene as any).entidadesSala.push(bolsa);
    }
  }

  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // Abre o caixão se o projétil do jogador atingir ele
    if (other.owner instanceof Projectile) {
      this.abrir();
    }
  }
}
