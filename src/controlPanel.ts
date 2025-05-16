import type { Player } from "./types/Player";

export function createControlPanel(app: HTMLElement, player: Player) {
  const controlPanel = document.createElement("div");
  controlPanel.id = "control-panel";
  controlPanel.className =
    "absolute bottom-8 left-8 bg-gray-800 text-white p-4 rounded opacity-50";
  controlPanel.innerHTML = `
    <p>Use W, A, S, D keys to move your avatar</p>
    <p id="position-info">Position: x: ${Math.round(player.x)}, y: ${Math.round(
    player.y
  )}</p>
    <div class="key-grid grid grid-cols-3 gap-2 text-center">
      <div></div>
      <div id="key-w" class="bg-gray-700 rounded p-2">W</div>
      <div></div>
      <div id="key-a" class="bg-gray-700 rounded p-2">A</div>
      <div id="key-s" class="bg-gray-700 rounded p-2">S</div>
      <div id="key-d" class="bg-gray-700 rounded p-2">D</div>
    </div>
  `;

  if (import.meta.env.MODE === "development") app.appendChild(controlPanel);

  // Movement state
  const keys: { [key: string]: boolean } = {
    w: false,
    a: false,
    s: false,
    d: false,
  };

  // Key event listeners
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) {
      keys[key] = true;
      updateKeyStyle(key, true);
    }
  });

  document.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) {
      keys[key] = false;
      updateKeyStyle(key, false);
    }
  });

  // Update key style
  function updateKeyStyle(key: string, isPressed: boolean) {
    const keyElement = document.getElementById(`key-${key}`)!;
    keyElement.classList.toggle("bg-blue-500", isPressed);
    keyElement.classList.toggle("bg-gray-700", !isPressed);
  }

  return { controlPanel, keys };
}
