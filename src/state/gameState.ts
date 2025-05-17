import type { Bullet } from "../bullets/Bullet";
import type { Enemy } from "../enemy/Enemy";
import type { Obstacle } from "../obstacles/Obstacle";
import type { Camera } from "../player/Camera";
import type { Player } from "../player/Player";
import type { PowerUp } from "../powerups/PowerUp";

interface GameState {
  player: Player;
  camera: Camera;
  obstacles: Obstacle[];
  enemies: Enemy[];
  playerBullets: Bullet[];
  enemyBullets: Bullet[];
  powerUps: PowerUp[];
  wave: number;
  gameOver: boolean;
  keys: { [key: string]: boolean };
  waveEnding: number | null;
}

export const gameState: GameState = {
  player: null!,
  camera: null!,
  obstacles: [],
  enemies: [],
  playerBullets: [],
  enemyBullets: [],
  powerUps: [],
  wave: 1,
  gameOver: false,
  keys: {},
  waveEnding: null,
};
