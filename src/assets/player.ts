import type { Camera } from "../types/Camera";
import type { Player } from "../types/Player";

export function createPlayer(): {
  player: Player;
  camera: Camera;
} {
  const player: Player = {
    x: 600,
    y: 600,
    radius: 20,
    speed: 5,
    color: "red",
    firingPattern: {
      bulletCount: 4,
      initialAngle: 0,
      fireRate: 1,
      lastFired: 0,
      speed: 7,
    },
  };

  const camera = {
    x: player.x - window.innerWidth / 2,
    y: player.y - window.innerHeight / 2,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  return { player, camera };
}
