import { createAtom } from '~utils/atoms/createPrimitives';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { splitContextFromId } from '~core/logical_layers/utils/contextualIds';
import { getEventId } from '~core/focused_geometry/utils';
import { currentEventFeedAtom } from '~core/shared_state/currentEventFeed';
import { layersGlobalResource } from '../layersGlobalResource';
import { layersInAreaAndEventLayerResource } from '../layersInAreaAndEventLayerResource';
import {
  areaLayersDetailsResourceAtomCache,
  getLayersDetailsCacheKey,
} from './areaLayersDetailsResourceAtomCache';
import type { DetailsRequestParams } from './types';

export const areaLayersDetailsParamsAtom = createAtom(
  {
    enabledLayersAtom,
    layersGlobalResource,
    layersInAreaAndEventLayerResource,
    focusedGeometryAtom,
  },
  (
    { get, getUnlistedState },
    state: DetailsRequestParams | null = null,
  ): DetailsRequestParams | null => {
    const layersGlobal = get('layersGlobalResource');
    const { loading, error, data } = get('layersInAreaAndEventLayerResource');
    const layersInAreaAndEventLayer = loading || error || !data ? [] : data;
    const allLayers = [...(layersGlobal.data ?? []), ...layersInAreaAndEventLayer];
    const enabledLayers = get('enabledLayersAtom');
    const focusedGeometry = get('focusedGeometryAtom');
    const eventId = getEventId(focusedGeometry);
    const cache = getUnlistedState(areaLayersDetailsResourceAtomCache);

    const mustBeRequested = allLayers.filter((layer) => {
      const isEnabled = enabledLayers.has(layer.id);
      if (!isEnabled) return false;

      if (layer.eventIdRequiredForRetrieval && !eventId) {
        console.warn(
          `Layer ${layer.id} request is skipped, as eventIdRequiredForRetrieval is true but evenntId is empty.`,
        );
        return false;
      }

      const cacheKey = getLayersDetailsCacheKey({
        boundaryRequiredForRetrieval: layer.boundaryRequiredForRetrieval,
        eventIdRequiredForRetrieval: layer.eventIdRequiredForRetrieval,
        hash: focusedGeometry?.geometry.hash,
        eventId: eventId,
      });

      const cached = cache.get(cacheKey)?.get(layer.id) ?? null;
      return !cached;
    });

    if (mustBeRequested.length === 0) {
      // in we return null - resource atom will not updated.
      // But we need it
      return { skip: true };
    }

    const [
      layersToRetrieveWithGeometryFilter,
      layersToRetrieveWithoutGeometryFilter,
      layersToRetrieveWithEventId,
    ] = mustBeRequested.reduce(
      (acc, layer) => {
        const { baseId } = splitContextFromId(layer.id);
        acc[layer.boundaryRequiredForRetrieval ? 0 : 1].add(baseId);
        if (layer.eventIdRequiredForRetrieval) {
          acc[2].add(baseId);
        }
        return acc;
      },
      // AllLayers can have duplicates, Set help to filter them
      [new Set<string>(), new Set<string>(), new Set<string>()] as const,
    );

    const newState: DetailsRequestParams = {
      layersToRetrieveWithGeometryFilter: Array.from(layersToRetrieveWithGeometryFilter),
      layersToRetrieveWithoutGeometryFilter: Array.from(
        layersToRetrieveWithoutGeometryFilter,
      ),
      layersToRetrieveWithEventId: Array.from(layersToRetrieveWithEventId),
    };

    /**
     * To avoid double request case:
     * (one for enabled layers list, second for focused geometry change)
     * I'm use getUnlistedState here. This atom still updated on focusedGeometryAtom changes
     * because areaLayersResourceAtom subscribed to focusedGeometryAtom
     */
    if (layersToRetrieveWithEventId.size) {
      if (eventId) {
        newState.eventId = eventId;
        const eventFeed = getUnlistedState(currentEventFeedAtom);
        if (eventFeed) newState.eventFeed = eventFeed.id;
      } else {
        console.error(
          'Current geometry not from event, event related layer was selected',
        );
      }
    }

    if (focusedGeometry) {
      newState.geoJSON = focusedGeometry.geometry;
    } else if (newState.layersToRetrieveWithoutGeometryFilter?.length) {
      console.warn(
        'Layers require geometry, but geometry missing in payload',
        newState.layersToRetrieveWithoutGeometryFilter,
      );
    }

    return newState;
  },
  'areaLayersDetailsParamsAtom',
);
