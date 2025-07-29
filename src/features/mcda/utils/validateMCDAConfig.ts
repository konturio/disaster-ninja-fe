import { i18n } from '~core/localization';
import type { MCDAConfig } from '~mcda/types';

// TODO: implement json schema validation to cover all properties
export function validateMCDAConfig(configJson: Partial<MCDAConfig>): MCDAConfig {
  // layers
  if (!Array.isArray(configJson?.layers) || !configJson?.layers.length) {
    throw new Error(i18n.t('mcda.error_invalid_parameter', { parameter: 'layers' }));
  }
  const requiredTuples = ['sentiment', 'range', 'indicators', 'axis'];
  for (const mcdaAxis of configJson.layers) {
    requiredTuples.forEach((paramName) => {
      if (!isTuple(mcdaAxis[paramName], 2)) {
        throw new Error(
          i18n.t('mcda.error_invalid_layer_parameter', {
            parameter: paramName,
            axisName: mcdaAxis.id,
          }),
        );
      }
    });
  }
  // colors
  if (!['sentiments', 'mapLibreExpression'].includes(configJson?.colors?.type ?? '')) {
    throw new Error(i18n.t('mcda.error_invalid_parameter', { parameter: 'colors' }));
  }

  return configJson as MCDAConfig;
}

function isTuple(obj: unknown, length: number): boolean {
  return Array.isArray(obj) && obj.length === length;
}
