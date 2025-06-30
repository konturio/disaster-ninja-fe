import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export function removeLayerFromConfig(config: MCDAConfig, layerId: string): MCDAConfig {
  return {
    ...config,
    layers: config.layers.filter((layer) => layer.id !== layerId),
  };
}
