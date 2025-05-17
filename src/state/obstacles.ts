import type { Obstacle } from "../obstacles/Obstacle";
import { GLOBALS } from "../state/GLOBALS";

export const obstacles: Obstacle[] = [
  {
    type: "rectangle",
    x: 250,
    y: 250,
    width: 60,
    height: 500,
    color: "#f4f4f5",
  },
  {
    type: "circle",
    x: GLOBALS.canvasW / 2 - 200,
    y: GLOBALS.canvasH / 2,
    radius: 100,
    color: "#fef9c3",
  },
  {
    type: "rectangle",
    x: GLOBALS.canvasW - 650,
    y: GLOBALS.canvasH - 450,
    width: 450,
    height: 250,
    color: "#f4f4f5",
  },
];
