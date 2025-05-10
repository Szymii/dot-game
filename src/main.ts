import "./style.css";
import { createCanvas } from "./canvas";
import { createPlayer } from "./player";
import { createControlPanel } from "./controlPanel";
import { startGameLoop } from "./gameLoop";

function initApp() {
  const app = document.getElementById("app")!;
  const playButton = document.getElementById("playBtn")!;

  playButton.addEventListener("click", () => {
    playButton.remove();
    app.className = ""; // Remove centering classes

    const canvas = createCanvas(app);
    const ctx = canvas.getContext("2d")!;
    const player = createPlayer(canvas);
    const controlPanel = createControlPanel(app, player);

    startGameLoop(ctx, player, controlPanel.keys);
  });
}

initApp();
