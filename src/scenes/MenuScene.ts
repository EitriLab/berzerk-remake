import { BaseAlign, Color, Engine, Font, Keys, Label, Scene, TextAlign, vec, Actor, CollisionType } from "excalibur";

export class MenuScene extends Scene {
  private btnJogar!: Actor;
  private btnLoja!: Actor;

  // Função interna para criar um botão estilizado de madeira marrom
  private criarBotaoMadeira(texto: string, x: number, y: number, largura: number, altura: number, acao: () => void): Actor {
    // 1. Cria o retângulo de fundo do botão (Cor marrom de madeira)
    const container = new Actor({
      pos: vec(x, y),
      width: largura,
      height: altura,
      color: Color.fromHex("#a66d3b"), // Marrom madeira claro do exemplo
      collisionType: CollisionType.Passive
    });

    // Ativa a interação do mouse para o retângulo inteiro
    container.pointer.useGraphicsBounds = true;

    // 2. Cria o texto branco centralizado dentro do botão
    const label = new Label({
      text: texto,
      pos: vec(0, 0), // Relativo ao centro do Actor pai
      font: new Font({
        size: 20,
        color: Color.White,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle,
        family: "monospace" // Estilo mais pixelado/retrô
      }),
    });

    // Junta o texto dentro do retângulo marrom
    container.addChild(label);

    // 3. Efeitos visuais: escurece a madeira quando passa o mouse por cima
    container.on("pointerenter", () => {
      container.color = Color.fromHex("#7d4f27"); // Marrom mais escuro
    });
    container.on("pointerleave", () => {
      container.color = Color.fromHex("#a66d3b"); // Volta ao marrom padrão
    });

    // 4. Executa a ação do clique
    container.on("pointerdown", acao);

    this.add(container);
    return container;
  }

  public override onInitialize(engine: Engine) {
    // Título principal do topo
    const titulo = new Label({
      text: "BERZERK REMAKE",
      pos: vec(400, 130), // Ligeiramente reposicionado para distribuir melhor o espaço vago
      font: new Font({
        size: 52,
        color: Color.Red,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle,
      }),
    });
    this.add(titulo);

    // BOTÃO PLAY (Caixa de madeira retangular)
    this.btnJogar = this.criarBotaoMadeira("PLAY", 400, 270, 200, 55, () => {
      engine.goToScene("game");
    });

    // BOTÃO LOJA (Caixa de madeira retangular)
    this.btnLoja = this.criarBotaoMadeira("LOJA", 400, 350, 200, 55, () => {
      engine.goToScene("loja");
    });

    // Instruções de controle do rodapé
    const instrucoes1 = new Label({
      text: "WASD ou setas: mover    ESPAÇO: atirar",
      pos: vec(400, 470),
      font: new Font({ size: 18, color: Color.Yellow, textAlign: TextAlign.Center }),
    });
    const instrucoes2 = new Label({
      text: "Mate todos os robôs e saia pela direita",
      pos: vec(400, 510),
      font: new Font({ size: 18, color: Color.Yellow, textAlign: TextAlign.Center }),
    });
    this.add(instrucoes1);
    this.add(instrucoes2);
  }

  public override onActivate() {
    // Método mantido limpo sem buscar o contador de moedas removido
  }

  public override onPostUpdate(engine: Engine) {
    if (engine.input.keyboard.wasPressed(Keys.Enter)) {
      engine.goToScene("game");
    }
  }
}
