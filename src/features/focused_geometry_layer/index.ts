import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { i18n } from '~core/localization';
import { store } from '~core/store/store';
import { forceRun } from '~utils/atoms/forceRun';
import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/shared_state/focusedGeometry';
import {
  FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY,
  FOCUSED_GEOMETRY_COLOR,
} from './constants';
import { createFocusedGeometrySourceAtom } from './atoms/focusedGeometrySourceAtom';
import { FocusedGeometryRenderer } from './renderers/FocusedGeometryRenderer';

let isInitialized = false;

export function initFocusedGeometryLayer() {
  if (isInitialized) return;
  isInitialized = true;

  // Connect layer source with focused geometry
  forceRun(createFocusedGeometrySourceAtom(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID));

  store.dispatch([
    // Set layer settings once
    layersSettingsAtom.set(
      FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
      createAsyncWrapper({
        name: i18n.t(FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY),
        id: FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
        boundaryRequiredForRetrieval: false,
        ownedByUser: false,
      }),
    ),
    // Sel layer legend once
    layersLegendsAtom.set(
      FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
      createAsyncWrapper({
        type: 'simple',
        name: i18n.t(FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY),
        steps: [
          {
            stepShape: 'circle',
            stepName: i18n.t(FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY),
            style: {
              color: FOCUSED_GEOMETRY_COLOR,
            },
          },
        ],
      }),
    ),
    // Add layer to registry, so it available from panel and use common lifecycle
    layersRegistryAtom.register({
      renderer: new FocusedGeometryRenderer({
        id: FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
      }),
      id: FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
    }),
  ]);
}
