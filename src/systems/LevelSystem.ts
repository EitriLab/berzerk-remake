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
    [{ x: 300, y: 200, w: