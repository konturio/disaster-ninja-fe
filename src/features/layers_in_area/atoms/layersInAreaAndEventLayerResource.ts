import { apiClient } from '~core/apiClientInstance';
import {
  currentApplicationAtom,
  currentEventFeedAtom,
  focusedGeometryAtom,
} from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { removeEmpty } from '~utils/common';
import { LAYERS_IN_AREA_API_ERROR } from '../constants';
import type { FocusedGeometry } from '~core/shared_state/focusedGeometry';
import type { LayerInArea } from '../types';

type LayersInAreaAndEventLayerResourceParameters = {
  appId: string;
  geoJSON: GeoJSON.GeoJSON;
  eventId?: string;
  eventFeed?: string;
};

const getEventId = (focusedGeometry: FocusedGeometry) => {
  return 'meta' in focusedGeometry.source && 'eventId' in focusedGeometry.source.meta
    ? focusedGeometry.source.meta.eventId
    : null;
};

const layersInAreaAndEventLayerResourceParametersAtom = createAtom(
  {
    currentApplicationAtom,
    focusedGeometryAtom,
  },
  ({ get, getUnlistedState }): LayersInAreaAndEventLayerResourceParameters | null => {
    const focusedGeometry = get('focusedGeometryAtom');
    const appId = get('currentApplicationAtom');

    // Check required
    if (focusedGeometry === null) return null;
    if (appId === null) return null;

    const geoJSON = focusedGeometry.geometry;
    const eventId = getEventId(focusedGeometry);
    // getUnlistedState for avoid extra request when eventId changed
    // Updates flow:
    // 1. eventId changed (ignoring)
    // 2. focusedGeometry start loading for new event
    // 3. focusedGeometry loaded
    // 4. get layers for new geometry
    const eventFeed = getUnlistedState(currentEventFeedAtom)?.id;

    return removeEmpty({
      appId,
      eventFeed,
      eventId,
      geoJSON,
    });
  },
);

export const layersInAreaAndEventLayerResource = createAsyncAtom(
  layersInAreaAndEventLayerResourceParametersAtom,
  async (layersInAreaAndEventLayerResourceParameters, abortController) => {
    if (layersInAreaAndEventLayerResourceParameters === null) return null;
    const layers = await apiClient.post<LayerInArea[]>(
      '/layers/search/selected_area',
      layersInAreaAndEventLayerResourceParameters,
      true,
      {
        errorsConfig: { messages: LAYERS_IN_AREA_API_ERROR, dontShowErrors: true },
        signal: abortController.signal,
      },
    );
    return layers;
  },
  'layersInAreaAndEventLayerResource',
);
