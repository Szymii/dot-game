export function getRandomColor(): string {
  const colors = [
    "#c084fc",
    "#f472b6",
    "#f87171",
    "#22d3ee",
    "#60a5fa",
    "#2dd4bf",
    "#4ade80",
    "#fb923c",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
