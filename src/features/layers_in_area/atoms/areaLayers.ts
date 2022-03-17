import { Action } from '@reatom/core';
import { createResourceAtom } from '~utils/atoms/createResourceAtom';
import { createAtom } from '~utils/atoms/createPrimitives';
import {
  FocusedGeometry,
  focusedGeometryAtom,
} from '~core/shared_state/focusedGeometry';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { layersMetaAtom } from '~core/logical_layers/atoms/layersMeta';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { apiClient } from '~core/index';
import { LayerInArea } from '../types';
import { GenericRenderer } from '../renderers/GenericRenderer';
import { legendFormatter } from '~utils/legend/legendFormatter';
import { currentEventFeedAtom } from '~core/shared_state';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import {
  UpdateCallbackLayersType,
  updateCallbackService,
} from '~core/update_callbacks';

/**
 * This resource atom get layers for current focused geometry.
 * Also it add event id in case this geometry taken from event
 *
 * Important notes:
 *
 * Despite that the api allows you to get a layer only by event id
 * This atom wait until currentEvent feature get new event geometry and update focused geometry
 * Without this limitation this atom triggered twice on every event change
 * 1) when eventId changed and 2) when focusedGeometry changed
 *
 * Another caveat - eventId is read from focusedGeometry atom,
 * that means - after focusedGeometry editing layers that we get by eventId can be omitted
 */
const areaLayersDependencyAtom = createAtom(
  {
    _update: () => null,
    focusedGeometryAtom,
    callbackAtom: updateCallbackService.addCallback(UpdateCallbackLayersType),
  },
  (
    { onChange, getUnlistedState, onAction, create, schedule },
    state: {
      focusedGeometry: FocusedGeometry | null;
      eventFeed: { id: string } | null;
    } = {
      focusedGeometry: null,
      eventFeed: null,
    },
  ) => {
    onChange('callbackAtom', () => {
      const geometry = getUnlistedState(focusedGeometryAtom);
      const feed = getUnlistedState(currentEventFeedAtom);
      state = { focusedGeometry: geometry, eventFeed: feed };
    });

    onChange('focusedGeometryAtom', (geometry) => {
      const feed = getUnlistedState(currentEventFeedAtom);
      state = { focusedGeometry: geometry, eventFeed: feed };
    });

    return state;
  },
);

export const areaLayersResourceAtom = createResourceAtom(async (params) => {
  if (!params?.focusedGeometry) return;
  const body: {
    eventId?: string;
    geoJSON?: GeoJSON.GeoJSON;
    eventFeed?: string;
  } = {
    geoJSON: params?.focusedGeometry.geometry,
  };

  if (params?.focusedGeometry.source.type === 'event') {
    body.eventId = params?.focusedGeometry.source.meta.eventId;
    if (params?.eventFeed) {
      body.eventFeed = params?.eventFeed.id;
    }
  }

  const responseData = await apiClient.post<LayerInArea[]>(
    '/layers/search/',
    body,
    true,
  );
  if (responseData === undefined) throw new Error('No data received');
  return responseData;
}, areaLayersDependencyAtom);

/**
 * This atom responsibilities:
 * 1. Find a diff between old layer in area list and new
 * 2.1 Unregister missing layers
 * 2.2 Create and register new layers
 * 3. Set area layers legends, meta and settings
 */
export const areaLayers = createAtom(
  {
    areaLayersResourceAtom,
  },
  ({ onChange, schedule }) => {
    onChange('areaLayersResourceAtom', (nextData, prevData) => {
      /* Prepare data */
      if (nextData.loading) return null;
      const { data: nextLayers } = nextData;
      const { data: prevLayers } = prevData ?? {};
      const allLayers = new Set([
        ...(nextLayers ?? []).map((l) => l.id),
        ...(prevLayers ?? []).map((l) => l.id),
      ]);

      /* Find diff */
      const nextMap = new Map(nextLayers?.map((l) => [l.id, l]));
      const prevSet = new Set(prevLayers?.map((l) => l.id));
      const [added, removed, updated] = Array.from(allLayers).reduce(
        (acc, layerId) => {
          if (nextMap.has(layerId) && !prevSet.has(layerId)) {
            acc[0].set(layerId, nextMap.get(layerId)!);
          } else if (prevSet.has(layerId) && !nextMap.has(layerId)) {
            acc[1].add(layerId);
          } else if (nextMap.has(layerId) && prevSet.has(layerId)) {
            acc[2].set(layerId, nextMap.get(layerId)!);
          }
          return acc;
        },
        [
          new Map<string, LayerInArea>(),
          new Set<string>(),
          new Map<string, LayerInArea>(),
        ],
      );

      const actions: Action[] = [];

      /* Update layers */
      const layerUpdateActions = Array.from(updated).reduce(
        (acc, [layerId, layer]) => {
          acc.push(
            ...createLayerActionsFromLayerInArea(layerId, layer, {
              registration: false,
            }),
          );
          return acc;
        },
        [] as Action[],
      );

      actions.push(...layerUpdateActions);

      /* Register added layers */
      const layerRegisterActions = Array.from(added).reduce(
        (acc, [layerId, layer]) => {
          acc.push(...createLayerActionsFromLayerInArea(layerId, layer));
          return acc;
        },
        [] as Action[],
      );

      actions.push(...layerRegisterActions);

      /* Unregister removed layers */
      actions.push(layersRegistryAtom.unregister(Array.from(removed)));

      /* Batch actions into one transaction */
      if (actions.length) {
        schedule((dispatch) => {
          dispatch(actions);
        });
      }
    });
  },
  'layersInAreaLogicalLayers',
);

export function createLayerActionsFromLayerInArea(
  layerId: string,
  layer: LayerInArea,
  options = { registration: true },
): Action[] {
  const actions: Action[] = [];
  const cleanUpActions: Action[] = [];

  // Setup meta
  actions.push(
    layersMetaAtom.set(layerId, {
      isLoading: false,
      error: null,
      data: {
        description: layer.description,
        copyrights: layer.copyrights,
      },
    }),
  );
  cleanUpActions.push(layersMetaAtom.delete(layerId));

  // Setup settings
  actions.push(
    layersSettingsAtom.set(layerId, {
      isLoading: false,
      error: null,
      data: {
        id: layerId,
        name: layer.name,
        category: layer.category,
        group: layer.group,
        boundaryRequiredForRetrieval:
          layer.boundaryRequiredForRetrieval ?? false,
      },
    }),
  );
  cleanUpActions.push(layersSettingsAtom.delete(layerId));

  // Setup legends
  actions.push(
    layersLegendsAtom.set(layerId, {
      isLoading: false,
      error: null,
      data: legendFormatter(layer),
    }),
  );
  cleanUpActions.push(layersLegendsAtom.delete(layerId));

  if (layer.source) {
    actions.push(
      layersSourcesAtom.set(layerId, {
        error: null,
        data: {
          id: layerId,
          source: {
            urls: (layer.source as any).tiles,
            type: layer.source.type as any,
            tileSize: 512,
          } as any,
        },
        isLoading: false,
      }),
    );
    cleanUpActions.push(layersSourcesAtom.delete(layerId));
  }

  // Register
  if (options.registration) {
    actions.push(
      layersRegistryAtom.register({
        id: layerId,
        renderer: new GenericRenderer({
          id: layerId,
        }),
        cleanUpActions,
      }),
    );
  }

  return actions;
}
