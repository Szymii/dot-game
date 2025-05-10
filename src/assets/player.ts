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
    speed: 4,
    color: "red",
    firingPattern: {
      bulletCount: 60,
      initialAngle: 0,
      fireRate: 1,
      lastFired: 0,
      speed: 8,
    },
    hp: 10,
  };

  const camera = {
    x: player.x - window.innerWidth / 2,
    y: player.y - window.innerHeight / 2,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  return { player, camera };
}
