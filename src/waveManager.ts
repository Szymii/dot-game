import { generateEnemies } from "./enemy/generateEnemies";
import { gameEvents } from "./events/EventEmitter";
import { gameState } from "./state/gameState";

const WAVE_DELAY = 10_000;

export function drawCountdown(
  ctx: CanvasRenderingContext2D,
  timestamp: number
) {
  const app = document.getElementById("app")!;
  if (gameState.waveEnding === null) return;

  const timeLeft = WAVE_DELAY - (timestamp - gameState.waveEnding);
  if (timeLeft <= 0) return;

  ctx.save();

  ctx.font = "bold 30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(
    `Next wave in: ${Math.ceil(timeLeft / 1000)}s`,
    app.offsetWidth / 2,
    200
  );
  ctx.restore();
}

export function initWaveManager(ctx: CanvasRenderingContext2D) {
  gameState.enemies = generateEnemies(
    gameState.wave,
    ctx.canvas.width,
    ctx.canvas.height,
    gameState.player,
    gameState.obstacles
  );

  gameEvents.on("waveCleared", (timestamp: number) => {
    if (gameState.waveEnding === null) {
      gameState.waveEnding = timestamp;
    }
  });

  gameEvents.on("update", (timestamp: number) => {
    if (gameState.waveEnding === null) return;

    const timeLeft = WAVE_DELAY - (timestamp - gameState.waveEnding);
    if (timeLeft <= 0) {
      gameState.wave++;
      gameState.powerUps = [];
      gameState.enemies = generateEnemies(
        gameState.wave + 1,
        ctx.canvas.width,
        ctx.canvas.height,
        gameState.player,
        gameState.obstacles
      );
      gameState.waveEnding = null;
      gameEvents.emit("waveStarted", gameState.wave);
    }
  });
}
