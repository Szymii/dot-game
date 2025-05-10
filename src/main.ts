import "./style.css";
import { createCanvas } from "./canvas";
import { createControlPanel } from "./controlPanel";
import { startGameLoop } from "./gameLoop";
import { obstacles } from "./assets/obstacles";
import { enemies } from "./assets/enemies";
import { createPlayer } from "./assets/player";

function initApp() {
  const app = document.getElementById("app")!;
  const playButton = document.getElementById("playBtn")!;
  const restartButton = document.getElementById("restartBtn")!;

  playButton.addEventListener("click", async () => {
    playButton.remove();
    app.className = "";

    const canvas = createCanvas(app);
    const ctx = canvas.getContext("2d")!;
    const { player, camera } = createPlayer();
    const controlPanel = createControlPanel(app, player);

    function resetGame() {
      window.location.reload();
    }

    function onGameOver() {
      restartButton.style.display = "block";
      restartButton.style.position = "absolute";
      restartButton.style.top = "50%";
      restartButton.style.left = "50%";
      restartButton.style.transform = "translateX(-50%)";
    }

    // Start the game loop
    const stopGame = await startGameLoop(
      ctx,
      player,
      camera,
      controlPanel.keys,
      obstacles,
      enemies,
      onGameOver
    );

    // Add event listener for the reset button
    restartButton.addEventListener("click", resetGame);

    // Optional: Stop the game on Escape (for debugging)
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
