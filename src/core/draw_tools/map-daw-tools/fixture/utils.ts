export function addLayers<T>(
  style = { layers: [], version: 0 } as { layers: unknown[]; version: number },
  layers = [] as unknown[],
): T {
  style.layers = [...style.layers, ...layers];
  return style as unknown as T;
}

export const dropUndefined = <T>(arr) =>
  arr.filter((l): l is T => l !== undefined);
