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
  },
  {
    x: 1000,
    y: 300,
    radius: 10,
    vx: -1,
    vy: 2,
    speed: 2,
    color: "blue",
  },
  {
    x: 400,
    y: 900,
    radius: 10,
    vx: 1,
    vy: -2,
    speed: 3,
    color: "pink",
  },
];
