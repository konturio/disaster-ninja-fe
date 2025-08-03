import { sentimentReversed } from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { arraysAreEqualWithStrictOrder } from '~utils/common/equality';
import type {
  MCDAConfig,
  MCDALayer,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export function getDirectAndReversedMCDALayers(config: MCDAConfig) {
  const reversedLayers: MCDALayer[] = [];
  const directLayers: MCDALayer[] = [];
  config.layers
    .filter((layer) => layer.name && !layer.isHidden)
    .forEach((layer) => {
      if (arraysAreEqualWithStrictOrder(layer.sentiment, sentimentReversed)) {
        reversedLayers.push(layer);
      } else {
        directLayers.push(layer);
      }
    });
  return { directLayers, reversedLayers };
}
