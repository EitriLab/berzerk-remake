import { Color, DefaultLoader, Engine, ExcaliburGraphicsContext, Font, Keys, Label, Scene, SceneActivationContext, vec } from "excalibur";
import { Player } from "../actors/Player";
import { Wall } from "../actors/Wall";
import { Robot } from "../actors/Robot";

export class MyLevel extends Scene {
    private player!: Player;
    private hud!: Label;

    override onInitialize(engine: Engine): void {
        // Scene.onInitialize is where we recommend you perform the composition for your game
        this.player = new Player();
        this.add(this.player); // Actors need to be added to a scene to be drawn

        // Paredes da borda (sala de 800x600). Parâmetros: x e y do CENTRO, largura, altura
        this.add(new Wall(400, 10, 800, 20));   // cima
        this.add(new Wall(400, 590, 800, 20));  // baixo
        this.add(new Wall(10, 300, 20, 600));   // esquerda
        this.add(new Wall(790, 300, 20, 600));  // direita

        // Obstáculos no meio (estilo labirinto do Berzerk)
        this.add(new Wall(300, 250, 20, 200));
        this.add(new Wall(550, 400, 200, 20));

        // Robôs inimigos (recebem o player como alvo)
        this.add(new Robot(650, 100, this.player));
        this.add(new Robot(650, 500, this.player));
        this.add(new Robot(400, 500, this.player));

        // Texto de vida no canto da tela
        this.hud = new Label({
            text: "Vida: 3",
            pos: vec(30, 40),
            font: new Font({ size: 20, color: Color.White }),
        });
        this.hud.z = 100; // desenha por cima de tudo
        this.add(this.hud);
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
        if (this.player.vida > 0) {
            this.hud.text = `Vida: ${this.player.vida}`;
        } else {
            this.hud.text = "GAME OVER - aperte R";
            if (engine.input.keyboard.wasPressed(Keys.R)) {
                window.location.reload(); // provisório: recarrega a página
            }
        }
    }

    override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called before Excalibur draws to the screen
    }

    override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called after Excalibur draws to the screen
    }
}
