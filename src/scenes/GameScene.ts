import { Actor, BaseAlign, Color, Engine, Font, Keys, Label, Scene, TextAlign, vec, CollisionType } from "excalibur";
import { Resources } from "../resources";
import { Player } from "../actors/Player";
import { Robot } from "../actors/Robot";
import { Wall } from "../actors/Wall";
import { Room, Obstaculo } from "../maps/Room";
import { Placar } from "../systems/Placar";
import { Caixao } from "../actors/Caixao";

export class GameScene extends Scene {
  private player!: Player;
  private room!: Room;
  private hud!: Label;
  private chao!: Actor;
  private sala = 1;
  private entidadesSala: Actor[] = []; // paredes e robôs da sala atual
  private robos: Robot[] = [];
  private porta?: Wall;
  private portaAberta = false;
  private fimDeJogo = false;

  // VARIÁVEIS DA TELA DE PAUSA 3D
  private juegoPausado = false;
  private atoresPausa: Actor[] = []; // Guarda os elementos visuais da pausa

  public override onInitialize(engine: Engine) {
    this.room = new Room();

    const spriteChao = Resources.Chao.toSprite();
    spriteChao.scale = vec(800 / spriteChao.width, 600 / spriteChao.height);
    this.chao = new Actor({ pos: vec(400, 300), z: -10 });
    this.chao.graphics.use(spriteChao);
    this.add(this.chao);

    this.hud = new Label({
      text: "",
      pos: vec(40, 6),
      font: new Font({
        size: 20,
        color: Color.White,
        textAlign: TextAlign.Left,
        baseAlign: BaseAlign.Top,
      }),
    });
    this.hud.z = 100;
    this.add(this.hud);
  }

  public override onActivate() {
    this.juegoPausado = false;
    Placar.jogoPausado = false; // Garante que o jogo começa despausado
    this.novoJogo();
  }

  private novoJogo(): void {
    this.removerAtoresPausa();
    for (const a of [...this.actors]) {
      if (a !== this.hud && a !== this.chao) a.kill();
    }
    this.entidadesSala = [];
    this.robos = [];
    this.sala = 1;
    this.fimDeJogo = false;
    Placar.pontos = 0;

    this.player = new Player();
    this.add(this.player);

    this.iniciarSala();
  }

  private iniciarSala(): void {
    this.removerAtoresPausa();
    for (const a of this.entidadesSala) a.kill();
    this.entidadesSala = [];
    this.robos = [];
    for (const a of [...this.actors]) {
      if (
        a.name === "Projectile" || 
        a.name === "EnemyProjectile" || 
        a.name === "BombaAlho" || 
        a.name === "ExplosaoAlho" ||
        a.name === "BolsaSangue" ||
        a.name === "Moeda"
      ) {
        a.kill();
      }
    }

    const { paredes, porta, obstaculos } = this.room.buildWalls(this, this.sala);
    this.entidadesSala.push(...paredes);
    this.porta = porta;
    this.portaAberta = false;

    const quantity = Math.min(2 + this.sala, 10);
    const velocidade = Math.min(70 + this.sala * 10, 160);
    for (let i = 0; i < quantity; i++) {
      const p = this.pontoLivre(obstaculos);
      const robo = new Robot(p.x, p.y, this.player, velocidade);
      this.add(robo);
      this.entidadesSala.push(robo);
      this.robos.push(robo);
    }

    const pCaixao = this.pontoLivre(obstaculos);
    const caixao = new Caixao(pCaixao.x, pCaixao.y);
    this.add(caixao);
    this.entidadesSala.push(caixao);

    this.room.configurePlayerLimits(this.player);
  }

  private pontoLivre(obstaculos: Obstaculo[]): { x: number; y: number } {
    let x = 600;
    let y = 300;
    for (let tentativa = 0; tentativa < 50; tentativa++) {
      x = 300 + Math.random() * 420;
      y = 70 + Math.random() * 460;
      const batendo = obstaculos.some(
        (o) => Math.abs(x - o.x) < o.w / 2 + 45 && Math.abs(y - o.y) < o.h / 2 + 45
      );
      if (!batendo) break;
    }
    return { x, y };
  }

