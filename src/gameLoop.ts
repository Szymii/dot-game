import { drawPlayer } from "./player";
import { drawObstacles, checkCollision } from "./obstacles";
import type { Obstacle } from "./types/Obstacle";
import type { Player } from "./types/Player";
import type { Camera } from "./types/Camera";

export function startGameLoop(
  ctx: CanvasRenderingContext2D,
  player: Player,
  camera: Camera,
  keys: { [key: string]: boolean },
  obstacles: Obstacle[]
) {
  function gameLoop() {
    // Update camera to follow player
    camera.x = player.x - camera.width / 2;
    camera.y = player.y - camera.height / 2;

    // Clamp camera to canvas bounds
    const canvas = ctx.canvas;
    camera.x = Math.max(0, Math.min(canvas.width - camera.width, camera.x));
    camera.y = Math.max(0, Math.min(canvas.height - camera.height, camera.y));

    // Calculate movement direction
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

    // Update player position
    player.x += adjustedDx;
    player.y += adjustedDy;

    // Keep player within canvas bounds
    player.x = Math.max(
      player.radius,
      Math.min(canvas.width - player.radius, player.x)
    );
    player.y = Math.max(
      player.radius,
      Math.min(canvas.height - player.radius, player.y)
    );

    // Update position info
    const positionInfo = document.getElementById("position-info")!;
    positionInfo.textContent = `Position: x: ${Math.round(
      player.x
    )}, y: ${Math.round(player.y)}`;

    // Clear the visible area
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    ctx.fillStyle = "black";
    ctx.fillRect(camera.x, camera.y, camera.width, camera.height);
    ctx.restore();

    // Draw obstacles
    drawObstacles(ctx, obstacles, camera.x, camera.y);

    // Draw player
    drawPlayer(ctx, player, camera);

    requestAnimationFrame(gameLoop);
  }

  // Start game loop
  gameLoop();
}
