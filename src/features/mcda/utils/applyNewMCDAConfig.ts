import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { applyNewLayerSource } from '~core/logical_layers/utils/applyNewLayerSource';
import { deepCopy } from '~core/logical_layers/utils/deepCopy';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export function applyNewMCDAConfig(config: MCDAConfig) {
  const id = config.id;
  const oldSource = layersSourcesAtom.getState().get(id)?.data;
  if (oldSource) {
    const newSource = deepCopy(oldSource);
    if (newSource?.style?.config) {
      newSource.style.config = { ...config };
    }
    applyNewLayerSource(newSource);
  }
}
