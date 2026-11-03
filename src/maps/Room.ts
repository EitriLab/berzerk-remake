import { Actor, CollisionType, Vector, vec } from "excalibur";

export class Room {
  // 1. POSICIONAMENTO INICIAL (Resolve diretamente a sua Issue #5)
  // Define a coordenada exata onde o jogador vai nascer na tela (X=400, Y=300)
  public playerSpawnPoint: Vector = vec(400, 300);

  // 2. LIMITES DA SALA (Resolve a outra metade da sua Issue #5)
  // Função que configura o jogador para respeitar os limites do motor de física
  public configurePlayerLimits(player: Actor): void {
    // Define o jogador como 'Active'. Isso garante que o motor de física do Excalibur
    // impeça o jogador de atravessar qualquer parede estática (Fixed) do jogo.
    player.body.collisionType = CollisionType.Active;

    // Posiciona o jogador no ponto de nascimento inicial da sala
    player.pos = this.playerSpawnPoint;
  }
}
