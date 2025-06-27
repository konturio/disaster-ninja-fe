import { createDefaultMCDAConfig } from '~features/mcda/mcdaConfig';
import { createMCDALayersFromBivariateAxes } from '~utils/mcda/createMCDALayersFromBivariateAxes';
import type { ColorTheme } from '~core/types';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { MCDALayerStyle } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { MultivariateLayerStyle } from '~core/logical_layers/renderers/stylesConfigs/multivariate/multivariateStyle';

export function legendToMultivariateStyle(legend: BivariateLegend): MultivariateLayerStyle {
  const scoreLayers = createMCDALayersFromBivariateAxes([legend.axis.x]);
  const baseLayers = createMCDALayersFromBivariateAxes([legend.axis.y]);
  const scoreStyle: MCDALayerStyle = {
    type: 'mcda',
    config: createDefaultMCDAConfig({
      name: legend.axis.x.label || legend.axis.x.quotient.join('/'),
      layers: scoreLayers,
    }),
  };
  const baseStyle: MCDALayerStyle = {
    type: 'mcda',
    config: createDefaultMCDAConfig({
      name: legend.axis.y.label || legend.axis.y.quotient.join('/'),
      layers: baseLayers,
    }),
  };
  const colors: ColorTheme = legend.steps.map((step) => ({
    id: step.label,
    color: step.color,
    isFallbackColor: step.isFallbackColor,
  }));
  return {
    type: 'multivariate',
    config: {
      version: 0,
      id: legend.name,
      name: legend.name,
      score: scoreStyle,
      base: baseStyle,
      stepOverrides: {
        scoreSteps: legend.axis.x.steps,
        baseSteps: legend.axis.y.steps,
      },
      colors: { type: 'bivariate', colors },
    },
  };
}

export function mcdaToMultivariateStyle(style: MCDALayerStyle): MultivariateLayerStyle {
  return {
    type: 'multivariate',
    config: {
      version: 0,
      id: style.config.id,
      name: style.config.name,
      score: style,
      colors: { type: 'mcda', colors: style.config.colors },
    },
  };
}
