import { Actor, Color, DefaultLoader, Engine, ExcaliburGraphicsContext, Font, Keys, Label, Scene, SceneActivationContext, vec } from "excalibur";
import { Player } from "../actors/Player";
import { Wall } from "../actors/Wall";
import { Robot } from "../actors/Robot";
import { Projectile } from "../actors/Projectile";
import { Placar } from "./Placar";

type Obstaculo = { x: number; y: number; w: number; h: number };

// Cada sala tem seu desenho de obstáculos (x e y do CENTRO, largura, altura).
// A sala 5 repete o desenho da sala 1, mas com mais robôs e mais rápidos.
const LAYOUTS: Obstaculo[][] = [
    [{ x: 300, y: 250, w: 20, h: 200 }, { x: 550, y: 400, w: 200, h: 20 }],
    [{ x: 250, y: 150, w: 200, h: 20 }, { x: 400, y: 300, w: 20, h: 200 }, { x: 550, y: 450, w: 200, h: 20 }],
    [{ x: 200, y: 300, w: 20, h: 300 }, { x: 400, y: 150, w: 20, h: 200 }, { x: 400, y: 450, w: 20, h: 200 }, { x: 600, y: 300, w: 20, h: 300 }],
    [{ x: 300, y: 200, w: 150, h: 20 }, { x: 300, y: 400, w: 150, h: 20 }, { x: 550, y: 300, w: 20, h: 250 }],
];

export class MyLevel extends Scene {
    private player!: Player;
    private hud!: Label;
    private sala = 1;
    private entidadesSala: Actor[] = []; // tudo que pertence à sala atual (paredes e robôs)
    private robos: Robot[] = [];
    private porta!: Wall;
    private portaAberta = false;

    override onInitialize(engine: Engine): void {
        this.player = new Player();
        this.add(this.player);

        // Texto no canto da tela
        this.hud = new Label({
            text: "",
            pos: vec(30, 45),
            font: new Font({ size: 20, color: Color.White }),
        });
        this.hud.z = 100; // desenha por cima de tudo
        this.add(this.hud);

        this.iniciarSala();
    }

    // Cria (ou recria) a sala atual do zero
    private iniciarSala(): void {
        // apaga a sala anterior e as balas que sobraram
        for (const a of this.entidadesSala) a.kill();
        this.entidadesSala = [];
        this.robos = [];
        for (const a of this.actors) {
            if (a instanceof Projectile) a.kill();
        }

        // Paredes da borda. A parede da direita tem um buraco (y de 250 a 350) onde fica a porta
        this.criarParede(400, 10, 800, 20);     // cima
        this.criarParede(400, 590, 800, 20);    // baixo
        this.criarParede(10, 300, 20, 600);     // esquerda
        this.criarParede(790, 135, 20, 230);    // direita, parte de cima
        this.criarParede(790, 465, 20, 230);    // direita, parte de baixo

        // A porta começa fechada (laranja) e abre quando todos os robôs morrem
        this.porta = this.criarParede(790, 300, 20, 100, Color.Orange);
        this.portaAberta = false;

        // Obstáculos da sala
        const obstaculos = LAYOUTS[(this.sala - 1) % LAYOUTS.length];
        for (const o of obstaculos) {
            this.criarParede(o.x, o.y, o.w, o.h);
        }

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

        // Jogador volta pro lado esquerdo
        this.player.pos = vec(60, 300);
        this.player.vel = vec(0, 0);
    }

    private criarParede(x: number, y: number, w: number, h: number, cor?: Color): Wall {
        const parede = new Wall(x, y, w, h, cor);
        this.add(parede);
        this.entidadesSala.push(parede);
        return parede;
    }

    // Sorteia uma posição na metade direita da sala que não caia em cima de obstáculo
    private pontoLivre(obstaculos: Obstaculo[]): { x: number; y: number } {
        let x = 600;
        let y = 300;
        for (let tentativa = 0; tentativa < 50; tentativa++) {
            x = 280 + Math.random() * 460;
            y = 60 + Math.random() * 480;
            const batendo = obstaculos.some(
                (o) => Math.abs(x - o.x) < o.w / 2 + 40 && Math.abs(y - o.y) < o.h / 2 + 40
            );
            if (!batendo) break;
        }
        return { x, y };
    }

    override onPreLoad(loader: DefaultLoader): void {
        // Add any scene specific resources to load
    }

    override onActivate(context: SceneActivationContext<unknown>): void {
        // Called when Excalibur transitions to this scene
        // Only 1 scene is active at a time
    }

    override onDeactivate(context: SceneActivationContext): void {
        // Called when Excalibur transitions away from this scene
        // Only 1 scene is active at a time
    }

    override onPreUpdate(engine: Engine, elapsedMs: number): void {
        // Called before anything updates in the scene
    }

    override onPostUpdate(engine: Engine, elapsedMs: number): void {
        // Fim de jogo
        if (this.player.vida <= 0) {
            this.hud.text = `GAME OVER - ${Placar.pontos} pontos - aperte R`;
            if (engine.input.keyboard.wasPressed(Keys.R)) {
                window.location.reload(); // provisório: recarrega a página
            }
            return;
        }

        // Todos os robôs mortos? Abre a porta
        if (!this.portaAberta && this.robos.every((r) => r.isKilled())) {
            this.porta.kill();
            this.portaAberta = true;
        }

        // Porta aberta e jogador passou pelo buraco da direita? Próxima sala
        if (this.portaAberta && this.player.pos.x > 775) {
            this.sala += 1;
            Placar.pontos += 500; // bônus por limpar a sala
            this.iniciarSala();
        }

        const aviso = this.portaAberta ? "  >>> SAIA PELA DIREITA <<<" : "";
        this.hud.text = `Sala ${this.sala}   Vida: ${this.player.vida}   Pontos: ${Placar.pontos}${aviso}`;
    }

    override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called before Excalibur draws to the screen
    }

    override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called after Excalibur draws to the screen
    }
}