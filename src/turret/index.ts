import { fireBullets } from "../bullets";
import { gameEvents } from "../events/EventEmitter";
import { gameState } from "../state/gameState";
import { loadedIcons } from "../utils/preloadAssets";
import type { Turret, TurretType } from "./Turret";

export const turretIconMap: Record<TurretType, keyof typeof loadedIcons> = {
  fast: "fastTurret",
  fastBullets: "fastBulletTurret",
  manyBullets: "multiBulletTurret",
};

export function drawTurrets(
  ctx: CanvasRenderingContext2D,
  previewTurret: Turret | null
) {
  ctx.save();
  ctx.translate(-gameState.camera.x, -gameState.camera.y);

  gameState.turrets.forEach((turret) => {
    const iconKey = turretIconMap[turret.type];
    const icon = loadedIcons[iconKey];

    const size = turret.radius * 2;
    ctx.drawImage(icon, turret.x - size / 2, turret.y - size / 2, size, size);
  });

  if (previewTurret) {
    const iconKey = turretIconMap[previewTurret.type];
    const icon = loadedIcons[iconKey];

    ctx.globalAlpha = 0.7;
    const size = previewTurret.radius * 2;
    ctx.drawImage(
      icon,
      previewTurret.x - size / 2,
      previewTurret.y - size / 2,
      size,
      size
    );
    ctx.globalAlpha = 1.0;
  }

  gameState.turretBullets.forEach((bullet) => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fillStyle = bullet.color;
    ctx.fill();
    ctx.closePath();
  });

  ctx.restore();
}

export function updateTurrets(timestamp: number) {
  gameState.turrets.forEach((turret) => {
    const timeSinceLastShot = timestamp - turret.firingPattern.lastFired;
    const shotInterval = 1000 / turret.firingPattern.fireRate;
    if (timeSinceLastShot >= shotInterval) {
      const newBullets = fireBullets(
        turret.x,
        turret.y,
        turret.firingPattern.bulletCount,
        turret.firingPattern.initialAngle,
        turret.firingPattern.speed,
        gameState.player.color
      );
      gameState.turretBullets.push(...newBullets);
      turret.firingPattern.lastFired = timestamp;
    }
  });
}

export function checkTurretBulletCollisions() {
  for (let i = gameState.enemies.length - 1; i >= 0; i--) {
    const enemy = gameState.enemies[i];
    for (let j = gameState.turretBullets.length - 1; j >= 0; j--) {
      const bullet = gameState.turretBullets[j];
      const dx = bullet.x - enemy.x;
      const dy = bullet.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const combinedRadius = bullet.radius + enemy.radius;

      if (distance < combinedRadius) {
        gameEvents.emit("enemyHit", i, j);
      }
    }
  }
}
