export function computeLampGridPositions(
  roomX: number,
  roomZ: number,
  padX: number,
  padZ: number,
  spacingX: number,
  spacingZ: number,
  y = 9.9,
): [number, number, number][] {
  const innerX = Math.max(1, roomX - 2 * padX);
  const innerZ = Math.max(1, roomZ - 2 * padZ);

  const cols = Math.max(1, Math.floor(innerX / spacingX));
  const rows = Math.max(1, Math.floor(innerZ / spacingZ));

  const stepX = innerX / cols;
  const stepZ = innerZ / rows;

  const positions: [number, number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = -roomX / 2 + padX + stepX * (c + 0.5);
      const z = -roomZ / 2 + padZ + stepZ * (r + 0.5);
      positions.push([x, y, z]);
    }
  }
  return positions;
}
