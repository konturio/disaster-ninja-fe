import { createResourceAtom } from '~utils/atoms/createResourceAtom';
import { createAtom } from '~utils/atoms/createPrimitives';
import { focusedGeometryAtom } from '~core/shared_state/focusedGeometry';
import { apiClient } from '~core/apiClientInstance';
import { currentApplicationAtom, currentEventFeedAtom } from '~core/shared_state';
import { EDITABLE_LAYERS_GROUP } from '~core/constants';
import { userResourceAtom } from '~core/auth';
import { LAYERS_IN_AREA_API_ERROR } from '~features/layers_in_area/constants';
import { AppFeature } from '~core/auth/types';
import type { LayerInArea } from '../types';
import type { FocusedGeometry } from '~core/shared_state/focusedGeometry';

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
const areaLayersListDependencyAtom = createAtom(
  {
    focusedGeometryAtom,
    userResourceAtom,
  },
  (
    { onChange, getUnlistedState, get },
    state: {
      focusedGeometry: FocusedGeometry | null;
      eventFeed: { id: string } | null;
      appId: string | null;
      createLayerFeatureActivated: boolean | null;
    } = {
      focusedGeometry: null,
      eventFeed: null,
      appId: null,
      createLayerFeatureActivated: null,
    },
  ) => {
    onChange('focusedGeometryAtom', (focusedGeometry) => {
      const eventFeed = getUnlistedState(currentEventFeedAtom);
      const appId = getUnlistedState(currentApplicationAtom);
      const { data: userModel } = get('userResourceAtom');

      const createLayerFeatureActivated =
        userModel?.hasFeature(AppFeature.CREATE_LAYER) ?? null;
      state = {
        focusedGeometry,
        eventFeed,
        appId,
        createLayerFeatureActivated,
      };
    });

    return state;
  },
  'areaLayersListDependencyAtom',
);

export const areaLayersListResource = createResourceAtom(
  async (params) => {
    if (!params) return;
    if (params.createLayerFeatureActivated === null) return; // Avoid double request
    const body: {
      eventId?: string;
      geoJSON?: GeoJSON.GeoJSON;
      eventFeed?: string;
      appId?: string;
    } = params.focusedGeometry
      ? {
          geoJSON: params.focusedGeometry.geometry,
        }
      : {};

    if (params.focusedGeometry?.source.type === 'event') {
      body.eventId = params?.focusedGeometry.source.meta.eventId;
      if (params?.eventFeed) {
        body.eventFeed = params?.eventFeed.id;
      }
    }

    if (params.appId) {
      body.appId = params.appId;
    }

    let responseData: LayerInArea[] | null;
    try {
      responseData = await apiClient.post<LayerInArea[]>('/layers/search/', body, true, {
        errorsConfig: { messages: LAYERS_IN_AREA_API_ERROR },
      });
    } catch (e: unknown) {
      throw new Error('Error while fetching area layers data');
    }

    if (responseData === null) return [];

    /* Performance optimization - editable layers updated in create_layer feature */
    if (params.createLayerFeatureActivated) {
      return responseData.filter((l) => l.group !== EDITABLE_LAYERS_GROUP);
    }

    return responseData;
  },
  'areaLayersListResource',
  areaLayersListDependencyAtom,
);
