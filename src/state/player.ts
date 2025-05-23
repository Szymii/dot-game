import type { Camera } from "../player/Camera";
import type { Player } from "../player/Player";
import { GLOBALS } from "../state/GLOBALS";

export function createPlayer(app: HTMLElement): {
  player: Player;
  camera: Camera;
} {
  const player: Player = {
    x: GLOBALS.canvasW / 2,
    y: GLOBALS.canvasH / 2,
    radius: 20,
    speed: 4,
    color: "#f3e8ff",
    firingPattern: {
      bulletCount: 4,
      initialAngle: 0,
      fireRate: 1,
      lastFired: 0,
      speed: 8,
    },
    hp: 10,
    maxHp: 10,
  };

  const camera = {
    x: player.x - app.offsetWidth / 2,
    y: player.y - app.offsetHeight / 2,
    width: app.offsetWidth,
    height: app.offsetHeight,
  };

  return { player, camera };
}
