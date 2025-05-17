export type PowerUpType =
  | "extraBullet"
  | "fasterFireRate"
  | "fasterBullets"
  | "heal";

export type PowerUp = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: PowerUpType;
  spawnTime: number;
};
