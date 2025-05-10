export function createCanvas(app: HTMLElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";
  canvas.className = "w-full h-screen";
  app.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Handle window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  return canvas;
}
