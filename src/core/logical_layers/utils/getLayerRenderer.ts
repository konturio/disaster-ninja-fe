import { GenericRenderer } from '~core/logical_layers/renderers/GenericRenderer';
import { BivariateRenderer } from '~core/logical_layers/renderers/BivariateRenderer';
import type { LayerSummaryDto } from '~core/logical_layers/types/source';
import type { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';

export function getLayerRenderer(layer: LayerSummaryDto): LogicalLayerDefaultRenderer {
  if (layer.group === 'bivariate' && layer.category === 'overlay') {
    return new BivariateRenderer({ id: layer.id });
  }

  return new GenericRenderer({ id: layer.id });
}
