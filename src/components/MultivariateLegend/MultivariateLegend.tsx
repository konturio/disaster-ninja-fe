import { Legend as BiLegend, MCDALegend } from '@konturio/ui-kit';
import { generateMCDALegendColors } from '~utils/mcda/mcdaLegendsUtils';
import { BIVARIATE_LEGEND_SIZE } from '~components/BivariateLegend/const';
import { DEFAULT_MULTIBIVARIATE_STEPS } from '~utils/multivariate/constants';
import { invertClusters } from '~utils/bivariate';
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

function createBivariateLegend(base: MCDAConfig, annex: MCDAConfig, colors: ColorTheme) {
  const xAxis: MultiBivariateLegendAxisProp = {
    label: base.name,
    steps: DEFAULT_MULTIBIVARIATE_STEPS,
    quotient: ['', ''],
  };
  const yAxis: MultiBivariateLegendAxisProp = {
    label: annex.name,
    steps: DEFAULT_MULTIBIVARIATE_STEPS,
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
  return (
    <BiLegend cells={cells} size={BIVARIATE_LEGEND_SIZE} axis={{ x: xAxis, y: yAxis }} />
  );
}

export function MultivariateLegend({ config }: MultivariateLegendProps) {
  if (config.annex && config.colors?.type === 'bivariate') {
    return createBivariateLegend(
      config.base.config,
      config.annex.config,
      config.colors.colors,
    );
  } else {
    return createMCDALegend(config.base.config);
  }
}
