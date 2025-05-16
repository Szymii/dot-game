import type { Camera } from "../types/Camera";
import type { Player } from "../types/Player";
import type { Obstacle } from "../types/Obstacle";
import type { Enemy } from "../types/Enemy";
import type { Bullet } from "../types/Bullet";
import type { PowerUp } from "../types/PowerUp";

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
