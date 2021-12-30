import { LogicalLayer, LogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';

interface MountedLayers {
  atom: LogicalLayerAtom;
  state: {
    layer: LogicalLayer;
  };
}

// Sorting will be implemented
export function sortByCategoryAndType(layers: MountedLayers[]) {
  return layers.map((l) => l.atom);
}
