import { drawObstacles } from "./obstacles";
import {
  drawEnemies,
  updateEnemies,
  checkBulletCollisionsWithEnemies,
} from "./enemy";
import { drawMapBounds, drawGameEndScreen } from "./map";
import { updateBullets, drawBullets } from "./bullets";
import {
  drawPowerUps,
  checkPowerUpCollisions,
  removeExpiredPowerUps,
  preloadPowerUpIcons,
} from "./powerups";
import type { Camera } from "./types/Camera";
import type { Player } from "./types/Player";
import type { Obstacle } from "./types/Obstacle";
import type { Enemy } from "./types/Enemy";
import type { Bullet } from "./types/Bullet";
import type { PowerUp } from "./types/PowerUp";
import { generateEnemies } from "./assets/enemies";
import {
  drawPlayer,
  updatePlayer,
  firePlayerBullets,
  checkBulletCollisionsWithPlayer,
  drawHealthBar,
} from "./player";

function updatePositionInfo(player: Player) {
  const positionInfo = document.getElementById("position-info")!;
  positionInfo.textContent = `Position: x: ${Math.round(
    player.x
  )}, y: ${Math.round(player.y)} | HP: ${player.hp}`;
}

function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export async function startGameLoop(
  ctx: CanvasRenderingContext2D,
  player: Player,
  camera: Camera,
  keys: { [key: string]: boolean },
  obstacles: Obstacle[],
  onGameOver: () => void
) {
  await preloadPowerUpIcons();

  let gameOver = false;
  let animationFrameId: number | null = null;
  const playerBullets: Bullet[] = [];
  const enemyBullets: Bullet[] = [];
  const powerUps: PowerUp[] = [];

  let enemies: Enemy[] = generateEnemies(
    1,
    ctx.canvas.width,
    ctx.canvas.height,
    player,
    obstacles
  );

  let wave = 1;

  const mapWidth = ctx.canvas.width;
  const mapHeight = ctx.canvas.height;

  function gameLoop(timestamp: number = 0) {
    if (gameOver) {
      drawGameEndScreen(ctx, camera, gameOver);
      onGameOver();
      return;
    }

    const { playerNextX, playerNextY } = updatePlayer(
      player,
      camera,
      keys,
      obstacles,
      ctx.canvas
    );

    firePlayerBullets(player, timestamp, playerBullets);

    const bulletCollisionGameOver = checkBulletCollisionsWithPlayer(
      player,
      enemyBullets
    );
    if (bulletCollisionGameOver) {
      gameOver = true;
    }

    const enemyCollisionGameOver = updateEnemies(
      enemies,
      player,
      playerNextX,
      playerNextY,
      obstacles,
      ctx.canvas,
      enemyBullets,
      timestamp
    );
    if (enemyCollisionGameOver) {
      gameOver = true;
    }

    checkBulletCollisionsWithEnemies(
      enemies,
      playerBullets,
      powerUps,
      timestamp
    );

    if (enemies.length === 0 && !gameOver) {
      wave++;
      if (wave > 4) {
        drawGameEndScreen(ctx, camera, gameOver);
        onGameOver();
        return;
      }
      enemies = generateEnemies(
        wave,
        ctx.canvas.width,
        ctx.canvas.height,
        player,
        obstacles
      );
    }

    checkPowerUpCollisions(player, powerUps);
    removeExpiredPowerUps(powerUps, timestamp);

    updateBullets(playerBullets, ctx.canvas, obstacles);
    updateBullets(enemyBullets, ctx.canvas, obstacles);

    updatePositionInfo(player);

    clearCanvas(ctx);

    drawMapBounds(ctx, mapWidth, mapHeight, camera.x, camera.y, wave);
    drawBullets(ctx, playerBullets, camera.x, camera.y);
    drawBullets(ctx, enemyBullets, camera.x, camera.y);
    drawObstacles(ctx, obstacles, camera.x, camera.y);
    drawEnemies(ctx, enemies, camera.x, camera.y);
    drawPlayer(ctx, player, camera);
    drawPowerUps(ctx, powerUps, camera.x, camera.y);
    drawHealthBar(ctx, player);

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  gameLoop();

  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}
