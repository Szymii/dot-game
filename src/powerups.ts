import type { Player } from "./types/Player";
import type { PowerUp } from "./types/PowerUp";
import { loadedIcons } from "./utils/preloadAssets";

export function drawPowerUps(
  ctx: CanvasRenderingContext2D,
  powerUps: PowerUp[],
  cameraX: number,
  cameraY: number
) {
  ctx.save();
  ctx.translate(-cameraX, -cameraY);

  powerUps.forEach((powerUp) => {
    const icon = loadedIcons[powerUp.type];
    if (icon) {
      const iconWidth = powerUp.width;
      const iconHeight = powerUp.height;

      ctx.beginPath();
      ctx.arc(
        powerUp.x,
        powerUp.y,
        Math.max(iconWidth, iconHeight) / 2 + 5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();
      ctx.closePath();

      ctx.drawImage(
        icon,
        powerUp.x - iconWidth / 2,
        powerUp.y - iconHeight / 2,
        iconWidth,
        iconHeight
      );
    }
  });

  ctx.restore();
}

export function checkPowerUpCollisions(
  player: Player,
  powerUps: PowerUp[]
): void {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];
    const dx = powerUp.x - player.x;
    const dy = powerUp.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Approximate collision using the player's radius and the power-up's dimensions
    const collisionDistance =
      player.radius + Math.max(powerUp.width, powerUp.height) / 2;

    if (distance < collisionDistance) {
      // Apply the power-up effect
      switch (powerUp.type) {
        case "extraBullet":
          player.firingPattern.bulletCount += 1;
          break;
        case "fasterFireRate":
          player.firingPattern.fireRate += 1;
          break;
        case "fasterBullets":
          player.firingPattern.speed += 2;
          break;
        default: {
          const exhaustiveCheck: never = powerUp.type;
          throw new Error(`Unhandled power-up type: ${exhaustiveCheck}`);
        }
      }
      // Remove the power-up after collection
      powerUps.splice(i, 1);
    }
  }
}
