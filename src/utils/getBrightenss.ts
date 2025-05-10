export function getBrightness(color: string): number {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return 0;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return 0.299 * r + 0.587 * g + 0.114 * b; // Luma formula
}
