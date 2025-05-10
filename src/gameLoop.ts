import { drawObstacles, checkCollision } from "./obstacles";
import { drawEnemies, updateEnemies } from "./enemy";
import { drawMapBounds } from "./map";
import type { Camera } from "./types/Camera";
import type { Player } from "./types/Player";
import type { Obstacle } from "./types/Obstacle";
import type { Enemy } from "./types/Enemy";
import { drawPlayer } from "./player";

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

  const mapWidth = ctx.canvas.width;
  const mapHeight = ctx.canvas.height;

  function gameLoop() {
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

    camera.x = player.x - camera.width / 2;
    camera.y = player.y - camera.height / 2;

    const canvas = ctx.canvas;
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

    gameOver = updateEnemies(
      enemies,
      player,
      playerNextX,
      playerNextY,
      obstacles,
      canvas
    );

    const positionInfo = document.getElementById("position-info")!;
    positionInfo.textContent = `Position: x: ${Math.round(
      player.x
    )}, y: ${Math.round(player.y)}`;

    // Clear the entire canvas (not just the camera view)
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the map bounds (before drawing other elements)
    drawMapBounds(ctx, mapWidth, mapHeight, camera.x, camera.y);
    drawObstacles(ctx, obstacles, camera.x, camera.y);
    drawEnemies(ctx, enemies, camera.x, camera.y);
    drawPlayer(ctx, player, camera);

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  gameLoop();

  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}
