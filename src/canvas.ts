import { GLOBALS } from "./state/GLOBALS";

export function createCanvas(app: HTMLElement): HTMLCanvasElement {
  app.className =
    "overflow-hidden bg-[url('/dot-game/space-bg.jpg')] bg-cover bg-center";

  const canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";
  app.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  canvas.width = GLOBALS.canvasW;
  canvas.height = GLOBALS.canvasH;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  return canvas;
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
