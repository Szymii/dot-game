import type { Obstacle } from "../obstacles/Obstacle";
import type { Player } from "../player/Player";
import { getRandomColor } from "../utils/getRandomColor";
import type { Enemy } from "./Enemy";

function collidesWithObstacle(
  x: number,
  y: number,
  radius: number,
  obstacles: Obstacle[]
): boolean {
  for (const obstacle of obstacles) {
    if (obstacle.type === "rectangle") {
      const closestX = Math.max(
        obstacle.x,
        Math.min(x, obstacle.x + obstacle.width!)
      );
      const closestY = Math.max(
        obstacle.y,
        Math.min(y, obstacle.y + obstacle.height!)
      );
      const distanceX = x - closestX;
      const distanceY = y - closestY;
      const distanceSquared = distanceX * distanceX + distanceY * distanceY;

      if (distanceSquared < radius * radius) {
        return true;
      }
    } else if (obstacle.type === "circle") {
      const distanceX = x - obstacle.x;
      const distanceY = y - obstacle.y;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const combinedRadius = radius + obstacle.radius!;

      if (distance < combinedRadius) {
        return true;
      }
    }
  }
  return false;
}

function generateEnemy(
  canvasWidth: number,
  canvasHeight: number,
  player: Player,
  obstacles: Obstacle[]
): Enemy {
  const radius = 15;
  let x: number, y: number;
  let attempts = 0;
  const maxAttempts = 3;
  let tooCloseToPlayer = true;
  let collides = true;

  do {
    x = Math.random() * (canvasWidth - 60) + 30;
    y = Math.random() * (canvasHeight - 60) + 30;

    const dx = x - player.x;
    const dy = y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistanceFromPlayer = 100;

    tooCloseToPlayer =
      distance < minDistanceFromPlayer + player.radius + radius;
    collides = collidesWithObstacle(x, y, radius, obstacles);

    attempts++;
    if (attempts > maxAttempts) {
      // Fallback: If we can't find a valid position, spawn at a default safe location
      x = canvasWidth / 2;
      y = canvasHeight / 2;
      break;
    }
  } while (tooCloseToPlayer || collides);

  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 3 + 2;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  const hp = Math.floor(Math.random() * 4) + 2;

  // Random firing pattern
  const bulletCount = Math.floor(Math.random() * 5) + 1;
  const initialAngle = Math.random() * 360;
  const fireRate = Math.random() * 2 + 0.5;
  const bulletSpeed = Math.random() * 3 + 3;

  return {
    x,
    y,
    radius,
    vx,
    vy,
    speed,
    color: getRandomColor(),
    firingPattern: {
      bulletCount,
      initialAngle,
      fireRate,
      lastFired: 0,
      speed: bulletSpeed,
    },
    hp,
  };
}

export function generateEnemies(
  count: number,
  canvasWidth: number,
  canvasHeight: number,
  player: Player,
  obstacles: Obstacle[]
): Enemy[] {
  const enemies: Enemy[] = [];
  for (let i = 0; i < count; i++) {
    enemies.push(generateEnemy(canvasWidth, canvasHeight, player, obstacles));
  }
  return enemies;
}
