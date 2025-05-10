import { fireBullets } from "./bullets";
import { checkCollision } from "./obstacles";
import type { Bullet } from "./types/Bullet";
import type { Camera } from "./types/Camera";
import type { Obstacle } from "./types/Obstacle";
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

export function updatePlayer(
  player: Player,
  camera: Camera,
  keys: { [key: string]: boolean },
  obstacles: Obstacle[],
  canvas: HTMLCanvasElement
): { playerNextX: number; playerNextY: number } {
  // Update camera position to follow the player
  camera.x = player.x - camera.width / 2;
  camera.y = player.y - camera.height / 2;
  camera.x = Math.max(0, Math.min(canvas.width - camera.width, camera.x));
  camera.y = Math.max(0, Math.min(canvas.height - camera.height, camera.y));

  // Calculate movement direction based on keys
  let dx = 0;
  let dy = 0;
  if (keys.w) dy -= player.speed;
  if (keys.s) dy += player.speed;
  if (keys.a) dx -= player.speed;
  if (keys.d) dx += player.speed;

  // Normalize diagonal movement
  if (dx !== 0 && dy !== 0) {
    const length = Math.sqrt(dx * dx + dy * dy);
    dx = (dx / length) * player.speed;
    dy = (dy / length) * player.speed;
  }

  // Check collisions with obstacles
  const { dx: adjustedDx, dy: adjustedDy } = checkCollision(
    player,
    obstacles,
    dx,
    dy
  );
  const playerNextX = player.x + adjustedDx;
  const playerNextY = player.y + adjustedDy;

  // Update player position
  player.x = playerNextX;
  player.y = playerNextY;

  // Keep player within canvas bounds
  player.x = Math.max(
    player.radius,
    Math.min(canvas.width - player.radius, player.x)
  );
  player.y = Math.max(
    player.radius,
    Math.min(canvas.height - player.radius, player.y)
  );

  return { playerNextX, playerNextY };
}

export function firePlayerBullets(
  player: Player,
  timestamp: number,
  playerBullets: Bullet[]
) {
  const timeSinceLastShot = timestamp - player.firingPattern.lastFired;
  const shotInterval = 1000 / player.firingPattern.fireRate;
  if (timeSinceLastShot >= shotInterval) {
    const newBullets = fireBullets(
      player.x,
      player.y,
      player.firingPattern.bulletCount,
      player.firingPattern.initialAngle,
      player.firingPattern.speed,
      player.color
    );
    playerBullets.push(...newBullets);
    player.firingPattern.lastFired = timestamp;
  }
}
