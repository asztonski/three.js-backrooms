export function computeLampGridPositions(
  roomX: number,
  roomZ: number,
  padX: number,
  padZ: number,
  //   spacingX: number,
  //   spacingZ: number,
  y = 9.9,
): [number, number, number][] {
  const innerX = roomX - 2 * padX;
  const innerZ = roomZ - 2 * padZ;

  const LAMPS_COUNT = Math.max(1, Math.round((innerX * (innerZ + innerX * 4)) / 6500)); // rough formula be careful with higher counts
  const aspect = innerX / innerZ;
  const cols = Math.max(1, Math.round(Math.sqrt(LAMPS_COUNT * aspect)));
  const rows = Math.max(1, Math.ceil(LAMPS_COUNT / cols));

  const stepX = innerX / cols;
  const stepZ = innerZ / rows;

  const positions: [number, number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (positions.length === LAMPS_COUNT) break;
      const x = -innerX / 2 + padX + stepX * (c + 0.5);
      const z = -innerZ / 2 + padZ + stepZ * (r + 0.5);
      positions.push([x, y, z]);
    }
  }
  return positions;
}
