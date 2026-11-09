import { BaseAlign, Color, Engine, Font, Keys, Label, Scene, TextAlign, vec, Actor, CollisionType } from "excalibur";
import { Placar } from "../systems/Placar";

export class ShopScene extends Scene {
  private txtMoedas!: Label;
  private txtStatus!: Label;

  // Função para criar os botões retangulares de madeira para os itens
  private criarBotaoItem(texto: string, x: number, y: number, custo: number, acaoCompra: () => boolean): Actor {
    const container = new Actor({
      pos: vec(x, y),
      width: 320,
      height: 60,
      color: Color.fromHex("#a66d3b"), // Mesmo marrom do menu
      collisionType: CollisionType.Passive
    });

    container.pointer.useGraphicsBounds = true;

    const label = new Label({
      text: `${texto} (${custo} Moedas)`,
      pos: vec(0, 0),
      font: new Font({
        size: 16,
        color: Color.White,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle,
        family: "monospace"
      }),
    });
    container.addChild(label);

    // Efeito de passar o mouse
    container.on("pointerenter", () => container.color = Color.fromHex("#7d4f27"));
    container.on("pointerleave", () => container.color = Color.fromHex("#a66d3b"));

    // Ação de clicar para comprar
    container.on("pointerdown", () => {
      if (Placar.moedas >= custo) {
        const comprou = acaoCompra();
        if (comprou) {
          Placar.moedas -= custo;
          this.atualizarInterface();
        }
      } else {
        this.txtStatus.text = "Moedas insuficientes!";
        this.txtStatus.font.color = Color.Red;
      }
    });

    this.add(container);
    return container;
  }

  public override onInitialize(engine: Engine) {
    // Título da Loja (Corrigido para evitar o erro da tela preta)
    const tituloLoja = new Label({
      text: "LOJA DE UPGRADES",
      pos: vec(400, 80),
      font: new Font({ size: 40, color: Color.Green, textAlign: TextAlign.Center }),
    });
    this.add(tituloLoja);

    // Mostrador de Moedas
    this.txtMoedas = new Label({
      text: "",
      pos: vec(400, 140),
      font: new Font({ size: 22, color: Color.Yellow, textAlign: TextAlign.Center }),
    });
    this.add(this.txtMoedas);

    // Texto de aviso/status de compras
    this.txtStatus = new Label({
      text: "Clique em um item para comprar",
      pos: vec(400, 180),
      font: new Font({ size: 16, color: Color.Gray, textAlign: TextAlign.Center }),
    });
    this.add(this.txtStatus);

    // ITEM 1: +1 de Vida Máxima (Custa 5 moedas)
    this.criarBotaoItem("AUMENTAR VIDA MÁXIMA", 400, 260, 5, () => {
      if (Placar.vidaMaxima < 6) { // Limite de até 6 corações no jogo
        Placar.vidaMaxima += 1;
        this.txtStatus.text = "Vida máxima aumentada!";
        this.txtStatus.font.color = Color.Green;
        return true;
      }
      this.txtStatus.text = "Limite de vida máxima atingido!";
      this.txtStatus.font.color = Color.Orange;
      return false;
    });

    // ITEM 2: +20 de Velocidade (Custa 3 moedas)
    this.criarBotaoItem("MAIS VELOCIDADE", 400, 340, 3, () => {
      if (Placar.upgradeVelocidade < 4) { // Limite de 4 upgrades
        Placar.upgradeVelocidade += 1;
        this.txtStatus.text = "Velocidade aumentada!";
        this.txtStatus.font.color = Color.Green;
        return true;
      }
      this.txtStatus.text = "Velocidade máxima atingida!";
      this.txtStatus.font.color = Color.Orange;
      return false;
    });

    // BOTÃO RETORNAR AO MENU (Caixa menor cinza)
    const btnVoltar = new Actor({
      pos: vec(400, 460),
      width: 140,
      height: 45,
      color: Color.DarkGray,
      collisionType: CollisionType.Passive
    });
    btnVoltar.pointer.useGraphicsBounds = true;
    
    const txtVoltar = new Label({
      text: "VOLTAR",
      pos: vec(0, 0),
      font: new Font({ size: 16, color: Color.White, textAlign: TextAlign.Center, baseAlign: BaseAlign.Middle }),
    });
    btnVoltar.addChild(txtVoltar);
    
    btnVoltar.on("pointerenter", () => btnVoltar.color = Color.Gray);
    btnVoltar.on("pointerleave", () => btnVoltar.color = Color.DarkGray);
    btnVoltar.on("pointerdown", () => engine.goToScene("menu"));
    
    this.add(btnVoltar);
    
    this.atualizarInterface();
  }

  public override onActivate() {
    this.atualizarInterface();
    this.txtStatus.text = "Clique em um item para comprar";
    this.txtStatus.font.color = Color.Gray;
  }

  private atualizarInterface(): void {
    if (this.txtMoedas) {
      this.txtMoedas.text = `Suas Moedas: ${Placar.moedas}`;
    }
  }

  public override onPostUpdate(engine: Engine) {
    if (engine.input.keyboard.wasPressed(Keys.Escape)) {
      engine.goToScene("menu");
    }
  }
}
