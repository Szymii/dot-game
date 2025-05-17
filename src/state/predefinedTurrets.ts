import type { Turret } from "../turret/Turret";

interface Predefined {
  fast: Turret;
  fastBullets: Turret;
  manyBullets: Turret;
}

export const predefinedTurrets: Predefined = {
  fast: {
    x: 0,
    y: 0,
    radius: 15,
    type: "fast",
    firingPattern: {
      bulletCount: 4,
      initialAngle: 0,
      fireRate: 1,
      lastFired: 0,
      speed: 10,
    },
  },
  fastBullets: {
    x: 0,
    y: 0,
    radius: 15,
    type: "fastBullets",
    firingPattern: {
      bulletCount: 4,
      initialAngle: 0,
      fireRate: 2,
      lastFired: 0,
      speed: 8,
    },
  },
  manyBullets: {
    x: 0,
    y: 0,
    radius: 15,
    type: "manyBullets",
    firingPattern: {
      bulletCount: 5,
      initialAngle: 0,
      fireRate: 1,
      lastFired: 0,
      speed: 8,
    },
  },
};
