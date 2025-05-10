import type { Camera } from "./types/Camera";
import type { Player } from "./types/Player";

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  camera: Camera
) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();

  // Draw "You" text
  ctx.font = "14px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("You", player.x, player.y);

  ctx.restore();
}
