import { gameState } from "./state/gameState";
import type { Bullet } from "./types/Bullet";

// Function to create bullets based on a firing pattern
export function fireBullets(
  x: number,
  y: number,
  bulletCount: number,
  initialAngle: number,
  bulletSpeed: number, // Use speed from firingPattern
  bulletColor: string, // Use color from player/enemy
  bulletRadius: number = 3
): Bullet[] {
  const bullets: Bullet[] = [];
  if (bulletCount <= 0) return bullets;

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
      color: bulletColor, // Set bullet color
    };
    bullets.push(bullet);
  }

  return bullets;
}

// Function to update bullet positions and handle collisions
export function updateBullets(bullets: Bullet[], canvas: HTMLCanvasElement) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;

    // Check for collisions with obstacles
    let collided = false;
    for (const obstacle of gameState.obstacles) {
      if (obstacle.type === "rectangle") {
        const closestX = Math.max(
          obstacle.x,
          Math.min(bullet.x, obstacle.x + obstacle.width!)
        );
        const closestY = Math.max(
          obstacle.y,
          Math.min(bullet.y, obstacle.y + obstacle.height!)
        );
        const distanceX = bullet.x - closestX;
        const distanceY = bullet.y - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;

        if (distanceSquared < bullet.radius * bullet.radius) {
          collided = true;
          break;
        }
      } else if (obstacle.type === "circle") {
        const distanceX = bullet.x - obstacle.x;
        const distanceY = bullet.y - obstacle.y;
        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY
        );
        const combinedRadius = bullet.radius + obstacle.radius!;

        if (distance < combinedRadius) {
          collided = true;
          break;
        }
      }
    }

    // Remove bullet if it collides with an obstacle or leaves the canvas
    if (
      collided ||
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
export function drawBullets(ctx: CanvasRenderingContext2D, bullets: Bullet[]) {
  ctx.save();
  ctx.translate(-gameState.camera.x, -gameState.camera.y);

  bullets.forEach((bullet) => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fillStyle = bullet.color;
    ctx.fill();
    ctx.closePath();
  });

  ctx.restore();
}
