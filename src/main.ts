import "./style.css";
import { createCanvas } from "./canvas";
import { createControlPanel } from "./controlPanel";
import { startGameLoop } from "./gameLoop";
import { preloadIcons } from "./utils/preloadAssets";
import { createPlayer } from "./state/player";
import { obstacles } from "./state/obstacles";
import { gameState, resetGameState } from "./state/gameState";

function resetGame() {
  resetGameState();
  window.location.reload();
}

function initApp() {
  const app = document.getElementById("app")!;
  const playButton = document.getElementById("playBtn")!;
  const restartButton = document.getElementById("restartBtn")!;

  function onGameOver() {
    restartButton.style.display = "block";
    restartButton.style.position = "absolute";
    restartButton.style.top = "50%";
    restartButton.style.left = "50%";
    restartButton.style.transform = "translateX(-50%)";
  }

  playButton.addEventListener("click", async () => {
    playButton.remove();

    await preloadIcons();

    const canvas = createCanvas(app);
    const ctx = canvas.getContext("2d")!;

    const { player, camera } = createPlayer(app);
    gameState.player = player;
    gameState.camera = camera;
    gameState.obstacles = obstacles;

    const controlPanel = createControlPanel(app, player);
    gameState.keys = controlPanel.keys;

    const stopGame = await startGameLoop(ctx, onGameOver);

    restartButton.addEventListener("click", resetGame);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (stopGame) {
          stopGame();
          onGameOver();
        }
      }
    });
  });
}

initApp();
