export function createCanvas(app: HTMLElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";
  canvas.className = "fixed top-0 left-0";
  app.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  // Set canvas to a fixed size larger than the screen
  canvas.width = 1200;
  canvas.height = 1200;

  // Initial clear
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Prevent scrollbars by ensuring body and html have no overflow
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  // Handle window resize to adjust rendering (not canvas size)
  window.addEventListener("resize", () => {
    // Redraw canvas (handled in gameLoop via camera)
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  return canvas;
}
