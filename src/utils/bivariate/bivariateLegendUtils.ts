import type { BivariateLegend } from '~core/logical_layers/types/legends';
import { ColorTheme } from '~core/types';
import { Stat } from '@k2-packages/bivariate-tools';
import { LayerMeta } from '~core/logical_layers/types/meta';

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

  return {
    name,
    axis: { x: xAxis, y: yAxis },
    type: 'bivariate',
    steps: colorTheme.map(({ id, color }) => ({
      label: id,
      color,
    })),
  };
}

export function createBivariateMeta(
  xNumerator: string,
  xDenominator: string,
  yNumerator: string,
  yDenominator: string,
  stats: Stat,
): LayerMeta {
  const xAxisIndicator = stats.indicators.find(
    (ind) => ind.name === xNumerator,
  );

  const yAxisIndicator = stats.indicators.find(
    (ind) => ind.name === yNumerator,
  );

  const xAxisLabel = xAxisIndicator?.label;
  const yAxisLabel = yAxisIndicator?.label;
  const xDenominatorLabel = stats.indicators.find(
    (ind) => ind.name === xDenominator,
  )?.label;
  const yDenominatorLabel = stats.indicators.find(
    (ind) => ind.name === yDenominator,
  )?.label;

  let copyrights: string[] = [];
  if (
    xAxisIndicator &&
    xAxisIndicator.copyrights &&
    xAxisIndicator.copyrights.length
  ) {
    copyrights = copyrights.concat(xAxisIndicator.copyrights);
  }
  if (
    yAxisIndicator &&
    yAxisIndicator.copyrights &&
    yAxisIndicator.copyrights.length
  ) {
    copyrights = copyrights.concat(yAxisIndicator.copyrights);
  }

  const description = `This map shows relation of ${xAxisLabel} (normalized by ${xDenominatorLabel}) to the base of ${yAxisLabel} (normalized by ${yDenominatorLabel}).`;

  return {
    description,
    copyrights,
  };
}
