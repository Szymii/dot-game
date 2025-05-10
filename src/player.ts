import type { Obstacle } from "./types/Obstacle";
import { fireBullets } from "./bullets";
import { checkCollision } from "./obstacles";
import type { Player } from "./types/Player";
import type { Camera } from "./types/Camera";
import type { Bullet } from "./types/Bullet";

export function createPlayer(canvas: HTMLCanvasElement): {
  player: Player;
  camera: Camera;
} {
  const player: Player = {
    x: 600,
    y: 600,
    radius: 20,
    speed: 5,
    color: "red",
    firingPattern: {
      bulletCount: 4,
      initialAngle: 0,
      fireRate: 1,
      lastFired: 0,
      speed: 7,
    },
    hp: 10,
  };

  const camera: Camera = {
    x: player.x - canvas.width / 4,
    y: player.y - canvas.height / 4,
    width: canvas.width / 2,
    height: canvas.height / 2,
  };

  return { player, camera };
}

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  camera: Camera
) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  // Draw the player's dot
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
  camera.x = player.x - camera.width / 2;
  camera.y = player.y - camera.height / 2;
  camera.x = Math.max(0, Math.min(canvas.width - camera.width, camera.x));
  camera.y = Math.max(0, Math.min(canvas.height - camera.height, camera.y));

  let dx = 0;
  let dy = 0;
  if (keys.w) dy -= player.speed;
  if (keys.s) dy += player.speed;
  if (keys.a) dx -= player.speed;
  if (keys.d) dx += player.speed;

  if (dx !== 0 && dy !== 0) {
    const length = Math.sqrt(dx * dx + dy * dy);
    dx = (dx / length) * player.speed;
    dy = (dy / length) * player.speed;
  }

  const { dx: adjustedDx, dy: adjustedDy } = checkCollision(
    player,
    obstacles,
    dx,
    dy
  );
  const playerNextX = player.x + adjustedDx;
  const playerNextY = player.y + adjustedDy;

  player.x = playerNextX;
  player.y = playerNextY;

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

export function checkBulletCollisionsWithPlayer(
  player: Player,
  enemyBullets: Bullet[]
): boolean {
  let gameOver = false;

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const bullet = enemyBullets[i];
    const dx = bullet.x - player.x;
    const dy = bullet.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const combinedRadius = bullet.radius + player.radius;

    if (distance < combinedRadius) {
      player.hp -= 1;
      enemyBullets.splice(i, 1);
      if (player.hp <= 0) {
        gameOver = true;
        break;
      }
    }
  }

  return gameOver;
}

// Draw the player's health bar in the top-left corner of the camera view
export function drawHealthBar(ctx: CanvasRenderingContext2D, player: Player) {
  const maxHP = 10; // Initial HP of the player
  const barWidth = 200; // Larger width for better visibility
  const barHeight = 20; // Larger height for better visibility
  const barX = 10; // Position in screen space (top-left corner)
  const barY = 10;

  // Draw in screen space (no camera translation)
  // Background (red, for missing HP)
  ctx.fillStyle = "red";
  ctx.fillRect(barX, barY, barWidth, barHeight);

  // Foreground (green, for current HP)
  const currentWidth = (player.hp / maxHP) * barWidth;
  ctx.fillStyle = "green";
  ctx.fillRect(barX, barY, currentWidth, barHeight);

  // Draw border
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barY, barWidth, barHeight);

  // Optional: Draw HP text
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${player.hp}/${maxHP}`,
    barX + barWidth / 2,
    barY + barHeight / 2
  );
}
