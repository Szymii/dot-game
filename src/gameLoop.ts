import { drawObstacles } from "./obstacles";
import { drawEnemies, updateEnemies } from "./enemy";
import { drawMapBounds } from "./map";
import { updateBullets, drawBullets } from "./bullets";
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

export function startGameLoop(
  ctx: CanvasRenderingContext2D,
  player: Player,
  camera: Camera,
  keys: { [key: string]: boolean },
  obstacles: Obstacle[],
  enemies: Enemy[],
  onGameOver: () => void
) {
  let gameOver = false;
  let animationFrameId: number | null = null;
  const playerBullets: Bullet[] = [];
  const enemyBullets: Bullet[] = [];

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
