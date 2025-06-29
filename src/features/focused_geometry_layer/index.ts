import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/focused_geometry/constants';
import { registerNewGeometryLayer } from '~core/logical_layers/utils/registerNewGeometryLayer';
import { store } from '~core/store/store';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { applyNewGeometryLayerSource } from '~core/logical_layers/utils/applyNewGeometryLayerSource';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { getEventName, getEventType } from '~core/focused_geometry/utils';
import {
  FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY,
  FOCUSED_GEOMETRY_COLOR,
} from './constants';
import { FocusedGeometryRenderer } from './renderers/FocusedGeometryRenderer';

let isInitialized = false;

export function initFocusedGeometryLayer() {
  if (isInitialized) return;
  isInitialized = true;

  // when focusedGeometryAtom updates, we create a new reference area layer source
  store.v3ctx.subscribe(focusedGeometryAtom.v3atom, (focusedGeometry) => {
    applyNewGeometryLayerSource(
      FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
      focusedGeometry?.geometry ?? null,
    );
    const eventName = getEventName(focusedGeometry);
    const eventType = getEventType(focusedGeometry);
    const name =
      eventName && eventType
        ? `${eventType}: ${eventName}`
        : FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY;
    store.dispatch([
      layersSettingsAtom.set(
        FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
        createAsyncWrapper({
          name,
          id: FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
          boundaryRequiredForRetrieval: false,
          ownedByUser: false,
        }),
      ),
      layersLegendsAtom.set(
        FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
        createAsyncWrapper({
          type: 'simple',
          name,
          steps: [
            {
              stepShape: 'circle',
              stepName: name,
              style: {
                color: FOCUSED_GEOMETRY_COLOR,
              },
            },
          ],
        }),
      ),
    ]);
  });

  registerNewGeometryLayer(
    FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
    FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY,
    new FocusedGeometryRenderer({
      id: FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
    }),
    FOCUSED_GEOMETRY_COLOR,
  );
}
