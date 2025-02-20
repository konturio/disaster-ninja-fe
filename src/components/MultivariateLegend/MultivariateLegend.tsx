import { Legend as BiLegend, MCDALegend } from '@konturio/ui-kit';
import { generateMCDALegendColors } from '~utils/mcda/mcdaLegendsUtils';
import { BIVARIATE_LEGEND_SIZE } from '~components/BivariateLegend/const';
import { DEFAULT_MULTIBIVARIATE_STEPS } from '~utils/multivariate/constants';
import { invertClusters, type Step } from '~utils/bivariate';
import { CornerTooltipWrapper } from '~components/BivariateLegend/CornerTooltipWrapper';
import { DEFAULT_BASE_DIRECTION, DEFAULT_SCORE_DIRECTION } from './constants';
import type { Direction } from '~utils/bivariate';
import type { LayerMeta } from '~core/logical_layers/types/meta';
import type { ColorTheme } from '~core/types';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { Cell } from '@konturio/ui-kit/tslib/Legend/types';

export type MultivariateLegendProps = {
  config: MultivariateLayerConfig;
};

type MultiBivariateLegendAxisProp = {
  label: string;
  steps: {
    label?: string;
    value: number;
  }[];
  quality?: number;
  quotient: [string, string];
};

function createMCDALegend(mcdaConfig: MCDAConfig): JSX.Element {
  let legendColors: string[] | undefined;
  if (mcdaConfig.colors.type === 'sentiments') {
    legendColors = generateMCDALegendColors(mcdaConfig.colors);
  }
  return <MCDALegend title={mcdaConfig.name} steps={5} colors={legendColors} />;
}

function getCornerHintsForDimension(
  dimension: MCDAConfig,
  defaultDirection: Direction,
): {
  label: string;
  direction: Direction;
} {
  const label = dimension.name;
  let direction = defaultDirection;
  const mcdaAxes = dimension.layers;
  if (mcdaAxes.length === 1 && mcdaAxes[0].indicators.length > 0) {
    direction = mcdaAxes[0].indicators[0].direction;
  }
  return { label, direction };
}

function createBivariateLegend(
  score: MCDAConfig,
  base: MCDAConfig,
  scoreSteps: Step[],
  baseSteps: Step[],
  colors: ColorTheme,
) {
  const xAxis: MultiBivariateLegendAxisProp = {
    label: base.name,
    steps: baseSteps,
    quotient: ['', ''],
  };
  const yAxis: MultiBivariateLegendAxisProp = {
    label: score.name,
    steps: scoreSteps,
    quotient: ['', ''],
  };
  const cells = invertClusters(
    colors.map(({ id, color, isFallbackColor }) => ({
      label: id,
      color,
      isFallbackColor,
    })),
    'label',
  ) as Cell[];

  const hints: LayerMeta['hints'] = {
    x: getCornerHintsForDimension(score, DEFAULT_SCORE_DIRECTION),
    y: getCornerHintsForDimension(base, DEFAULT_BASE_DIRECTION),
  };
  return (
    <CornerTooltipWrapper hints={hints}>
      <BiLegend
        cells={cells}
        size={BIVARIATE_LEGEND_SIZE}
        axis={{ x: xAxis, y: yAxis }}
        showAxisLabels
      />
    </CornerTooltipWrapper>
  );
}

export function MultivariateLegend({ config }: MultivariateLegendProps) {
  if (config.base && config.colors?.type === 'bivariate') {
    return createBivariateLegend(
      config.score.config,
      config.base.config,
      config.stepOverrides?.scoreSteps ?? DEFAULT_MULTIBIVARIATE_STEPS,
      config.stepOverrides?.baseSteps ?? DEFAULT_MULTIBIVARIATE_STEPS,
      config.colors.colors,
    );
  } else {
    return createMCDALegend(config.score.config);
  }
}
