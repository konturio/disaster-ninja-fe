import { createAtom } from '~utils/atoms/createPrimitives';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { focusedGeometryAtom, getEvendId } from '~core/shared_state/focusedGeometry';
import { currentEventFeedAtom } from '~core/shared_state';
import { layersGlobalResource } from '../layersGlobalResource';
import { layersInAreaAndEventLayerResource } from '../layersInAreaAndEventLayerResource';
import { areaLayersDetailsResourceAtomCache } from './areaLayersDetailsResourceAtomCache';
import type { DetailsRequestParams } from './types';

export const areaLayersDetailsParamsAtom = createAtom(
  {
    enabledLayersAtom,
    layersGlobalResource,
    layersInAreaAndEventLayerResource,
  },
  (
    { get, getUnlistedState },
    state: DetailsRequestParams | null = null,
  ): DetailsRequestParams | null => {
    const layersGlobal = get('layersGlobalResource');
    const layersInAreaAndEventLayer = get('layersInAreaAndEventLayerResource');
    const allLayers = [
      ...(layersGlobal.data ?? []),
      ...(layersInAreaAndEventLayer.data ?? []),
    ];
    const enabledLayers = get('enabledLayersAtom');
    const focusedGeometry = getUnlistedState(focusedGeometryAtom);
    const eventId = getEvendId(focusedGeometry);
    const cache = getUnlistedState(areaLayersDetailsResourceAtomCache);

    const mustBeRequested = allLayers.filter((layer) => {
      const isEnabled = enabledLayers.has(layer.id);
      const isInCache = cache.get(eventId)?.has(layer.id) ?? false;
      return isEnabled && !isInCache;
    });

    if (mustBeRequested.length === 0) return state; // Do not request anything

    const [
      layersToRetrieveWithGeometryFilter,
      layersToRetrieveWithoutGeometryFilter,
      layersToRetrieveWithEventId,
    ] = mustBeRequested.reduce(
      (acc, layer) => {
        acc[layer.boundaryRequiredForRetrieval ? 0 : 1].add(layer.id);
        if (layer.eventIdRequiredForRetrieval) {
          acc[2].add(layer.id);
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
    }

    return newState;
  },
  'areaLayersDetailsParamsAtom',
);
