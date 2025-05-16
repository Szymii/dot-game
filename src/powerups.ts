import { gameState } from "./state/gameState";
import { loadedIcons } from "./utils/preloadAssets";

export function drawPowerUps(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(-gameState.camera.x, -gameState.camera.y);

  gameState.powerUps.forEach((powerUp) => {
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

export function checkPowerUpCollisions(): void {
  for (let i = gameState.powerUps.length - 1; i >= 0; i--) {
    const powerUp = gameState.powerUps[i];
    const dx = powerUp.x - gameState.player.x;
    const dy = powerUp.y - gameState.player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const collisionDistance =
      gameState.player.radius + Math.max(powerUp.width, powerUp.height) / 2;

    if (distance < collisionDistance) {
      // Apply the power-up effect
      switch (powerUp.type) {
        case "extraBullet":
          gameState.player.firingPattern.bulletCount += 1;
          break;
        case "fasterFireRate":
          gameState.player.firingPattern.fireRate += 1;
          break;
        case "fasterBullets":
          gameState.player.firingPattern.speed += 2;
          break;
        default: {
          const exhaustiveCheck: never = powerUp.type;
          throw new Error(`Unhandled power-up type: ${exhaustiveCheck}`);
        }
      }
      // Remove the power-up after collection
      gameState.powerUps.splice(i, 1);
    }
  }
}
