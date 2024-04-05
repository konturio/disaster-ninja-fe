import { interpolateHcl } from 'd3-interpolate';

export function generateHclGradientColors(
  colorStart: string,
  colorEnd: string,
  steps: number,
): string[] {
  if (steps < 3) {
    console.error('Nothing to interpolate. stepsNumber should be >=3');
    return [colorStart, colorEnd];
  }
  const stepSize = 1.0 / (steps - 1);
  const colors: string[] = [];
  for (let i = 0; i <= steps - 1; i++) {
    const colorInterpolator = interpolateHcl(colorStart.toString(), colorEnd.toString());
    colors.push(colorInterpolator(i * stepSize));
  }
  return colors;
}
