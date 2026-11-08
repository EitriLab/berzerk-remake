import { BaseAlign, Color, Engine, Font, Keys, Label, Scene, TextAlign, vec } from "excalibur";
import { Placar } from "../systems/Placar";

export class GameOverScene extends Scene {
  private pontosLabel!: Label;

  private criarTexto(texto: string, y: number, tamanho: number, cor: Color): Label {
    const label = new Label({
      text: texto,
      pos: vec(400, y),
      font: new Font({
        size: tamanho,
        color: cor,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle,
      }),
    });
    this.add(label);
    return label;
  }

  public override onInitialize(engine: Engine) {
    this.criarTexto("GAME OVER", 200, 56, Color.Red);
    this.pontosLabel = this.criarTexto("", 290, 28, Color.White);
    this.criarTexto("R - jogar de novo", 380, 22, Color.Yellow);
    this.criarTexto("ESC - menu", 420, 22, Color.Yellow);
  }

  public override onActivate() {
    this.pontosLabel.text = `Pontos: ${Placar.pontos}`;
  }

  public override onPostUpdate(engine: Engine) {
    if (engine.input.keyboard.wasPressed(Keys.R)) {
      engine.goToScene("game");
    }
    if (engine.input.keyboard.wasPressed(Keys.Escape)) {
      engine.goToScene("menu");
    }
  }
}
