import type { Obstacle } from "../types/Obstacle";

export const obstacles: Obstacle[] = [
  {
    type: "rectangle",
    x: 300,
    y: 300,
    width: 100,
    height: 50,
    color: "gray",
  },
  {
    type: "circle",
    x: 500,
    y: 500,
    radius: 30,
    color: "gray",
  },
  {
    type: "rectangle",
    x: 800,
    y: 700,
    width: 150,
    height: 60,
    color: "gray",
  },
];
