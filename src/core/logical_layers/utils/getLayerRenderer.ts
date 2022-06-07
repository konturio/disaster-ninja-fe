import type { LayerInArea } from '~features/layers_in_area/types';
import type { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { GenericRenderer } from '~core/logical_layers/renderers/GenericRenderer';
import { BivariateRenderer } from '~core/logical_layers/renderers/BivariateRenderer';

export function getLayerRenderer(
  layer: LayerInArea,
): LogicalLayerDefaultRenderer {
  if (layer.group === 'bivariate' && layer.category === 'overlay') {
    return new BivariateRenderer({ id: layer.id });
  }

  return new GenericRenderer({ id: layer.id });
}
