import { gameState } from "../state/gameState";

export function drawMap(ctx: CanvasRenderingContext2D) {
  const app = document.getElementById("app")!;

  const mapWidth = ctx.canvas.width;
  const mapHeight = ctx.canvas.height;

  ctx.save();
  ctx.translate(-gameState.camera.x, -gameState.camera.y);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, mapWidth, mapHeight);

  ctx.restore();

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

export function drawGameEndScreen(ctx: CanvasRenderingContext2D) {
  const { camera, wave } = gameState;

  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  ctx.fillStyle = "black";
  ctx.fillRect(camera.x, camera.y, camera.width, camera.height);

  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
  ctx.shadowBlur = 4;

  ctx.font = "48px Arial";
  ctx.fillText(
    "You died",
    camera.x + camera.width / 2,
    camera.y + camera.height / 2 - 20
  );

  ctx.font = "24px Arial";
  ctx.fillText(
    `Wave ${wave}`,
    camera.x + camera.width / 2,
    camera.y + camera.height / 2 + 20
  );

  ctx.shadowBlur = 0;
  ctx.restore();
}
