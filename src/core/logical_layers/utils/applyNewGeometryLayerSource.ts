import { store } from '~core/store/store';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { layersSourcesAtom } from '../atoms/layersSources';
import { createGeoJSONLayerSource } from './createGeoJSONLayerSource';
import type { GeometryWithHash } from '~core/focused_geometry/types';

export function applyNewGeometryLayerSource(
  layerId: string,
  geometry: GeometryWithHash | null,
) {
  function dispatchLayerSource(layerId, geometry) {
    const referenceAreaLayerSource = createGeoJSONLayerSource(layerId, geometry);
    store.dispatch(
      layersSourcesAtom.set(layerId, createAsyncWrapper(referenceAreaLayerSource)),
    );
  }

  if (geometry) {
    if (geometry.type === 'FeatureCollection' || geometry.type === 'Feature') {
      dispatchLayerSource(layerId, geometry);
    } else {
      console.error(`[${layerId}]: Only FeatureCollection and Feature supported `);
    }
  } else {
    dispatchLayerSource(layerId, {
      type: 'FeatureCollection',
      features: [],
    });
  }
  return geometry;
}
