import type { FiringPattern } from "../bullets/FiringPattern";

export type TurretType = "fast" | "fastBullets" | "manyBullets";

export interface Turret {
  x: number;
  y: number;
  radius: number;
  type: TurretType;
  firingPattern: FiringPattern;
}
