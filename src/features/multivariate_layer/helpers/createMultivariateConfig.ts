import { showModal } from '~core/modal';
import { createDefaultMCDAConfig } from '~features/mcda/mcdaConfig';
import {
  DEFAULT_MULTIBIVARIATE_COLORS,
  DEFAULT_MULTIBIVARIATE_STEPS,
} from '~utils/multivariate/constants';
import {
  DEFAULT_GREEN,
  DEFAULT_RED,
  DEFAULT_YELLOW,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { i18n } from '~core/localization';
import { MultivariateAnalysisForm } from '../components/MultivariateAnalysisForm';
import { generateMultivariateId } from './generateMultivariateId';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';

export async function createMultivariateConfig() {
  const input = await showModal(MultivariateAnalysisForm, {
    initialState: {
      analysisConfig: createEmptyMultivariateConfig(),
    },
  });

  if (input === null) return null;

  // const config = createDefaultMCDAConfig({
  //   name: input.name,
  //   layers: createMCDALayersFromBivariateAxes(input.axes),
  // });
  return input;
}

export function createEmptyMultivariateConfig(
  overrides?: Partial<MultivariateLayerConfig>,
): MultivariateLayerConfig {
  const name = overrides?.name ?? i18n.t('multivariate.multivariate_analysis');
  const hasScore = overrides?.score?.config.layers.length;
  const hasBase = overrides?.base?.config.layers.length;
  const isBivariateStyleLegend = hasScore && hasBase;

  return {
    version: 0,
    id: generateMultivariateId(name),
    name,
    score: {
      type: 'mcda',
      config: createDefaultMCDAConfig(
        hasScore ? { layers: overrides?.score?.config.layers } : undefined,
      ),
    },
    base: {
      type: 'mcda',
      config: createDefaultMCDAConfig(
        hasBase ? { layers: overrides?.base?.config.layers } : undefined,
      ),
    },
    stepOverrides: isBivariateStyleLegend
      ? overrides.stepOverrides || {
          baseSteps: DEFAULT_MULTIBIVARIATE_STEPS,
          scoreSteps: DEFAULT_MULTIBIVARIATE_STEPS,
        }
      : undefined,
    colors:
      overrides?.colors ||
      (isBivariateStyleLegend
        ? { type: 'bivariate', colors: DEFAULT_MULTIBIVARIATE_COLORS }
        : {
            type: 'mcda',
            colors: {
              type: 'sentiments',
              parameters: {
                bad: DEFAULT_RED,
                good: DEFAULT_GREEN,
                /* TODO: using midpoints for gradient customization is a temporary solution.
        It will probably be removed in the future in favor of working with Color Manager */
                midpoints: [{ value: 0.5, color: DEFAULT_YELLOW }],
              },
            },
          }),
  };
}
