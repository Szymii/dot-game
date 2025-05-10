export type FiringPattern = {
  bulletCount: number; // Number of bullets per shot
  initialAngle: number; // Initial angle in degrees
  fireRate: number; // Shots per second (e.g., 1 = once per second)
  lastFired: number; // Timestamp of last shot (in milliseconds)
};
