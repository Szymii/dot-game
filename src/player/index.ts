// player.ts
import { fireBullets } from "../bullets";
import { checkCollision } from "../obstacles";
import { gameState } from "../state/gameState";
import { getBrightness } from "../utils/getBrightness";

export function drawPlayer(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(-gameState.camera.x, -gameState.camera.y);

  ctx.beginPath();
  ctx.arc(
    gameState.player.x,
    gameState.player.y,
    gameState.player.radius,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = gameState.player.color;
  ctx.fill();
  ctx.closePath();

  const brightness = getBrightness(gameState.player.color);
  const textColor = brightness > 150 ? "black" : "white";

  ctx.font = "bold 14px Arial";
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("You", gameState.player.x, gameState.player.y);

  ctx.restore();
}

export function updatePlayer(canvas: HTMLCanvasElement): {
  playerNextX: number;
  playerNextY: number;
} {
  gameState.camera.x = gameState.player.x - gameState.camera.width / 2;
  gameState.camera.y = gameState.player.y - gameState.camera.height / 2;
  gameState.camera.x = Math.max(
    0,
    Math.min(canvas.width - gameState.camera.width, gameState.camera.x)
  );
  gameState.camera.y = Math.max(
    0,
    Math.min(canvas.height - gameState.camera.height, gameState.camera.y)
  );

  let dx = 0;
  let dy = 0;
  if (gameState.keys.w) dy -= gameState.player.speed;
  if (gameState.keys.s) dy += gameState.player.speed;
  if (gameState.keys.a) dx -= gameState.player.speed;
  if (gameState.keys.d) dx += gameState.player.speed;

  if (dx !== 0 && dy !== 0) {
    const length = Math.sqrt(dx * dx + dy * dy);
    dx = (dx / length) * gameState.player.speed;
    dy = (dy / length) * gameState.player.speed;
  }

  const { dx: adjustedDx, dy: adjustedDy } = checkCollision(
    gameState.player,
    gameState.obstacles,
    dx,
    dy
  );
  const playerNextX = gameState.player.x + adjustedDx;
  const playerNextY = gameState.player.y + adjustedDy;

  gameState.player.x = playerNextX;
  gameState.player.y = playerNextY;

  gameState.player.x = Math.max(
    gameState.player.radius,
    Math.min(canvas.width - gameState.player.radius, gameState.player.x)
  );
  gameState.player.y = Math.max(
    gameState.player.radius,
    Math.min(canvas.height - gameState.player.radius, gameState.player.y)
  );

  return { playerNextX, playerNextY };
}

export function firePlayerBullets(timestamp: number) {
  const timeSinceLastShot =
    timestamp - gameState.player.firingPattern.lastFired;
  const shotInterval = 1000 / gameState.player.firingPattern.fireRate;
  if (timeSinceLastShot >= shotInterval) {
    const newBullets = fireBullets(
      gameState.player.x,
      gameState.player.y,
      gameState.player.firingPattern.bulletCount,
      gameState.player.firingPattern.initialAngle,
      gameState.player.firingPattern.speed,
      gameState.player.color
    );
    gameState.playerBullets.push(...newBullets);
    gameState.player.firingPattern.lastFired = timestamp;
  }
}

export function checkBulletCollisionsWithPlayer(): boolean {
  let gameOver = false;

  for (let i = gameState.enemyBullets.length - 1; i >= 0; i--) {
    const bullet = gameState.enemyBullets[i];
    const dx = bullet.x - gameState.player.x;
    const dy = bullet.y - gameState.player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const combinedRadius = bullet.radius + gameState.player.radius;

    if (distance < combinedRadius) {
      gameState.player.hp -= 1;
      gameState.enemyBullets.splice(i, 1);
      if (gameState.player.hp <= 0) {
        gameOver = true;
        break;
      }
    }
  }

  return gameOver;
}

export function drawHealthBar(ctx: CanvasRenderingContext2D) {
  const maxHP = gameState.player.maxHp;
  const barWidth = 200;
  const barHeight = 20;

  const barX = 20;
  const barY = 20;

  ctx.fillStyle = "red";
  ctx.fillRect(barX, barY, barWidth, barHeight);

  const currentWidth = (gameState.player.hp / maxHP) * barWidth;
  ctx.fillStyle = "green";
  ctx.fillRect(barX, barY, currentWidth, barHeight);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barY, barWidth, barHeight);

  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${gameState.player.hp}/${maxHP}`,
    barX + barWidth / 2,
    barY + barHeight / 2
  );
}
