import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { ColorTheme } from '~core/types';
import type { Stat } from '~utils/bivariate';
import type { LayerMeta } from '~core/logical_layers/types/meta';
import type { Axis } from '~utils/bivariate';

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
  if (xAxis && !xAxis.label) {
    const xAxisNominatorIndicator = stats.indicators.find(
      (ind) => ind.name === xNumerator,
    );
    const xAxisDenominatorIndicator = stats.indicators.find(
      (ind) => ind.name === xDenominator,
    );

    xAxis.label = `${xAxisNominatorIndicator?.label || xNumerator} to ${
      xAxisDenominatorIndicator?.label || xDenominator
    }`;
  }

  const yAxis = stats.axis.find(
    (ax) => ax.quotient[0] === yNumerator && ax.quotient[1] === yDenominator,
  );

  if (yAxis && !yAxis.label) {
    const yAxisNominatorIndicator = stats.indicators.find(
      (ind) => ind.name === yNumerator,
    );
    const yAxisDenominatorIndicator = stats.indicators.find(
      (ind) => ind.name === yDenominator,
    );

    yAxis.label = `${yAxisNominatorIndicator?.label || yNumerator} to ${
      yAxisDenominatorIndicator?.label || yDenominator
    }`;
  }

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
  const xAxisNominatorIndicator = stats.indicators.find(
    (ind) => ind.name === xNumerator,
  );

  const yAxisNominatorIndicator = stats.indicators.find(
    (ind) => ind.name === yNumerator,
  );

  const xNominatorLabel = xAxisNominatorIndicator?.label;
  const yNominatorLabel = yAxisNominatorIndicator?.label;
  const xDenominatorLabel = stats.indicators.find(
    (ind) => ind.name === xDenominator,
  )?.label;
  const yDenominatorLabel = stats.indicators.find(
    (ind) => ind.name === yDenominator,
  )?.label;

  let copyrights: string[] = [];
  if (xAxisNominatorIndicator?.copyrights?.length) {
    copyrights = copyrights.concat(xAxisNominatorIndicator.copyrights);
  }
  if (yAxisNominatorIndicator?.copyrights?.length) {
    copyrights = copyrights.concat(yAxisNominatorIndicator.copyrights);
  }

  const description = `This map shows relation of ${xNominatorLabel} (normalized by ${xDenominatorLabel}) to the base of ${yNominatorLabel} (normalized by ${yDenominatorLabel}).`;

  return {
    description,
    copyrights,
    hints: {
      x: {
        label: xNominatorLabel,
        direction: xAxisNominatorIndicator?.direction,
      },
      y: {
        label: yNominatorLabel,
        direction: yAxisNominatorIndicator?.direction,
      },
    },
  };
}