  // FUNÇÃO AUXILIAR PARA CRIAR OS BOTÕES DE PAUSA EM RELEVO 3D RETRÔ
  private criarBotaoPausa(texto: string, y: number, corTopo: string, corBorda: string, acao: () => void): void {
    const borda = new Actor({
      pos: vec(400, y + 5),
      width: 180,
      height: 45,
      color: Color.fromHex(corBorda),
      z: 200
    });

    const topo = new Actor({
      pos: vec(400, y),
      width: 180,
      height: 45,
      color: Color.fromHex(corTopo),
      z: 201
    });

    topo.pointer.useGraphicsBounds = true;

    const label = new Label({
      text: texto,
      pos: vec(0, 0),
      font: new Font({
        size: 16,
        color: Color.fromHex("#1a1a1a"), 
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle,
        family: "monospace"
      })
    });
    topo.addChild(label);

    topo.on("pointerdown", () => {
      topo.pos.y = y + 4;
      setTimeout(acao, 80);
    });

    this.add(borda);
    this.add(topo);
    this.atoresPausa.push(borda, topo);
  }

  private removerAtoresPausa(): void {
    for (const a of this.atoresPausa) a.kill();
    this.atoresPausa = [];
  }

  private alternarPausa(engine: Engine): void {
    this.juegoPausado = !this.juegoPausado;
    Placar.jogoPausado = this.juegoPausado; // Informa a todo o sistema do jogo se as atualizações devem travar

    if (this.juegoPausado) {
      const fundo = new Actor({
        pos: vec(400, 300),
        width: 800,
        height: 600,
        color: new Color(0, 0, 0, 0.65),
        z: 199
      });
      this.add(fundo);
      this.atoresPausa.push(fundo);

      const txtPausa = new Label({
        text: "JOGO PAUSADO",
        pos: vec(400, 150),
        font: new Font({ size: 36, color: Color.White, textAlign: TextAlign.Center, family: "monospace" }),
        z: 200
      });
      this.add(txtPausa);
      this.atoresPausa.push(txtPausa);

      this.criarBotaoPausa("START", 240, "#4caf50", "#2e7d32", () => {
        this.alternarPausa(engine);
      });

      this.criarBotaoPausa("PAUSE", 310, "#ffb300", "#b78103", () => {
        Placar.jogoPausado = false; // Despausa antes de recomeçar
        this.novoJogo();
      });

      this.criarBotaoPausa("EXIT", 380, "#f44336", "#c62828", () => {
        this.removerAtoresPausa();
        Placar.jogoPausado = false; // Despausa antes de mudar de cena
        engine.goToScene("menu"); 
      });

    } else {
      this.removerAtoresPausa();
    }
  }

  public override onPostUpdate(engine: Engine) {
    if (engine.input.keyboard.wasPressed(Keys.P) && !this.fimDeJogo) {
      this.alternarPausa(engine);
    }

    // CONGELAMENTO SELETIVO: Se o jogo estiver pausado, trava as velocidades das mecânicas de fundo
    if (this.juegoPausado) {
      for (const actor of this.actors) {
        if (!this.atoresPausa.includes(actor) && actor !== this.hud && actor !== this.chao) {
          actor.vel = vec(0, 0); 
        }
      }
      return; 
    }

    if (this.fimDeJogo) return;

    if (this.player.vida <= 0) {
      this.fimDeJogo = true;
      engine.goToScene("gameover");
      return;
    }

    if (!this.portaAberta && this.robos.every((r) => r.isKilled())) {
      this.porta?.kill();
      this.portaAberta = true;
    }

    if (this.portaAberta && this.player.pos.x > 775) {
      this.sala += 1;
      Placar.pontos += 500; 
      this.iniciarSala();
    }

    const armaNome = this.player.armaEquipada === "besta" ? "Besta" : "Bomba de Alho";
    const aviso = this.portaAberta ? "   >>> SAIA PELA DIREITA <<<" : "";
    this.hud.text = `Sala ${this.sala}   Vida: ${this.player.vida}   Pontos: ${Placar.pontos}   [Arma: ${armaNome}]${aviso}`;
  }
}
