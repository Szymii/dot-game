import type { Camera } from "./types/Camera";
import type { Player } from "./types/Player";

export function createPlayer(canvas: HTMLCanvasElement): {
  player: Player;
  camera: Camera;
} {
  const player = {
    x: canvas.width / 2, // Center in large canvas
    y: canvas.height / 2,
    radius: 20,
    speed: 4,
    color: "rgb(244, 63, 94)", // Tailwind's rose-500
  };

  const camera = {
    x: player.x - window.innerWidth / 2, // Center camera on player
    y: player.y - window.innerHeight / 2,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  return { player, camera };
}

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  camera: Camera
) {
  // Translate context to camera position
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  // Draw player dot
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
