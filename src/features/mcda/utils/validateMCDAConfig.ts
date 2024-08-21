import { i18n } from '~core/localization';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

// TODO: implement json schema validation to cover all properties
export function validateMCDAConfig(configJson: Partial<MCDAConfig>): MCDAConfig {
  // layers
  if (!Array.isArray(configJson?.layers) || !configJson?.layers.length) {
    throw new Error(i18n.t('mcda.error_invalid_parameter', { parameter: 'layers' }));
  }
  for (const mcdaAxis of configJson.layers) {
    if (!isTuple(mcdaAxis.sentiment, 2)) {
      throw new Error(
        i18n.t('mcda.error_invalid_layer_parameter', {
          parameter: 'sentiment',
          axisName: mcdaAxis.id,
        }),
      );
    }
    if (!isTuple(mcdaAxis.range, 2)) {
      throw new Error(
        i18n.t('mcda.error_invalid_layer_parameter', {
          parameter: 'range',
          axisName: mcdaAxis.id,
        }),
      );
    }
    if (!Array.isArray(mcdaAxis.indicators)) {
      throw new Error(
        i18n.t('mcda.error_invalid_layer_parameter', {
          parameter: 'indicators',
          axisName: mcdaAxis.id,
        }),
      );
    }
    if (!isTuple(mcdaAxis.axis, 2)) {
      throw new Error(
        i18n.t('mcda.error_invalid_layer_parameter', {
          parameter: 'axis',
          axisName: mcdaAxis.id,
        }),
      );
    }
  }
  // colors
  if (
    !(
      configJson?.colors?.type === 'sentiments' ||
      configJson?.colors?.type === 'mapLibreExpression'
    )
  ) {
    throw new Error(i18n.t('mcda.error_invalid_parameter', { parameter: 'colors' }));
  }

  return configJson as MCDAConfig;
}

function isTuple(obj: unknown, length: number): boolean {
  return Array.isArray(obj) && obj.length === length;
}
