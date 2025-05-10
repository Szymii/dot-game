export function drawMapBounds(
  ctx: CanvasRenderingContext2D,
  mapWidth: number,
  mapHeight: number,
  cameraX: number,
  cameraY: number
) {
  ctx.save();
  ctx.translate(-cameraX, -cameraY); // Apply camera offset

  ctx.strokeStyle = "white";
  ctx.lineWidth = 4; // Thickness of the border
  ctx.strokeRect(0, 0, mapWidth, mapHeight);

  ctx.restore();
}
