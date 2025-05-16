import { gameState } from "../state/gameState";

// Draw the map bounds and wave number
export function drawMap(ctx: CanvasRenderingContext2D) {
  const app = document.getElementById("app")!;

  const mapWidth = ctx.canvas.width;
  const mapHeight = ctx.canvas.height;

  ctx.save();
  ctx.translate(-gameState.camera.x, -gameState.camera.y);

  // Draw map bounds
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
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
  ctx.fillText(`Wave: ${gameState.wave}`, app.offsetWidth - 60, 20);
  ctx.restore();
}

// Draw the game end screen ("Game Over" or "Victory")
export function drawGameEndScreen(ctx: CanvasRenderingContext2D) {
  const { camera, gameOver } = gameState;

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
