import { type Player, type Camera, drawPlayer } from "./player";

export function startGameLoop(
  ctx: CanvasRenderingContext2D,
  player: Player,
  camera: Camera,
  keys: { [key: string]: boolean }
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

    // Update player position
    player.x += dx;
    player.y += dy;

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

    // Clear only the visible area
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    ctx.fillStyle = "black";
    ctx.fillRect(camera.x, camera.y, camera.width, camera.height);
    ctx.restore();

    // Draw player
    drawPlayer(ctx, player, camera);

    requestAnimationFrame(gameLoop);
  }

  // Start game loop
  gameLoop();
}
