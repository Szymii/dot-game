import { turretIconMap } from ".";
import { gameEvents } from "../events/EventEmitter";
import { gameState } from "../state/gameState";
import { predefinedTurrets } from "../state/predefinedTurrets";
import { loadedIcons } from "../utils/preloadAssets";
import type { Turret, TurretType } from "./Turret";

const turretDescriptions: Record<
  TurretType,
  { title: string; description: string }
> = {
  fast: {
    title: "Rapid Fire",
    description: "Fires 4 bullets with high fire rate",
  },
  fastBullets: {
    title: "Fast Bullets",
    description: "Fires 4 bullets with normal fire rate",
  },
  manyBullets: {
    title: "Multi-Shot",
    description: "Fires 5 bullets with normal fire rate",
  },
};

export function initTurretManager(canvas: HTMLCanvasElement) {
  let selectedTurretType: TurretType | null = null;
  let canPlaceTurret = false;
  let previewTurret: Turret | null = null;

  const turretUI = document.createElement("div");
  turretUI.id = "turret-ui";
  turretUI.className =
    "fixed right-4 top-1/4 bg-black/80 bg-opacity-80 p-4 rounded-lg shadow-lg text-white w-64 hidden";
  turretUI.innerHTML = `
    <h2 class="text-lg font-bold mb-4">Choose a Turret</h2>
    <button id="fast-turret" class="w-full border-2 border-transparent hover:border-white text-white py-2 px-4 mb-2 gap-2 rounded flex items-center cursor-pointer transition-all">
      <img src="${
        loadedIcons[turretIconMap.fast].src
      }" class="w-6 h-6" alt="Fast Turret" />
      <div class="text-left">
        <span class="font-bold">${turretDescriptions.fast.title}</span>
        <p class="text-sm">${turretDescriptions.fast.description}</p>
      </div>
    </button>
    <button id="fast-bullets-turret" class="w-full border-2 border-transparent hover:border-white text-white py-2 px-4 mb-2 gap-2 rounded flex items-center cursor-pointer transition-all">
      <img src="${
        loadedIcons[turretIconMap.fastBullets].src
      }" class="w-6 h-6" alt="Fast Bullets Turret" />
      <div class="text-left">
        <span class="font-bold">${turretDescriptions.fastBullets.title}</span>
        <p class="text-sm">${turretDescriptions.fastBullets.description}</p>
      </div>
    </button>
    <button id="many-bullets-turret" class="w-full border-2 border-transparent hover:border-white text-white py-2 px-4 gap-2 rounded flex items-center cursor-pointer transition-all">
      <img src="${
        loadedIcons[turretIconMap.manyBullets].src
      }" class="w-6 h-6" alt="Multi-Shot Turret" />
      <div class="text-left">
        <span class="font-bold">${turretDescriptions.manyBullets.title}</span>
        <p class="text-sm">${turretDescriptions.manyBullets.description}</p>
      </div>
    </button>
  `;
  document.body.appendChild(turretUI);

  gameEvents.on("waveCleared", () => {
    canPlaceTurret = true;
    turretUI.classList.remove("hidden");
  });

  gameEvents.on("waveStarted", () => {
    canPlaceTurret = false;
    selectedTurretType = null;
    previewTurret = null;
    turretUI.classList.add("hidden");
  });

  const fastTurretBtn = document.getElementById("fast-turret");
  const fastBulletsTurretBtn = document.getElementById("fast-bullets-turret");
  const manyBulletsTurretBtn = document.getElementById("many-bullets-turret");

  fastTurretBtn?.addEventListener("click", () => {
    selectedTurretType = "fast";
    previewTurret = { ...predefinedTurrets.fast, x: 0, y: 0 };
  });
  fastBulletsTurretBtn?.addEventListener("click", () => {
    selectedTurretType = "fastBullets";
    previewTurret = { ...predefinedTurrets.fastBullets, x: 0, y: 0 };
  });
  manyBulletsTurretBtn?.addEventListener("click", () => {
    selectedTurretType = "manyBullets";
    previewTurret = { ...predefinedTurrets.manyBullets, x: 0, y: 0 };
  });

  canvas.addEventListener("mousemove", (event) => {
    if (gameState.waveEnding && previewTurret) {
      const rect = canvas.getBoundingClientRect();
      previewTurret.x = event.clientX - rect.left + gameState.camera.x;
      previewTurret.y = event.clientY - rect.top + gameState.camera.y;
    }
  });

  canvas.addEventListener("click", (event) => {
    if (
      gameState.waveEnding &&
      canPlaceTurret &&
      selectedTurretType &&
      previewTurret
    ) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left + gameState.camera.x;
      const y = event.clientY - rect.top + gameState.camera.y;

      const turret: Turret = {
        ...predefinedTurrets[selectedTurretType],
        x,
        y,
      };

      gameState.turrets.push(turret);
      canPlaceTurret = false;
      selectedTurretType = null;
      previewTurret = null;
    }
  });

  return { getPreviewTurret: () => previewTurret };
}
