export interface Player {
  x: number;
  y: number;
  radius: number;
  speed: number;
  color: string;
}

export function createPlayer(canvas: HTMLCanvasElement): Player {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    speed: 4,
    color: "rgb(244, 63, 94)", // Tailwind's rose-500
  };
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  // Draw player dot
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
}
