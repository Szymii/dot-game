import { drawObstacles } from "./obstacles";
import {
  drawEnemies,
  updateEnemies,
  checkBulletCollisionsWithEnemies,
} from "./enemy";
import { drawMap, drawGameEndScreen } from "./map";
import { updateBullets, drawBullets } from "./bullets";
import {
  drawPowerUps,
  checkPowerUpCollisions,
  removeExpiredPowerUps,
} from "./powerups";
import type { Camera } from "./types/Camera";
import type { Player } from "./types/Player";
import type { Obstacle } from "./types/Obstacle";
import type { Enemy } from "./types/Enemy";
import type { Bullet } from "./types/Bullet";
import type { PowerUp } from "./types/PowerUp";
import {
  drawPlayer,
  updatePlayer,
  firePlayerBullets,
  checkBulletCollisionsWithPlayer,
  drawHealthBar,
} from "./player";
import { clearCanvas } from "./canvas";
import { generateEnemies } from "./defaults/enemies";

function updatePositionInfo(player: Player) {
  const positionInfo = document.getElementById("position-info")!;
  if (!positionInfo) return;

  positionInfo.textContent = `Position: x: ${Math.round(
    player.x
  )}, y: ${Math.round(player.y)} | HP: ${player.hp}`;
}

export async function startGameLoop(
  ctx: CanvasRenderingContext2D,
  player: Player,
  camera: Camera,
  keys: { [key: string]: boolean },
  obstacles: Obstacle[],
  onGameOver: () => void
) {
  let animationFrameId: number | null = null;

  let wave = 1;
  let gameOver = false;
  const playerBullets: Bullet[] = [];
  const enemyBullets: Bullet[] = [];
  const powerUps: PowerUp[] = [];

  let enemies: Enemy[] = generateEnemies(
    2,
    ctx.canvas.width,
    ctx.canvas.height,
    player,
    obstacles
  );

  function gameLoop(timestamp: number = 0) {
    if (gameOver) {
      drawGameEndScreen(ctx, camera, gameOver);
      onGameOver();
      return;
    }

    const bulletCollisionGameOver = checkBulletCollisionsWithPlayer(
      player,
      enemyBullets
    );

    if (bulletCollisionGameOver) {
      gameOver = true;
    }

    const { playerNextX, playerNextY } = updatePlayer(
      player,
      camera,
      keys,
      obstacles,
      ctx.canvas
    );

    firePlayerBullets(player, timestamp, playerBullets);

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

      enemies = generateEnemies(
        wave + 1,
        ctx.canvas.width,
        ctx.canvas.height,
        player,
        obstacles
      );
    }

    clearCanvas(ctx);

    drawPlayer(ctx, player, camera);
    drawBullets(ctx, playerBullets, camera.x, camera.y);
    drawHealthBar(ctx, player);

    drawEnemies(ctx, enemies, camera.x, camera.y);
    drawBullets(ctx, enemyBullets, camera.x, camera.y);

    drawPowerUps(ctx, powerUps, camera.x, camera.y);
    checkPowerUpCollisions(player, powerUps);
    removeExpiredPowerUps(powerUps, timestamp);

    drawObstacles(ctx, obstacles, camera.x, camera.y);
    drawMap(ctx, camera.x, camera.y, wave);

    updateBullets(enemyBullets, ctx.canvas, obstacles);
    updateBullets(playerBullets, ctx.canvas, obstacles);

    updatePositionInfo(player);

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  gameLoop();

  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}
