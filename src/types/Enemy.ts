export interface Enemy {
  x: number;
  y: number;
  radius: number;
  vx: number; // Velocity x (for bouncing)
  vy: number; // Velocity y (for bouncing)
  speed: number;
  color: string;
}
