import {
  drawPlayer,
  updatePlayer,
  firePlayerBullets,
  checkBulletCollisionsWithPlayer,
  drawHealthBar,
} from "./player";
import { gameState } from "./state/gameState";
import {
  checkBulletCollisionsWithEnemies,
  drawEnemies,
  updateEnemies,
} from "./enemy";
import { gameEvents } from "./events/EventEmitter";
import { drawCountdown, initWaveManager } from "./waves/waveManager";
import { initEnemyManager } from "./enemy/enemyManager";
import { drawGameEndScreen, drawMap } from "./canvas/map";
import { clearCanvas } from "./canvas";
import { initPlayerManager } from "./player/playerManager";
import { drawBullets, updateBullets } from "./bullets";
import { checkPowerUpCollisions, drawPowerUps } from "./powerups";
import { drawObstacles } from "./obstacles";
import { initTurretManager } from "./turret/turretManager";
import {
  checkTurretBulletCollisions,
  drawTurrets,
  updateTurrets,
} from "./turret";

function updatePositionInfo() {
  const positionInfo = document.getElementById("position-info")!;
  if (!positionInfo) return;

  positionInfo.textContent = `Position: x: ${Math.round(
    gameState.player.x
  )}, y: ${Math.round(gameState.player.y)} | HP: ${gameState.player.hp}`;
}

export async function startGameLoop(
  ctx: CanvasRenderingContext2D,
  onGameOver: () => void
) {
  let animationFrameId: number | null = null;

  initPlayerManager();
  initEnemyManager();
  initWaveManager(ctx);
  const previewTurret = initTurretManager(ctx.canvas);

  function gameLoop(timestamp: number = 0) {
    if (gameState.gameOver) {
      drawGameEndScreen(ctx);
      onGameOver();
      return;
    }

    const { playerNextX, playerNextY } = updatePlayer(ctx.canvas);
    checkBulletCollisionsWithPlayer();
    firePlayerBullets(timestamp);

    updateTurrets(timestamp);
    checkTurretBulletCollisions();

    updateEnemies(ctx.canvas, playerNextX, playerNextY, timestamp);
    checkBulletCollisionsWithEnemies();

    if (
      gameState.enemies.length === 0 &&
      !gameState.gameOver &&
      !gameState.waveEnding
    ) {
      gameEvents.emit("waveCleared", timestamp);
    }

    clearCanvas(ctx);

    drawPlayer(ctx);
    drawBullets(ctx, gameState.playerBullets);
    drawHealthBar(ctx);

    drawEnemies(ctx);
    drawBullets(ctx, gameState.enemyBullets);

    drawPowerUps(ctx);
    checkPowerUpCollisions();

    drawObstacles(ctx);
    drawMap(ctx);

    drawTurrets(ctx, previewTurret.getPreviewTurret());

    drawCountdown(ctx, timestamp);

    updateBullets(gameState.enemyBullets, ctx.canvas);
    updateBullets(gameState.playerBullets, ctx.canvas);
    updateBullets(gameState.turretBullets, ctx.canvas);

    updatePositionInfo();

    gameEvents.emit("update", timestamp);

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  gameLoop();

  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}
