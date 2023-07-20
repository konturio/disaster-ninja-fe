import { layersOrderManager as defaultLayersOrderManager } from './layersOrder';
import { mapLibreParentsIds } from './mapLibreParentsIds';
import type maplibregl from 'maplibre-gl';
import type { LayersOrderManager } from './layersOrder';

export function layerByOrder(
  map: maplibregl.Map,
  layersOrderManager: LayersOrderManager = defaultLayersOrderManager,
) {
  function addAboveLayerWithSameType(
    maplibreLayer: maplibregl.LayerSpecification,
    uiLayerId: string,
  ) {
    mapLibreParentsIds.set(maplibreLayer.id, uiLayerId);
    layersOrderManager.getIdToMountOnTypesTop(
      maplibreLayer.type,
      maplibreLayer.id,
      (id) => map.addLayer(maplibreLayer, id),
    );
  }
  function addUnderLayerWithSameType(
    maplibreLayer: maplibregl.LayerSpecification,
    uiLayerId: string,
  ) {
    mapLibreParentsIds.set(maplibreLayer.id, uiLayerId);
    layersOrderManager.getIdToMountOnTypesBottom(
      maplibreLayer.type,
      maplibreLayer.id,
      (id) => map.addLayer(maplibreLayer, id),
    );
  }
  function addAboveAllExistingLayers(
    maplibreLayer: maplibregl.LayerSpecification,
    uiLayerId: string,
  ) {
    mapLibreParentsIds.set(maplibreLayer.id, uiLayerId);
    map.addLayer(maplibreLayer, undefined);
  }
  return {
    addAboveLayerWithSameType,
    addUnderLayerWithSameType,
    addAboveAllExistingLayers,
  };
}
