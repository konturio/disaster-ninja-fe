import { appConfig } from '~core/app_config';
import { apiClient } from '~core/apiClientInstance';
import { currentEventFeedAtom } from '~core/shared_state';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { createAtom } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { removeEmpty } from '~utils/common';
import { filterUnsupportedLayerTypes } from '~core/logical_layers/layerTypes';
import { LAYERS_IN_AREA_API_ERROR } from '../constants';
import type { LayerSummaryDto } from '~core/logical_layers/types/source';
import type { FocusedGeometry } from '~core/focused_geometry/types';

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
    focusedGeometryAtom,
  },
  ({ get, getUnlistedState }): LayersInAreaAndEventLayerResourceParameters | null => {
    const focusedGeometry = get('focusedGeometryAtom');

    // Check required
    if (focusedGeometry === null) return null;

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
      appId: appConfig.id,
      eventFeed,
      eventId,
      geoJSON,
    });
  },
  'layersInAreaAndEventLayerResourceParametersAtom',
);

export const layersInAreaAndEventLayerResource = createAsyncAtom(
  layersInAreaAndEventLayerResourceParametersAtom,
  async (layersInAreaAndEventLayerResourceParameters, abortController) => {
    if (layersInAreaAndEventLayerResourceParameters === null) return null;
    const layers = await apiClient.post<LayerSummaryDto[]>(
      '/layers/search/selected_area',
      layersInAreaAndEventLayerResourceParameters,
      true,
      {
        errorsConfig: { messages: LAYERS_IN_AREA_API_ERROR },
        signal: abortController.signal,
      },
    );
    return filterUnsupportedLayerTypes(layers || []);
  },
  'layersInAreaAndEventLayerResource',
);
