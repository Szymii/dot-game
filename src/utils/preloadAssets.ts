type Icon = Record<keyof typeof icons, HTMLImageElement>;
const icons = {
  extraBullet: "/dot-game/extraBullet.svg",
  fasterFireRate: "/dot-game/fasterFireRate.svg",
  fasterBullets: "/dot-game/fasterBullets.svg",
  ship: "/dot-game/ship.svg",
  fastTurret: "/dot-game/fastTurret.svg",
  fastBulletTurret: "/dot-game/fastBulletTurret.svg",
  multiBulletTurret: "/dot-game/multiBulletTurret.svg",
} as const;

export const loadedIcons: Icon = {} as Icon;

export async function preloadIcons(): Promise<void> {
  const loadPromises = Object.entries(icons).map(([type, src]) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedIcons[type as keyof Icon] = img;
        resolve();
      };
      img.onerror = () => {
        console.error(`Failed to load icon: ${src}`);
        reject();
      };
    });
  });

  await Promise.all(loadPromises);
  console.log("All icons loaded successfully");
}
