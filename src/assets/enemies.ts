import type { Enemy } from "../types/Enemy";

export const enemies: Enemy[] = [
  {
    x: 200,
    y: 200,
    radius: 10,
    vx: 2,
    vy: 1,
    speed: 5,
    color: "yellow",
    firingPattern: {
      bulletCount: 2, // 2 bullets: 90, 270 degrees
      initialAngle: 90,
      fireRate: 0.5, // 1 shot every 2 seconds
      lastFired: 0,
    },
  },
  {
    x: 1000,
    y: 300,
    radius: 10,
    vx: -1,
    vy: 2,
    speed: 2,
    color: "blue",
    firingPattern: {
      bulletCount: 3, // 3 bullets: 0, 120, 240 degrees
      initialAngle: 0,
      fireRate: 1, // 1 shot per second
      lastFired: 0,
    },
  },
  {
    x: 400,
    y: 900,
    radius: 10,
    vx: 1,
    vy: -2,
    speed: 3,
    color: "pink",
    firingPattern: {
      bulletCount: 1, // 1 bullet: 45 degrees
      initialAngle: 45,
      fireRate: 2, // 2 shots per second
      lastFired: 0,
    },
  },
];
