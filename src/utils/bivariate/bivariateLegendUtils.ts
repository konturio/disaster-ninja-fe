import { BivariateLegend } from '~utils/atoms/createLogicalLayerAtom/legend';
import { ColorTheme } from '~appModule/types';
import { Stat } from '@k2-packages/bivariate-tools';

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

  const xAxisLabel = stats.indicators.find(
    (ind) => ind.name === xNumerator,
  )?.label;
  const yAxisLabel = stats.indicators.find(
    (ind) => ind.name === yNumerator,
  )?.label;
  const xDenominatorLabel = stats.indicators.find(
    (ind) => ind.name === xDenominator,
  )?.label;
  const yDenominatorLabel = stats.indicators.find(
    (ind) => ind.name === yDenominator,
  )?.label;

  const description = `This map shows relation of ${xAxisLabel} (normalized by ${xDenominatorLabel}) to the base of ${yAxisLabel} (normalized by ${yDenominatorLabel}).`;

  return {
    name,
    description,
    axis: { x: xAxis, y: yAxis },
    type: 'bivariate',
    steps: colorTheme.map(({ id, color }) => ({
      label: id,
      color,
    })),
  };
}
