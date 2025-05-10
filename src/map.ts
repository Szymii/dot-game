import type { Camera } from "./types/Camera";

// Draw the map bounds and wave number
export function drawMapBounds(
  ctx: CanvasRenderingContext2D,
  mapWidth: number,
  mapHeight: number,
  cameraX: number,
  cameraY: number,
  wave: number
) {
  ctx.save();
  ctx.translate(-cameraX, -cameraY);

  // Draw map bounds
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, mapWidth, mapHeight);

  ctx.restore();

  // Draw the wave number at the top center of the screen
  ctx.save();
  ctx.font = "bold 24px Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.strokeText(`Wave: ${wave}`, ctx.canvas.width / 2, 10); // Draw outline
  ctx.fillText(`Wave: ${wave}`, ctx.canvas.width / 2, 10); // Draw text
  ctx.restore();
}

// Draw the game end screen ("Game Over" or "Victory")
export function drawGameEndScreen(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  gameOver: boolean
) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  ctx.fillStyle = "black";
  ctx.fillRect(camera.x, camera.y, camera.width, camera.height);
  ctx.font = "48px Arial";
  ctx.fillStyle = gameOver ? "red" : "green";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const message = gameOver ? "You died" : "Victory!";
  ctx.fillText(
    message,
    camera.x + camera.width / 2,
    camera.y + camera.height / 2
  );
  ctx.restore();
}
