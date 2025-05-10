import type { FiringPattern } from "./FiringPattern";

export interface Enemy {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  speed: number;
  color: string;
  firingPattern: FiringPattern;
  hp: number;
}
