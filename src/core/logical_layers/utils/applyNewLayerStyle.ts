import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { applyNewLayerSource } from '~core/logical_layers/utils/applyNewLayerSource';
import { deepCopy } from '~core/logical_layers/utils/deepCopy';
import type { LayerStyle } from '~core/logical_layers/types/style';

export function applyNewLayerStyle(style: LayerStyle) {
  const id = style.config.id;
  const oldSource = layersSourcesAtom.getState().get(id)?.data;
  if (oldSource) {
    const newSource = deepCopy(oldSource);
    if (newSource?.style?.config) {
      newSource.style = { ...style };
    }
    applyNewLayerSource(newSource);
  }
}
