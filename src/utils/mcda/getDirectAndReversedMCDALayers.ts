import { sentimentReversed } from '~mcda/calculations/constants';
import { arraysAreEqualWithStrictOrder } from '~utils/common/equality';
import type { MCDAConfig, MCDALayer } from '~mcda/types';

export function getDirectAndReversedMCDALayers(config: MCDAConfig) {
  const reversedLayers: MCDALayer[] = [];
  const directLayers: MCDALayer[] = [];
  config.layers
    .filter((layer) => layer.name)
    .forEach((layer) => {
      if (arraysAreEqualWithStrictOrder(layer.sentiment, sentimentReversed)) {
        reversedLayers.push(layer);
      } else {
        directLayers.push(layer);
      }
    });
  return { directLayers, reversedLayers };
}
