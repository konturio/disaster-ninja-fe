import { MCDALegend } from '@konturio/ui-kit';
import { generateMCDALegendColors } from '~utils/mcda/mcdaLegendsUtils';
import s from './MultivariateLegend.module.css';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';

export type MultivariateLegendProps = {
  config: MultivariateLayerConfig;
};

function createMCDALegend(mcdaConfig: MCDAConfig): JSX.Element {
  let legendColors: string[] | undefined;
  if (mcdaConfig.colors.type === 'sentiments') {
    legendColors = generateMCDALegendColors(mcdaConfig.colors);
  }
  return <MCDALegend title={mcdaConfig.name} steps={5} colors={legendColors} />;
}

export function MultivariateLegend({ config }: MultivariateLegendProps) {
  if (!config?.annex) {
    return createMCDALegend(config.base.config);
  } else {
    return <div className={s.legendName}>[ MultivariateLegend ]</div>;
  }
}
