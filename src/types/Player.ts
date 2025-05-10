import type { FiringPattern } from "./FiringPattern";

export interface Player {
  x: number;
  y: number;
  radius: number;
  speed: number;
  color: string;
  firingPattern: FiringPattern;
}
