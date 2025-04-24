import { createDefaultMCDAConfig } from '~features/mcda/mcdaConfig';
import {
  DEFAULT_MULTIBIVARIATE_COLORS,
  DEFAULT_MULTIVARIATE_ANALYSIS_NAME,
} from '~utils/multivariate/constants';
import { DEFAULT_MCDA_COLORS_BY_SENTIMENT } from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { i18n } from '~core/localization';
import { generateMultivariateId } from './generateMultivariateId';
import { createStepsForMCDADimension } from './createStepsForMCDADimension';
import type { Axis } from '~utils/bivariate';
import type {
  MCDALayer,
  MCDALayerStyle,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type {
  MultivariateColorConfig,
  MultivariateLayerConfig,
} from '~core/logical_layers/renderers/MultivariateRenderer/types';

type MultivariateLayerConfigOverrides = {
  name?: string;
  score?: MCDALayer[];
  base?: MCDALayer[];
  colors?: MultivariateColorConfig;
  stepOverrides?: MultivariateLayerConfig['stepOverrides'];
  opacity?: MultivariateLayerConfig['opacity'];
};

export function createMultivariateConfig(
  overrides: MultivariateLayerConfigOverrides,
  availableBivariateAxes: Axis[],
): MultivariateLayerConfig {
  const name = overrides?.name || DEFAULT_MULTIVARIATE_ANALYSIS_NAME;
  const hasScore = !!overrides?.score?.length;
  const hasBase = !!overrides?.base?.length;
  const isBivariateStyleLegend = hasScore && hasBase;
  const scoreMCDAStyle: MCDALayerStyle = {
    type: 'mcda',
    config: createDefaultMCDAConfig(
      hasScore
        ? {
            layers: overrides?.score,
            name: createMCDANameOverride(overrides.score, i18n.t('multivariate.score')),
          }
        : undefined,
    ),
  };
  const baseMCDAStyle: MCDALayerStyle | undefined = hasBase
    ? {
        type: 'mcda',
        config: createDefaultMCDAConfig({
          layers: overrides?.base,
          name: createMCDANameOverride(overrides.base, i18n.t('multivariate.compare')),
        }),
      }
    : undefined;

  return {
    version: 0,
    id: generateMultivariateId(name),
    name,
    score: scoreMCDAStyle,
    base: baseMCDAStyle,
    opacity: overrides.opacity ?? 1,
    stepOverrides: isBivariateStyleLegend
      ? overrides.stepOverrides || {
          baseSteps: createStepsForMCDADimension(overrides.base, availableBivariateAxes),
          scoreSteps: createStepsForMCDADimension(
            overrides.score,
            availableBivariateAxes,
          ),
        }
      : undefined,
    colors:
      overrides?.colors ||
      (isBivariateStyleLegend
        ? { type: 'bivariate', colors: DEFAULT_MULTIBIVARIATE_COLORS }
        : {
            type: 'mcda',
            colors: DEFAULT_MCDA_COLORS_BY_SENTIMENT,
          }),
  };
}

function createMCDANameOverride(
  layers: MCDALayer[] | undefined,
  fallbackNameOverride?: string,
): string | undefined {
  if (layers?.length === 1) {
    return layers[0].name;
  } else {
    return fallbackNameOverride;
  }
}
