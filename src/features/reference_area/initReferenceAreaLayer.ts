import { store } from '~core/store/store';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { referenceAreaAtom } from '~core/shared_state/referenceArea';
import { createGeoJSONLayerSource } from '~core/logical_layers/utils/createGeoJSONLayerSource';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
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
  createReferenceAreaLayer();
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

function createReferenceAreaLayer() {
  store.dispatch([
    // Set layer settings once
    layersSettingsAtom.set(
      REFERENCE_AREA_LOGICAL_LAYER_ID,
      createAsyncWrapper({
        name: REFERENCE_AREA_LOGICAL_LAYER_TRANSLATION_KEY,
        id: REFERENCE_AREA_LOGICAL_LAYER_ID,
        boundaryRequiredForRetrieval: false,
        ownedByUser: false,
      }),
    ),
    // Sel layer legend once
    layersLegendsAtom.set(
      REFERENCE_AREA_LOGICAL_LAYER_ID,
      createAsyncWrapper({
        type: 'simple',
        name: REFERENCE_AREA_LOGICAL_LAYER_TRANSLATION_KEY,
        steps: [
          {
            stepShape: 'circle',
            stepName: REFERENCE_AREA_LOGICAL_LAYER_TRANSLATION_KEY,
            style: {
              color: REFERENCE_AREA_COLOR,
            },
          },
        ],
      }),
    ),
    // Add layer to registry, so it available from panel and use common lifecycle
    layersRegistryAtom.register({
      renderer: new ReferenceAreaRenderer({
        id: REFERENCE_AREA_LOGICAL_LAYER_ID,
      }),
      id: REFERENCE_AREA_LOGICAL_LAYER_ID,
    }),
    enabledLayersAtom.set(REFERENCE_AREA_LOGICAL_LAYER_ID),
  ]);
}
