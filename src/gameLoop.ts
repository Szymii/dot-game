import { drawObstacles } from "./obstacles";
import {
  drawEnemies,
  updateEnemies,
  checkBulletCollisionsWithEnemies,
} from "./enemy";
import { drawMapBounds } from "./map";
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
import {
  drawPlayer,
  updatePlayer,
  firePlayerBullets,
  checkBulletCollisionsWithPlayer,
  drawHealthBar,
} from "./player";
import type { Bullet } from "./types/Bullet";
import type { PowerUp } from "./types/PowerUp";
import { generateEnemies } from "./assets/enemies";

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
  let gameWon = false;
  let animationFrameId: number | null = null;
  const playerBullets: Bullet[] = [];
  const enemyBullets: Bullet[] = [];
  const powerUps: PowerUp[] = [];

  let enemies: Enemy[] = generateEnemies(
    1,
    ctx.canvas.width,
    ctx.canvas.height
  ); // Start with 1 enemy
  let wave = 1; // Current wave (starts with 1 enemy)

  const mapWidth = ctx.canvas.width;
  const mapHeight = ctx.canvas.height;

  function gameLoop(timestamp: number = 0) {
    if (gameOver) {
      ctx.save();
      ctx.translate(-camera.x, -camera.y);
      ctx.fillStyle = "black";
      ctx.fillRect(camera.x, camera.y, camera.width, camera.height);
      ctx.font = "48px Arial";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "You died",
        camera.x + camera.width / 2,
        camera.y + camera.height / 2
      );
      ctx.restore();

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
        gameWon = true;
        return;
      }
      enemies = generateEnemies(wave, ctx.canvas.width, ctx.canvas.height);
    }

    checkPowerUpCollisions(player, powerUps);
    removeExpiredPowerUps(powerUps, timestamp);

    updateBullets(playerBullets, ctx.canvas, obstacles);
    updateBullets(enemyBullets, ctx.canvas, obstacles);

    const positionInfo = document.getElementById("position-info")!;
    positionInfo.textContent = `Position: x: ${Math.round(
      player.x
    )}, y: ${Math.round(player.y)} | HP: ${player.hp}`;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawMapBounds(ctx, mapWidth, mapHeight, camera.x, camera.y);
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
