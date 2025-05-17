// turretManager.ts
import { gameEvents } from "../events/EventEmitter";
import { gameState } from "../state/gameState";
import { predefinedTurrets } from "../state/predefinedTurrets";
import type { Turret, TurretType } from "./Turret";

export function initTurretManager(canvas: HTMLCanvasElement) {
  let selectedTurretType: TurretType | null = null;
  let canPlaceTurret = false;

  // Interfejs HTML z Tailwindem
  const turretUI = document.createElement("div");
  turretUI.id = "turret-ui";
  turretUI.className =
    "fixed right-4 top-1/4 bg-gray-800 p-4 rounded-lg shadow-lg text-white w-64 hidden";
  turretUI.innerHTML = `
    <h2 class="text-lg font-bold mb-2">Wybierz wieżyczkę</h2>
    <button id="fast-turret" class="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 mb-2 rounded">
      Szybka (4 pociski, szybki strzał)
    </button>
    <button id="fast-bullets-turret" class="w-full bg-green-500 hover:bg-green-700 text-white py-2 mb-2 rounded">
      Szybkie pociski (normalny strzał)
    </button>
    <button id="many-bullets-turret" class="w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded">
      Wiele pocisków (5 pocisków)
    </button>
  `;
  document.body.appendChild(turretUI);

  // Pokazuj interfejs w fazie budowania
  gameEvents.on("waveCleared", () => {
    canPlaceTurret = true;
    turretUI.classList.remove("hidden");
  });

  // Ukrywaj interfejs po zakończeniu przerwy
  gameEvents.on("waveStarted", () => {
    canPlaceTurret = false;
    selectedTurretType = null;
    turretUI.classList.add("hidden");
  });

  // Obsługa wyboru wieżyczki
  const fastTurretBtn = document.getElementById("fast-turret");
  const fastBulletsTurretBtn = document.getElementById("fast-bullets-turret");
  const manyBulletsTurretBtn = document.getElementById("many-bullets-turret");

  fastTurretBtn?.addEventListener("click", () => {
    selectedTurretType = "fast";
  });
  fastBulletsTurretBtn?.addEventListener("click", () => {
    selectedTurretType = "fastBullets";
  });
  manyBulletsTurretBtn?.addEventListener("click", () => {
    selectedTurretType = "manyBullets";
  });

  // Obsługa kliknięcia na canvasie do umieszczania wieżyczki
  canvas.addEventListener("click", (event) => {
    if (gameState.waveEnding && canPlaceTurret && selectedTurretType) {
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
    }
  });
}
