import { Scene, Engine } from "excalibur";
import { Player } from "../actors/Player";
import { Room } from "../maps/Room";

export class GameScene extends Scene {
  private player!: Player;
  private room!: Room;

  // Roda apenas uma vez ao carregar a cena
  public onInitialize(engine: Engine) {
    this.room = new Room();
    this.room.buildWalls(this);

    this.player = new Player();
    this.add(this.player);
  }

  // Roda toda vez que a cena se torna ativa
  public onActivate() {
    this.room.configurePlayerLimits(this.player);
  }
}
