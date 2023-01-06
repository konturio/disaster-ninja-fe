import { layersOrderManager as defaultLayersOrderManager } from '~core/logical_layers/utils/layersOrder/layersOrder';
import { generatedMapboxLayersParents } from '~core/logical_layers/atoms/generatedMapboxLayers';
import type maplibregl from 'maplibre-gl';
import type { LayersOrderManager } from '~core/logical_layers/utils/layersOrder/layersOrder';

export function layerByOrder(
  map: maplibregl.Map,
  layersOrderManager: LayersOrderManager = defaultLayersOrderManager,
) {
  function addAboveLayerWithSameType(
    maplibreLayer: maplibregl.AnyLayer,
    uiLayerId: string,
  ) {
    generatedMapboxLayersParents.set.dispatch(maplibreLayer.id, uiLayerId);
    layersOrderManager.getIdToMountOnTypesTop(
      maplibreLayer.type,
      maplibreLayer.id,
      (id) => map.addLayer(maplibreLayer, id),
    );
  }
  function addUnderLayerWithSameType(
    maplibreLayer: maplibregl.AnyLayer,
    uiLayerId: string,
  ) {
    generatedMapboxLayersParents.set.dispatch(maplibreLayer.id, uiLayerId);
    layersOrderManager.getIdToMountOnTypesBottom(
      maplibreLayer.type,
      maplibreLayer.id,
      (id) => map.addLayer(maplibreLayer, id),
    );
  }
  function addAboveAllExistingLayers(
    maplibreLayer: maplibregl.AnyLayer,
    uiLayerId: string,
  ) {
    generatedMapboxLayersParents.set.dispatch(maplibreLayer.id, uiLayerId);
    map.addLayer(maplibreLayer, undefined);
  }
  return {
    addAboveLayerWithSameType,
    addUnderLayerWithSameType,
    addAboveAllExistingLayers,
  };
}
