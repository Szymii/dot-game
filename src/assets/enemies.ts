import type { Enemy } from "../types/Enemy";

// Function to generate a random color
function getRandomColor(): string {
  const colors = ["yellow", "blue", "pink", "green", "orange", "purple"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Function to generate a single enemy with random stats
function generateEnemy(canvasWidth: number, canvasHeight: number): Enemy {
  // Random position within canvas bounds
  const x = Math.random() * (canvasWidth - 60) + 30; // Avoid spawning too close to edges
  const y = Math.random() * (canvasHeight - 60) + 30;

  // Random velocity direction and speed
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 3 + 2; // Speed between 2 and 5
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  // Random HP between 2 and 5
  const hp = Math.floor(Math.random() * 4) + 2;

  // Random firing pattern
  const bulletCount = Math.floor(Math.random() * 8) + 1;
  const initialAngle = Math.random() * 360; // 0 to 360 degrees
  const fireRate = Math.random() * 3 + 0.5;
  const bulletSpeed = Math.random() * 3 + 3; // Bullet speed between 3 and 6

  return {
    x,
    y,
    radius: 15,
    vx,
    vy,
    speed,
    color: getRandomColor(),
    firingPattern: {
      bulletCount,
      initialAngle,
      fireRate,
      lastFired: 0,
      speed: bulletSpeed,
    },
    hp,
  };
}

// Function to generate a specified number of enemies
export function generateEnemies(
  count: number,
  canvasWidth: number,
  canvasHeight: number
): Enemy[] {
  const enemies: Enemy[] = [];
  for (let i = 0; i < count; i++) {
    enemies.push(generateEnemy(canvasWidth, canvasHeight));
  }
  return enemies;
}
