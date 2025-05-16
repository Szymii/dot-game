import { drawObstacles } from "./obstacles";

import { drawMap, drawGameEndScreen } from "./map";
import { updateBullets, drawBullets } from "./bullets";
import { drawPowerUps, checkPowerUpCollisions } from "./powerups";
import {
  drawPlayer,
  updatePlayer,
  firePlayerBullets,
  checkBulletCollisionsWithPlayer,
  drawHealthBar,
} from "./player";
import { clearCanvas } from "./canvas";
import { gameState } from "./state/gameState";
import {
  checkBulletCollisionsWithEnemies,
  drawEnemies,
  updateEnemies,
} from "./enemy";
import { drawCountdown, initWaveManager } from "./waveManager";
import { gameEvents } from "./events/EventEmitter";

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

  initWaveManager(ctx);

  function gameLoop(timestamp: number = 0) {
    if (gameState.gameOver) {
      drawGameEndScreen(ctx, gameState.camera, gameState.gameOver);
      onGameOver();
      return;
    }

    const bulletCollisionGameOver = checkBulletCollisionsWithPlayer(
      gameState.player,
      gameState.enemyBullets
    );

    if (bulletCollisionGameOver) {
      gameState.gameOver = true;
    }

    const { playerNextX, playerNextY } = updatePlayer(
      gameState.player,
      gameState.camera,
      gameState.keys,
      gameState.obstacles,
      ctx.canvas
    );

    firePlayerBullets(gameState.player, timestamp, gameState.playerBullets);

    const enemyCollisionGameOver = updateEnemies(
      gameState.enemies,
      gameState.player,
      playerNextX,
      playerNextY,
      gameState.obstacles,
      ctx.canvas,
      gameState.enemyBullets,
      timestamp
    );

    if (enemyCollisionGameOver) {
      gameState.gameOver = true;
    }

    checkBulletCollisionsWithEnemies(
      gameState.enemies,
      gameState.playerBullets,
      gameState.powerUps,
      timestamp
    );

    if (
      gameState.enemies.length === 0 &&
      !gameState.gameOver &&
      !gameState.waveEnding
    ) {
      gameEvents.emit("waveCleared", timestamp);
    }

    clearCanvas(ctx);

    drawPlayer(ctx, gameState.player, gameState.camera);
    drawBullets(
      ctx,
      gameState.playerBullets,
      gameState.camera.x,
      gameState.camera.y
    );
    drawHealthBar(ctx, gameState.player);

    drawEnemies(ctx, gameState.enemies, gameState.camera.x, gameState.camera.y);
    drawBullets(
      ctx,
      gameState.enemyBullets,
      gameState.camera.x,
      gameState.camera.y
    );

    drawPowerUps(
      ctx,
      gameState.powerUps,
      gameState.camera.x,
      gameState.camera.y
    );
    checkPowerUpCollisions(gameState.player, gameState.powerUps);

    drawObstacles(
      ctx,
      gameState.obstacles,
      gameState.camera.x,
      gameState.camera.y
    );
    drawMap(ctx, gameState.camera.x, gameState.camera.y, gameState.wave);

    drawCountdown(ctx, timestamp);

    updateBullets(gameState.enemyBullets, ctx.canvas, gameState.obstacles);
    updateBullets(gameState.playerBullets, ctx.canvas, gameState.obstacles);

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
