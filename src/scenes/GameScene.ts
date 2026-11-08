import { Actor, BaseAlign, Color, Engine, Font, Label, Scene, TextAlign, vec } from "excalibur";
import { Player } from "../actors/Player";
import { Robot } from "../actors/Robot";
import { Wall } from "../actors/Wall";
import { Room, Obstaculo } from "../maps/Room";
import { Placar } from "../systems/Placar";

export class GameScene extends Scene {
  private player!: Player;
  private room!: Room;
  private hud!: Label;
  private sala = 1;
  private entidadesSala: Actor[] = []; // paredes e robôs da sala atual
  private robos: Robot[] = [];
  private porta?: Wall;
  private portaAberta = false;
  private fimDeJogo = false;

  // Roda apenas uma vez ao carregar a cena
  public override onInitialize(engine: Engine) {
    this.room = new Room();

    // Texto do topo (fica por cima da parede de cima)
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

  // Roda toda vez que a cena se torna ativa (inclusive ao reiniciar depois do game over)
  public override onActivate() {
    this.novoJogo();
  }

  // Zera tudo e começa na sala 1
  private novoJogo(): void {
    for (const a of [...this.actors]) {
      if (a !== this.hud) a.kill();
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

  // Cria (ou recria) a sala atual do zero
  private iniciarSala(): void {
    // apaga a sala anterior e as balas que sobraram
    for (const a of this.entidadesSala) a.kill();
    this.entidadesSala = [];
    this.robos = [];
    for (const a of [...this.actors]) {
      if (a.name === "Projectile" || a.name === "EnemyProjectile") a.kill();
    }

    const { paredes, porta, obstaculos } = this.room.buildWalls(this, this.sala);
    this.entidadesSala.push(...paredes);
    this.porta = porta;
    this.portaAberta = false;

    // Robôs: quanto mais salas, mais robôs e mais rápidos
    const quantidade = Math.min(2 + this.sala, 10);
    const velocidade = Math.min(70 + this.sala * 10, 160);
    for (let i = 0; i < quantidade; i++) {
      const p = this.pontoLivre(obstaculos);
      const robo = new Robot(p.x, p.y, this.player, velocidade);
      this.add(robo);
      this.entidadesSala.push(robo);
      this.robos.push(robo);
    }

    // Jogador volta pro ponto de início
    this.room.configurePlayerLimits(this.player);
  }

  // Sorteia uma posição na metade direita que não caia em cima de obstáculo
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

  public override onPostUpdate(engine: Engine) {
    if (this.fimDeJogo) return;

    // Jogador morreu? Vai pra tela de game over
    if (this.player.vida <= 0) {
      this.fimDeJogo = true;
      engine.goToScene("gameover");
      return;
    }

    // Todos os robôs mortos? Abre a porta
    if (!this.portaAberta && this.robos.every((r) => r.isKilled())) {
      this.porta?.kill();
      this.portaAberta = true;
    }

    // Porta aberta e jogador atravessou o buraco da direita? Próxima sala
    if (this.portaAberta && this.player.pos.x > 775) {
      this.sala += 1;
      Placar.pontos += 500; // bônus por limpar a sala
      this.iniciarSala();
    }

    const aviso = this.portaAberta ? "   >>> SAIA PELA DIREITA <<<" : "";
    this.hud.text = `Sala ${this.sala}   Vida: ${this.player.vida}   Pontos: ${Placar.pontos}${aviso}`;
  }
}
