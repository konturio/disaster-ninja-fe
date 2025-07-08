import { currentEventFeedAtom } from '~core/shared_state/currentEventFeed';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { createAtom } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { removeEmpty } from '~utils/common';
import { filterUnsupportedLayerTypes } from '~core/logical_layers/layerTypes';
import { applyContextToId } from '~core/logical_layers/utils/contextualIds';
import { getLayersInArea } from '~core/api/layers';
import type { LayersInAreaAndEventLayerResourceParameters } from '~core/api/layers';
import type { FocusedGeometry } from '~core/focused_geometry/types';

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
    const layers = await getLayersInArea(
      layersInAreaAndEventLayerResourceParameters,
      abortController,
    );
    const eventId = layersInAreaAndEventLayerResourceParameters.eventId;
    return filterUnsupportedLayerTypes(layers || []).map((layer) => ({
      ...layer,
      id: applyContextToId(layer.id, eventId),
      originalId: layer.id,
    }));
  },
  'layersInAreaAndEventLayerResource',
);
