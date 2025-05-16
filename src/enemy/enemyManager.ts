import { gameEvents } from "../events/EventEmitter";
import { gameState } from "../state/gameState";
import type { Enemy } from "../types/Enemy";
import type { PowerUp, PowerUpType } from "../types/PowerUp";

export function killEnemy(enemy: Enemy, timestamp: number) {
  const powerUpTypes: PowerUpType[] = [
    "extraBullet",
    "fasterFireRate",
    "fasterBullets",
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
  gameEvents.on("enemyKilled", (enemy: Enemy, timestamp: number) => {
    killEnemy(enemy, timestamp);
  });
}
