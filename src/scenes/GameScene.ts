import { Scene, Engine } from "excalibur";
import { Player } from "../actors/Player"; // Importa o jogador criado pela sua equipe
import { Room } from "../maps/Room";     // Importa a sua classe Room

export class GameScene extends Scene {
  private player!: Player;
  private room!: Room;

  // O onInitialize roda apenas uma vez ao carregar a cena
  public onInitialize(engine: Engine) {
    // Instancia a sua classe Room (que gerencia o ponto de início)
    this.room = new Room();

    // Instancia o jogador e o adiciona à cena
    this.player = new Player();
    this.add(this.player);
  }

  // O onActivate roda toda vez que a cena se torna ativa na tela
  public onActivate() {
    // CHAMA A SUA FUNÇÃO: Posiciona o jogador e aplica o comportamento de limite (Active)
    this.room.configurePlayerLimits(this.player);
  }
}
