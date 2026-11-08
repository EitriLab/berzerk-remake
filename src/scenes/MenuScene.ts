import { BaseAlign, Color, Engine, Font, Keys, Label, Scene, TextAlign, vec } from "excalibur";

export class MenuScene extends Scene {
  private criarTexto(texto: string, y: number, tamanho: number, cor: Color): void {
    this.add(
      new Label({
        text: texto,
        pos: vec(400, y),
        font: new Font({
          size: tamanho,
          color: cor,
          textAlign: TextAlign.Center,
          baseAlign: BaseAlign.Middle,
        }),
      })
    );
  }

  public override onInitialize(engine: Engine) {
    this.criarTexto("BERZERK REMAKE", 190, 52, Color.Red);
    this.criarTexto("ENTER - jogar", 300, 28, Color.White);
    this.criarTexto("WASD ou setas: mover    ESPAÇO: atirar", 380, 20, Color.Yellow);
    this.criarTexto("Mate todos os robôs e saia pela direita", 420, 20, Color.Yellow);
  }

  public override onPostUpdate(engine: Engine) {
    if (engine.input.keyboard.wasPressed(Keys.Enter)) {
      engine.goToScene("game");
    }
  }
}
