const icons: Record<string, string> = {
  extraBullet: "/dot-game/extraBullet.svg",
  fasterFireRate: "/dot-game/fasterFireRate.svg",
  fasterBullets: "/dot-game/fasterBullets.svg",
};

export const loadedIcons: Record<string, HTMLImageElement> = {};

export async function preloadIcons(): Promise<void> {
  const loadPromises = Object.entries(icons).map(([type, src]) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedIcons[type] = img;
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
