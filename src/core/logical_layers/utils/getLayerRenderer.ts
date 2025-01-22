import { GenericRenderer } from '~core/logical_layers/renderers/GenericRenderer';
import { BivariateRenderer } from '~core/logical_layers/renderers/BivariateRenderer/BivariateRenderer';
import { MultivariateRenderer } from '../renderers/MultivariateRenderer/MultivariateRenderer';
import type { LayerSummaryDto } from '~core/logical_layers/types/source';
import type { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';

export function getLayerRenderer(layer: LayerSummaryDto): LogicalLayerDefaultRenderer {
  if (layer.group === 'bivariate' && layer.category === 'overlay') {
    if (layer.type === 'multivariate') {
      return new MultivariateRenderer({ id: layer.id });
    }
    return new BivariateRenderer({ id: layer.id });
  }

  return new GenericRenderer({ id: layer.id });
}
