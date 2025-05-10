import "./style.css";
import { createCanvas } from "./canvas";
import { createPlayer } from "./player";
import { createControlPanel } from "./controlPanel";
import { startGameLoop } from "./gameLoop";
import { obstacles } from "./assets/obstacles";

function initApp() {
  const app = document.getElementById("app")!;
  const playButton = document.getElementById("playBtn")!;

  playButton.addEventListener("click", () => {
    playButton.remove();
    app.className = "";

    const canvas = createCanvas(app);
    const ctx = canvas.getContext("2d")!;
    const { player, camera } = createPlayer(canvas);
    const controlPanel = createControlPanel(app, player);

    startGameLoop(ctx, player, camera, controlPanel.keys, obstacles);
  });
}

initApp();
