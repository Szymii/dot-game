import { create } from "zustand";
import type { Player } from "../types/Player";
// import type { PowerUp } from "../types/PowerUp";
// import type { Obstacle } from "../types/Obstacle";
// import type { Enemy } from "../types/Enemy";
// import type { Camera } from "../types/Camera";

interface GameState {
  player: Player;
  // camera: Camera;
  // powerUps: PowerUp[];
  // obstacles: Obstacle[];
  // enemies: Enemy[];
}

export const useGameStore = create<GameState>((set) => ({}));
