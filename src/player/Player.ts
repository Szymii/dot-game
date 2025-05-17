import type { FiringPattern } from "../bullets/FiringPattern";

export interface Player {
  x: number;
  y: number;
  radius: number;
  speed: number;
  color: string;
  firingPattern: FiringPattern;
  hp: number;
  maxHp: number;
}
