import { fireBullets } from "../bullets";
import { gameEvents } from "../events/EventEmitter";
import { gameState } from "../state/gameState";
import { getBrightness } from "../utils/getBrightness";

export function drawEnemies(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(-gameState.camera.x, -gameState.camera.y);

  gameState.enemies.forEach((enemy) => {
    // Draw the enemy
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fillStyle = enemy.color;
    ctx.fill();
    ctx.closePath();

    // Calculate brightness and pick contrasting text color
    const brightness = getBrightness(enemy.color);
    const textColor = brightness > 150 ? "black" : "white";

    // Draw HP centered on enemy
    ctx.fillStyle = textColor;
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${enemy.hp}`, enemy.x, enemy.y);
  });

  ctx.restore();
}

export function updateEnemies(
  canvas: HTMLCanvasElement,
  playerNextX: number,
  playerNextY: number,
  timestamp: number
): boolean {
  let gameOver = false;

  gameState.enemies.forEach((enemy, index) => {
    const speedMagnitude = Math.sqrt(enemy.vx * enemy.vx + enemy.vy * enemy.vy);
    if (speedMagnitude !== 0) {
      enemy.vx = (enemy.vx / speedMagnitude) * enemy.speed;
      enemy.vy = (enemy.vy / speedMagnitude) * enemy.speed;
    }

    // Enemy firing logic
    const timeSinceLastShot = timestamp - enemy.firingPattern.lastFired;
    const shotInterval = 1000 / enemy.firingPattern.fireRate;
    if (timeSinceLastShot >= shotInterval) {
      const newBullets = fireBullets(
        enemy.x,
        enemy.y,
        enemy.firingPattern.bulletCount,
        enemy.firingPattern.initialAngle,
        enemy.firingPattern.speed,
        enemy.color
      );
      gameState.enemyBullets.push(...newBullets);
      enemy.firingPattern.lastFired = timestamp;
    }

    let nextX = enemy.x + enemy.vx;
    let nextY = enemy.y + enemy.vy;

    if (nextX - enemy.radius < 0 || nextX + enemy.radius > canvas.width) {
      enemy.vx = -enemy.vx;
      nextX = enemy.x + enemy.vx;
    }
    if (nextY - enemy.radius < 0 || nextY + enemy.radius > canvas.height) {
      enemy.vy = -enemy.vy;
      nextY = enemy.y + enemy.vy;
    }

    gameState.obstacles.forEach((obstacle) => {
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

    const dx = nextX - playerNextX;
    const dy = nextY - playerNextY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < enemy.radius + gameState.player.radius) {
      gameOver = true;
      return;
    }

    for (let i = 0; i < gameState.enemies.length; i++) {
      if (i === index) continue;
      const otherEnemy = gameState.enemies[i];
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
          otherEnemy.y -= normalX * overlap * 0.5;
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

    enemy.x = nextX;
    enemy.y = nextY;
  });

  return gameOver;
}

export function checkBulletCollisionsWithEnemies(timestamp: number) {
  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    const enemy = gameState.enemies[i];
    for (let j = gameState.playerBullets.length - 1; j >= 0; j--) {
      const bullet = gameState.playerBullets[j];
      const dx = bullet.x - enemy.x;
      const dy = bullet.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const combinedRadius = bullet.radius + enemy.radius;

      if (distance < combinedRadius) {
        enemy.hp -= 1;
        gameState.playerBullets.splice(j, 1);
        if (enemy.hp <= 0) {
          gameEvents.emit("enemyKilled", enemy, timestamp);
          break;
        }
      }
    }
  }
}
