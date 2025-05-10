import type { Player } from "./types/Player";
import type { PowerUp } from "./types/PowerUp";

// Map of power-up types to their corresponding icon URLs
const powerUpIcons: Record<string, string> = {
  extraBullet: "/dot-game/extraBullet.svg",
  fasterFireRate: "/dot-game/fasterFireRate.svg",
  fasterBullets: "/dot-game/fasterBullets.svg",
};

// Object to store loaded images
const loadedIcons: Record<string, HTMLImageElement> = {};

// Function to preload power-up icons
export async function preloadPowerUpIcons(): Promise<void> {
  const loadPromises = Object.entries(powerUpIcons).map(([type, src]) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedIcons[type] = img;
        resolve();
      };
      img.onerror = () => {
        console.error(`Failed to load power-up icon: ${src}`);
        reject();
      };
    });
  });

  await Promise.all(loadPromises);
  console.log("All power-up icons loaded successfully");
}

// Draw power-ups on the canvas
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
      // Draw the icon centered at the power-up's position
      const iconWidth = powerUp.width;
      const iconHeight = powerUp.height;

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
// Check for collisions between the player and power-ups
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

// Remove power-ups that have expired (after 10 seconds)
export function removeExpiredPowerUps(
  powerUps: PowerUp[],
  currentTime: number
): void {
  const lifetime = 12000; // 10 seconds in milliseconds
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];
    if (currentTime - powerUp.spawnTime > lifetime) {
      powerUps.splice(i, 1);
    }
  }
}
