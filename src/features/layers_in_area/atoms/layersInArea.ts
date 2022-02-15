import { createResourceAtom, createAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { focusedGeometryAtom, currentEventAtom } from '~core/shared_state';
import { LayerInArea, LayersInAreaParams } from '../types';

/* Collect data for request */

export const paramsAtom = createAtom(
  {
    focusedGeometryAtom,
    currentEventAtom,
  },
  ({ get }, state: LayersInAreaParams = { focusedGeometry: null }) => {
    const focusedGeometry = get('focusedGeometryAtom');
    return { focusedGeometry };
  },
);

export const layersInAreaResourceAtom = createResourceAtom(
  async (params) => {
    if (!params) return;
    const { focusedGeometry } = params;
    if (!focusedGeometry) return;

    const body: { id?: string; geoJSON?: GeoJSON.GeoJSON } = {};
    if (focusedGeometry.source.type === 'event') {
      body.id = focusedGeometry.source.meta.eventId;
    }
    if (focusedGeometry) body.geoJSON = focusedGeometry.geometry;

    const responseData = await apiClient.post<LayerInArea[]>(
      `/layers/`,
      body,
      false,
    );
    if (responseData === undefined) throw new Error('No data received');
    return responseData;
  },
  paramsAtom,
  'layersInAreaResourceAtom',
);
