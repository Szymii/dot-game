import { type Player, drawPlayer } from "./player";

export function startGameLoop(
  ctx: CanvasRenderingContext2D,
  player: Player,
  keys: { [key: string]: boolean }
) {
  function gameLoop() {
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
    const canvas = ctx.canvas;
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

    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    drawPlayer(ctx, player);

    requestAnimationFrame(gameLoop);
  }

  // Start game loop
  gameLoop();
}
