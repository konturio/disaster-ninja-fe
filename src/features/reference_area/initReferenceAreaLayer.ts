import { forceRun } from '~utils/atoms/forceRun';
import { store } from '~core/store/store';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { FeatureFlag, featureFlagsAtom } from '~core/shared_state';
import { setReferenceArea } from '~core/shared_state/referenceArea';
import { createReferenceAreaSourceAtom } from './atoms/referenceAreaSourceAtom';
import {
  REFERENCE_AREA_COLOR,
  REFERENCE_AREA_LOGICAL_LAYER_ID,
  REFERENCE_AREA_LOGICAL_LAYER_TRANSLATION_KEY,
} from './constants';
import { ReferenceAreaRenderer } from './renderers/ReferenceAreaRenderer';

let isInitialized = false;

export function initReferenceAreaLayer() {
  if (isInitialized) return;
  isInitialized = true;

  // Connect layer source with reference area geometry
  forceRun(createReferenceAreaSourceAtom(REFERENCE_AREA_LOGICAL_LAYER_ID));

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
