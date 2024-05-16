import { store } from '~core/store/store';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { referenceAreaAtom } from '~core/shared_state/referenceArea';
import { createGeoJSONLayerSource } from '~core/logical_layers/utils/createGeoJSONLayerSource';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { registerNewGeometryLayer } from '~core/logical_layers/utils/registerNewGeometryLayer';
import {
  REFERENCE_AREA_COLOR,
  REFERENCE_AREA_LOGICAL_LAYER_ID,
  REFERENCE_AREA_LOGICAL_LAYER_TRANSLATION_KEY,
} from './constants';
import { ReferenceAreaRenderer } from './renderers/ReferenceAreaRenderer';
import type { GeometryWithHash } from '~core/focused_geometry/types';

let isInitialized = false;

export function initReferenceAreaLayer() {
  if (isInitialized) return;
  isInitialized = true;

  // when referenceAreaAtom updates, we create a new reference area layer source
  store.v3ctx.subscribe(referenceAreaAtom, (geometry) => {
    setReferenceAreaLayerSource(geometry);
  });

  registerNewGeometryLayer(
    REFERENCE_AREA_LOGICAL_LAYER_ID,
    REFERENCE_AREA_LOGICAL_LAYER_TRANSLATION_KEY,
    new ReferenceAreaRenderer({
      id: REFERENCE_AREA_LOGICAL_LAYER_ID,
    }),
    REFERENCE_AREA_COLOR,
  );
}

function setReferenceAreaLayerSource(geometry: GeometryWithHash | null) {
  if (geometry) {
    if (geometry.type === 'FeatureCollection' || geometry.type === 'Feature') {
      const referenceAreaLayerSource = createGeoJSONLayerSource(
        REFERENCE_AREA_LOGICAL_LAYER_ID,
        geometry,
      );
      store.dispatch(
        layersSourcesAtom.set(
          REFERENCE_AREA_LOGICAL_LAYER_ID,
          createAsyncWrapper(referenceAreaLayerSource),
        ),
      );
    } else {
      console.error('[reference_area]: Only FeatureCollection and Feature supported ');
    }
  } else {
    const referenceAreaLayerSource = createGeoJSONLayerSource(
      REFERENCE_AREA_LOGICAL_LAYER_ID,
      {
        type: 'FeatureCollection',
        features: [],
      },
    );
    store.dispatch(
      layersSourcesAtom.set(
        REFERENCE_AREA_LOGICAL_LAYER_ID,
        createAsyncWrapper(referenceAreaLayerSource),
      ),
    );
  }
  return geometry;
}
