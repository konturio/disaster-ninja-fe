import { getCharByIndex } from './bivariate_style/styleGen';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { ColorTheme } from '~core/types';
import type { Stat } from '~utils/bivariate';
import type { LayerMeta } from '~core/logical_layers/types/meta';
import type { Axis, Step } from '~utils/bivariate';

export function createBivariateLegend(
  name: string,
  colorTheme: ColorTheme,
  xNumerator: string,
  xDenominator: string,
  yNumerator: string,
  yDenominator: string,
  stats: Stat,
): BivariateLegend | undefined {
  const xAxis = stats.axis.find(
    (ax) => ax.quotient[0] === xNumerator && ax.quotient[1] === xDenominator,
  );

  const yAxis = stats.axis.find(
    (ax) => ax.quotient[0] === yNumerator && ax.quotient[1] === yDenominator,
  );

  if (!xAxis || !yAxis) return;

  return fillBivariateLegend(name, xAxis, yAxis, colorTheme);
}

export const fillBivariateLegend = (
  name: string,
  xAxis: Axis,
  yAxis: Axis,
  colorTheme: ColorTheme,
): BivariateLegend => ({
  name,
  axis: { x: xAxis, y: yAxis },
  type: 'bivariate',
  steps: colorTheme.map(({ id, color, isFallbackColor }) => ({
    label: id,
    color,
    isFallbackColor,
  })),
});

export function createBivariateMeta(
  xNumerator: string,
  xDenominator: string,
  yNumerator: string,
  yDenominator: string,
  stats: Stat,
): LayerMeta {
  const xAxisNumeratorIndicator = stats.indicators.find((ind) => ind.name === xNumerator);

  const yAxisNumeratorIndicator = stats.indicators.find((ind) => ind.name === yNumerator);

  const xNumeratorLabel = xAxisNumeratorIndicator?.label;
  const yNumeratorLabel = yAxisNumeratorIndicator?.label;
  const xDenominatorLabel = stats.indicators.find(
    (ind) => ind.name === xDenominator,
  )?.label;
  const yDenominatorLabel = stats.indicators.find(
    (ind) => ind.name === yDenominator,
  )?.label;

  let copyrights: string[] = [];
  if (xAxisNumeratorIndicator?.copyrights?.length) {
    copyrights = copyrights.concat(xAxisNumeratorIndicator.copyrights);
  }
  if (yAxisNumeratorIndicator?.copyrights?.length) {
    copyrights = copyrights.concat(yAxisNumeratorIndicator.copyrights);
  }

  const description = `This map shows relation of ${xNumeratorLabel} (normalized by ${xDenominatorLabel}) to the base of ${yNumeratorLabel} (normalized by ${yDenominatorLabel}).`;

  return {
    description,
    copyrights,
    hints: {
      x: {
        label: xNumeratorLabel,
        direction: xAxisNumeratorIndicator?.direction,
      },
      y: {
        label: yNumeratorLabel,
        direction: yAxisNumeratorIndicator?.direction,
      },
    },
  };
}

// need to ignore first range to avoid getting @ and 0 chars
const fitsLegendCriteria = <T extends { value: number }>(
  step: T,
  index: number,
  totalSteps: number,
  targetValue: number,
): boolean =>
  (index !== 0 && targetValue < step.value) ||
  (index === totalSteps - 1 && targetValue <= step.value);

// same logic as in classResolver method in styleGen.ts, but here we do it manually
export function getCellLabelByValue(
  xSteps: Step[],
  ySteps: Step[],
  xValue: number,
  yValue: number,
) {
  const charIndex = xSteps.findIndex((xStep, i, arr) =>
    fitsLegendCriteria(xStep, i, arr.length, xValue),
  );
  const char = getCharByIndex(charIndex);
  const number = ySteps.findIndex((yStep, i, arr) =>
    fitsLegendCriteria(yStep, i, arr.length, yValue),
  );
  return char + number;
}
