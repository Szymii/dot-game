import type { Player } from "../player/Player";
import { gameState } from "../state/gameState";
import type { Obstacle } from "./Obstacle";

export function drawObstacles(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(-gameState.camera.x, -gameState.camera.y);

  gameState.obstacles.forEach((obstacle) => {
    if (obstacle.type === "rectangle") {
      ctx.fillStyle = obstacle.color;
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    if (obstacle.type === "circle") {
      ctx.beginPath();
      ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
      ctx.fillStyle = obstacle.color;
      ctx.fill();
    }
  });

  ctx.restore();
}

export function checkCollision(
  player: Player,
  obstacles: Obstacle[],
  dx: number,
  dy: number
): { dx: number; dy: number } {
  let newDx = dx;
  let newDy = dy;

  let nextX = player.x + newDx;
  let nextY = player.y + newDy;

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

      // Collision if distance is less than player’s radius
      if (distanceSquared < player.radius * player.radius) {
        // Calculate overlap (how much the player penetrated)
        const distance = Math.sqrt(distanceSquared);
        const overlap = player.radius - distance;
        if (distance === 0) {
          // Assume a default direction (e.g., push right)
          nextX += overlap;
        } else {
          // Push back along the normal (shortest path out)
          const normalX = distanceX / distance;
          const normalY = distanceY / distance;
          nextX += normalX * overlap;
          nextY += normalY * overlap;
        }
      }
    } else if (obstacle.type === "circle") {
      const distanceX = nextX - obstacle.x;
      const distanceY = nextY - obstacle.y;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const combinedRadius = player.radius + obstacle.radius!;

      if (distance < combinedRadius) {
        // Calculate overlap
        const overlap = combinedRadius - distance;
        if (distance === 0) {
          // Push right arbitrarily
          nextX += overlap;
        } else {
          // Push back along the normal
          const normalX = distanceX / distance;
          const normalY = distanceY / distance;
          nextX += normalX * overlap;
          nextY += normalY * overlap;
        }
      }
    }
  });

  newDx = nextX - player.x;
  newDy = nextY - player.y;

  return { dx: newDx, dy: newDy };
}
