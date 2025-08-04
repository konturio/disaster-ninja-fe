import type { LayerSummaryDto } from '~core/logical_layers/types/source';

export const EVENT_SHAPE_LAYER_ID = 'eventShape';

export function renameEventShapeLayer(layers: LayerSummaryDto[], eventName?: string) {
  if (!eventName) return layers;
  return layers.map((layer) =>
    layer.id === EVENT_SHAPE_LAYER_ID ? { ...layer, name: eventName } : layer,
  );
}
