import { gameEvents } from "../events/EventEmitter";
import type { PowerUp, PowerUpType } from "../powerups/PowerUp";
import { gameState } from "../state/gameState";
import type { Enemy } from "./Enemy";

export function killEnemy(enemy: Enemy, timestamp: number) {
  const powerUpTypes: PowerUpType[] = [
    "extraBullet",
    "fasterFireRate",
    "fasterBullets",
    "heal",
  ];
  const randomType =
    powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
  const powerUp: PowerUp = {
    x: enemy.x,
    y: enemy.y,
    width: 24,
    height: 24,
    type: randomType,
    spawnTime: timestamp,
  };
  gameState.powerUps.push(powerUp);

  const index = gameState.enemies.indexOf(enemy);
  if (index !== -1) {
    gameState.enemies.splice(index, 1);
  }
}

export function initEnemyManager() {
  gameEvents.on("enemyHit", (enemyIndex: number, bulletIndex: number) => {
    if (
      enemyIndex >= 0 &&
      enemyIndex < gameState.enemies.length &&
      bulletIndex >= 0 &&
      bulletIndex < gameState.playerBullets.length
    ) {
      const enemy = gameState.enemies[enemyIndex];
      enemy.hp -= 1;
      gameState.playerBullets.splice(bulletIndex, 1);
      if (enemy.hp <= 0) {
        gameEvents.emit("enemyKilled", enemy, Date.now());
      }
    }
  });

  gameEvents.on("enemyKilled", (enemy: Enemy, timestamp: number) => {
    killEnemy(enemy, timestamp);
  });
}
