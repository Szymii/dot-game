import type { Bullet } from "./types/Bullet";

// Function to create bullets based on a firing pattern
export function fireBullets(
  x: number,
  y: number,
  bulletCount: number,
  initialAngle: number,
  bulletSpeed: number = 5,
  bulletRadius: number = 3,
  bulletColor: string = "white"
): Bullet[] {
  const bullets: Bullet[] = [];
  if (bulletCount <= 0) return bullets;

  // Calculate angle increment (360 degrees / number of bullets)
  const angleIncrement = 360 / bulletCount;

  for (let i = 0; i < bulletCount; i++) {
    const angleDegrees = initialAngle + i * angleIncrement;
    const angleRadians = (angleDegrees * Math.PI) / 180;

    const vx = Math.cos(angleRadians) * bulletSpeed;
    const vy = Math.sin(angleRadians) * bulletSpeed;

    const bullet: Bullet = {
      x,
      y,
      vx,
      vy,
      radius: bulletRadius,
      speed: bulletSpeed,
      color: bulletColor,
    };
    bullets.push(bullet);
  }

  return bullets;
}

// Function to update bullet positions
export function updateBullets(bullets: Bullet[], canvas: HTMLCanvasElement) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;

    // Remove bullets that are outside the canvas
    if (
      bullet.x < 0 ||
      bullet.x > canvas.width ||
      bullet.y < 0 ||
      bullet.y > canvas.height
    ) {
      bullets.splice(i, 1);
    }
  }
}

// Function to draw bullets
export function drawBullets(
  ctx: CanvasRenderingContext2D,
  bullets: Bullet[],
  cameraX: number,
  cameraY: number
) {
  ctx.save();
  ctx.translate(-cameraX, -cameraY);

  bullets.forEach((bullet) => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fillStyle = bullet.color;
    ctx.fill();
    ctx.closePath();
  });

  ctx.restore();
}
