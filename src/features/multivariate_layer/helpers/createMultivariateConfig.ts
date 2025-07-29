import { createDefaultMCDAConfig } from '~features/mcda/mcdaConfig';
import {
  DEFAULT_MULTIBIVARIATE_COLORS,
  DEFAULT_MULTIVARIATE_ANALYSIS_NAME,
} from '~utils/multivariate/constants';
import { DEFAULT_MCDA_COLORS_BY_SENTIMENT } from '~mcda/calculations/constants';
import { i18n } from '~core/localization';
import { isNumber } from '~utils/common';
import {
  DEFAULT_EXTRUSION_MAX_HEIGHT_M,
  DEFAULT_MULTIVARIATE_TEXT_PRECISION,
} from '../constants';
import { generateMultivariateId } from './generateMultivariateId';
import { createStepsForMCDADimension } from './createStepsForMCDADimension';
import type { Axis } from '~utils/bivariate';
import type { MCDALayer, MCDALayerStyle } from '~mcda/types';
import type {
  MultivariateColorConfig,
  MultivariateLayerConfig,
  TextDimension,
} from '~core/logical_layers/renderers/MultivariateRenderer/types';

type MultivariateLayerConfigOverrides = {
  name?: string;
  score?: MCDALayer[];
  base?: MCDALayer[];
  colors?: MultivariateColorConfig;
  stepOverrides?: MultivariateLayerConfig['stepOverrides'];
  opacity?: MCDALayer[] | number;
  text?: MCDALayer[];
  textSettings?: Exclude<TextDimension, 'mcdaValue' | 'mcdaMode'>;
  extrusion?: MCDALayer[];
  extrusionSettings?: { maxHeight?: number };
};

export function createMultivariateConfig(
  overrides: MultivariateLayerConfigOverrides,
  availableBivariateAxes: Axis[],
): MultivariateLayerConfig {
  const name = overrides?.name || DEFAULT_MULTIVARIATE_ANALYSIS_NAME;
  const hasScore = !!overrides?.score?.length;
  const hasBase = !!overrides?.base?.length;
  const hasText = !!overrides?.text?.length;
  const hasExtrusion = !!overrides?.extrusion?.length;
  const isBivariateStyleLegend = hasScore && hasBase;
  const scoreMCDAStyle: MCDALayerStyle | undefined = hasScore
    ? {
        type: 'mcda',
        config: createDefaultMCDAConfig({
          layers: overrides?.score,
          name: createMCDANameOverride(overrides.score, i18n.t('multivariate.score')),
        }),
      }
    : undefined;
  const baseMCDAStyle: MCDALayerStyle | undefined = hasBase
    ? {
        type: 'mcda',
        config: createDefaultMCDAConfig({
          layers: overrides?.base,
          name: createMCDANameOverride(overrides.base, i18n.t('multivariate.compare')),
        }),
      }
    : undefined;
  const opacityMCDAStyle: MCDALayerStyle | undefined =
    overrides.opacity !== undefined &&
    !isNumber(overrides.opacity) &&
    overrides?.opacity.length
      ? {
          type: 'mcda',
          config: createDefaultMCDAConfig({
            layers: overrides?.opacity,
            name: createMCDANameOverride(
              overrides.opacity,
              i18n.t('multivariate.hide_area'),
            ),
          }),
        }
      : undefined;
  const textMCDAStyle: MCDALayerStyle | undefined = hasText
    ? {
        type: 'mcda',
        config: createDefaultMCDAConfig({
          layers: overrides?.text,
          name: createMCDANameOverride(overrides.text, i18n.t('multivariate.labels')),
        }),
      }
    : undefined;
  const textSettings = overrides.textSettings ?? {};
  const textDimension: TextDimension | undefined = textMCDAStyle
    ? {
        precision: DEFAULT_MULTIVARIATE_TEXT_PRECISION,
        ...textSettings,
        mcdaValue: textMCDAStyle,
      }
    : undefined;
  const opacityStatic: number | undefined = isNumber(overrides.opacity)
    ? overrides.opacity
    : undefined;

  const extrusionMCDAStyle: MCDALayerStyle | undefined = hasExtrusion
    ? {
        type: 'mcda',
        config: createDefaultMCDAConfig({
          layers: overrides.extrusion,
          name: createMCDANameOverride(overrides.extrusion, i18n.t('multivariate.3d')),
        }),
      }
    : undefined;

  return {
    version: 0,
    id: generateMultivariateId(name),
    name,
    score: scoreMCDAStyle,
    base: baseMCDAStyle,
    opacity: opacityMCDAStyle ?? opacityStatic,
    text: textDimension,
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
    extrusion: extrusionMCDAStyle
      ? {
          height: extrusionMCDAStyle,
          maxHeight:
            overrides.extrusionSettings?.maxHeight ?? DEFAULT_EXTRUSION_MAX_HEIGHT_M,
        }
      : undefined,
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
