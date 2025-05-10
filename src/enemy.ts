import type { Enemy } from "./types/Enemy";
import type { Obstacle } from "./types/Obstacle";
import type { Player } from "./types/Player";

// Draw enemies (translated by camera)
export function drawEnemies(
  ctx: CanvasRenderingContext2D,
  enemies: Enemy[],
  cameraX: number,
  cameraY: number
) {
  ctx.save();
  ctx.translate(-cameraX, -cameraY);

  enemies.forEach((enemy) => {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fillStyle = enemy.color;
    ctx.fill();
    ctx.closePath();
  });

  ctx.restore();
}

// Update enemy positions and handle collisions
export function updateEnemies(
  enemies: Enemy[],
  player: Player,
  playerNextX: number,
  playerNextY: number,
  obstacles: Obstacle[],
  canvas: HTMLCanvasElement
): boolean {
  let gameOver = false;

  enemies.forEach((enemy, index) => {
    // Normalize velocity to ensure consistent speed
    const speedMagnitude = Math.sqrt(enemy.vx * enemy.vx + enemy.vy * enemy.vy);
    if (speedMagnitude !== 0) {
      enemy.vx = (enemy.vx / speedMagnitude) * enemy.speed;
      enemy.vy = (enemy.vy / speedMagnitude) * enemy.speed;
    }

    // Store proposed position
    let nextX = enemy.x + enemy.vx;
    let nextY = enemy.y + enemy.vy;

    // Collision with canvas bounds
    if (nextX - enemy.radius < 0 || nextX + enemy.radius > canvas.width) {
      enemy.vx = -enemy.vx;
      nextX = enemy.x + enemy.vx;
    }
    if (nextY - enemy.radius < 0 || nextY + enemy.radius > canvas.height) {
      enemy.vy = -enemy.vy;
      nextY = enemy.y + enemy.vy;
    }

    // Collision with obstacles
    obstacles.forEach((obstacle) => {
      if (obstacle.type === "rectangle") {
        const closestX = Math.max(
          obstacle.x,
          Math.min(nextX, obstacle.x + obstacle.width!)
        );
        const closestY = Math.max(
          obstacle.y,
          Math.min(nextY, obstacle.y + obstacle.height!)
        );
        const distanceX = nextX - closestX;
        const distanceY = nextY - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;

        if (distanceSquared < enemy.radius * enemy.radius) {
          const distance = Math.sqrt(distanceSquared);
          if (distance !== 0) {
            const normalX = distanceX / distance;
            const normalY = distanceY / distance;
            const dot = enemy.vx * normalX + enemy.vy * normalY;
            enemy.vx -= 2 * dot * normalX;
            enemy.vy -= 2 * dot * normalY;
            enemy.vx += (Math.random() - 0.5) * 0.5;
            enemy.vy += (Math.random() - 0.5) * 0.5;
            const speedMagnitude = Math.sqrt(
              enemy.vx * enemy.vx + enemy.vy * enemy.vy
            );
            enemy.vx = (enemy.vx / speedMagnitude) * enemy.speed;
            enemy.vy = (enemy.vy / speedMagnitude) * enemy.speed;
          } else {
            enemy.vx = -enemy.vx;
            enemy.vy = -enemy.vy;
          }
          nextX = enemy.x + enemy.vx;
          nextY = enemy.y + enemy.vy;
        }
      } else if (obstacle.type === "circle") {
        const distanceX = nextX - obstacle.x;
        const distanceY = nextY - obstacle.y;
        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY
        );
        const combinedRadius = enemy.radius + obstacle.radius!;

        if (distance < combinedRadius) {
          if (distance !== 0) {
            const normalX = distanceX / distance;
            const normalY = distanceY / distance;
            const dot = enemy.vx * normalX + enemy.vy * normalY;
            enemy.vx -= 2 * dot * normalX;
            enemy.vy -= 2 * dot * normalY;
            enemy.vx += (Math.random() - 0.5) * 0.5;
            enemy.vy += (Math.random() - 0.5) * 0.5;
            const speedMagnitude = Math.sqrt(
              enemy.vx * enemy.vx + enemy.vy * enemy.vy
            );
            enemy.vx = (enemy.vx / speedMagnitude) * enemy.speed;
            enemy.vy = (enemy.vy / speedMagnitude) * enemy.speed;
          } else {
            enemy.vx = -enemy.vx;
            enemy.vy = -enemy.vy;
          }
          nextX = enemy.x + enemy.vx;
          nextY = enemy.y + enemy.vy;
        }
      }
    });

    // Collision with player (using player’s new position)
    const dx = nextX - playerNextX;
    const dy = nextY - playerNextY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < enemy.radius + player.radius) {
      gameOver = true; // Signal to stop the game
      return; // Stop updating enemies
    }

    // Collision with other enemies
    for (let i = 0; i < enemies.length; i++) {
      if (i === index) continue;
      const otherEnemy = enemies[i];
      const enemyDistanceX = nextX - otherEnemy.x;
      const enemyDistanceY = nextY - otherEnemy.y;
      const enemyDistance = Math.sqrt(
        enemyDistanceX * enemyDistanceX + enemyDistanceY * enemyDistanceY
      );
      const enemyCombinedRadius = enemy.radius + otherEnemy.radius;

      if (enemyDistance < enemyCombinedRadius) {
        const overlap = enemyCombinedRadius - enemyDistance;
        if (enemyDistance !== 0) {
          const normalX = enemyDistanceX / enemyDistance;
          const normalY = enemyDistanceY / enemyDistance;
          nextX += normalX * overlap * 0.5;
          nextY += normalY * overlap * 0.5;
          otherEnemy.x -= normalX * overlap * 0.5;
          otherEnemy.y -= normalY * overlap * 0.5;

          const dot = enemy.vx * normalX + enemy.vy * normalY;
          enemy.vx -= 2 * dot * normalX;
          enemy.vy -= 2 * dot * normalY;
          enemy.vx += (Math.random() - 0.5) * 0.5;
          enemy.vy += (Math.random() - 0.5) * 0.5;
          const speedMagnitude = Math.sqrt(
            enemy.vx * enemy.vx + enemy.vy * enemy.vy
          );
          enemy.vx = (enemy.vx / speedMagnitude) * enemy.speed;
          enemy.vy = (enemy.vy / speedMagnitude) * enemy.speed;
        } else {
          nextX += overlap;
          enemy.vx = -enemy.vx;
          enemy.vy = -enemy.vy;
        }
        nextX = enemy.x + enemy.vx;
        nextY = enemy.y + enemy.vy;
      }
    }

    // Update position
    enemy.x = nextX;
    enemy.y = nextY;
  });

  return gameOver;
}
