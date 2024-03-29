import { interpolateHcl } from 'd3-interpolate';

export function generateHclGradientColors(
  color1: string,
  color2: string,
  steps: number,
): string[] {
  if (steps < 3) {
    console.error('Nothing to interpolate. stepsNumber should be >=3');
    return [color1, color2];
  }
  const stepSize = 1.0 / (steps - 1);
  const colors: string[] = [];
  for (let i = 0; i <= steps - 1; i++) {
    const colorInterpolator = interpolateHcl(color1.toString(), color2.toString());
    colors.push(colorInterpolator(i * stepSize));
  }
  return colors;
}
