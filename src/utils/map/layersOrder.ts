import type maplibregl from 'maplibre-gl';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder';

export function layerByOrder(map: maplibregl.Map) {
  function addAboveLayerWithSameType(layer: maplibregl.AnyLayer) {
    layersOrderManager.getIdToMountOnTypesTop(layer.type, (id) =>
      map.addLayer(layer, id),
    );
  }
  function addUnderLayerWithSameType(layer: maplibregl.AnyLayer) {
    layersOrderManager.getIdToMountOnTypesBottom(layer.type, (id) =>
      map.addLayer(layer, id),
    );
  }
  function addAboveAllExistingLayers(layer: maplibregl.AnyLayer) {
    map.addLayer(layer, undefined);
  }
  return {
    addAboveLayerWithSameType,
    addUnderLayerWithSameType,
    addAboveAllExistingLayers,
  };
}
