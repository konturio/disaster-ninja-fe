export const generateSigmaRange = (
  mean: number,
  stddev: number,
  numberOfSigmas: number,
): [number, number] => [mean - numberOfSigmas * stddev, mean + numberOfSigmas * stddev];
