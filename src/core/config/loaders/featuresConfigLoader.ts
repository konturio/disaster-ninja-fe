export function getFeaturesFromStageConfig<T extends Array<string>>(features: T) {
  return Object.fromEntries((features ?? []).map((f) => [f, true]));
}

export function getFeaturesFromAppConfig<
  T extends Array<{ name: string; configuration?: unknown }>,
>(features: T) {
  return Object.fromEntries(
    (features ?? []).map((f) => [f.name, f.configuration || true]),
  );
}
