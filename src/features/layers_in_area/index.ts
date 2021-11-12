import { layersInAreaLogicalLayersAtom } from './atoms/layersInAreaLogicalLayers';

export function initLayersInArea() {
  layersInAreaLogicalLayersAtom.subscribe(() => null);
}
