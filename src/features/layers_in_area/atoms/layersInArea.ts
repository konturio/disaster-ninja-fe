import { createResourceAtom, createBindAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { focusedGeometryAtom, currentEventAtom } from '~core/shared_state';
import { LayerInArea } from '../types';

/* Collect data for request */
const paramsAtom = createBindAtom(
  {
    focusedGeometryAtom,
    currentEventAtom,
  },
  ({ get }, state = { focusedGeometry: null, currentEvent: null }) => {
    const currentEvent = get('currentEventAtom');
    const focusedGeometry = get('focusedGeometryAtom');
    return { currentEvent, focusedGeometry };
  },
);

export const layersInAreaResourceAtom = createResourceAtom(
  paramsAtom,
  async (params) => {
    if (!params) return;
    const { currentEvent, focusedGeometry } = params;
    if (!currentEvent || !focusedGeometry) return;

    const body: { id?: string; geoJSON?: GeoJSON.GeoJSON } = {};
    if (currentEvent) body.id = currentEvent.id;
    if (focusedGeometry) body.geoJSON = focusedGeometry.geometry;

    const responseData = await apiClient.post<LayerInArea[]>(
      `/layers/`,
      body,
      false,
    );

    if (responseData === undefined) throw new Error('No data received');
    // Temporary we use graphql api for bivariate layers
    // Don't forget remove this after release!
    console.log('Bivariate layers was filtered!');
    return responseData.filter((layer) =>
      layer.legend ? layer.legend.type !== 'bivariate' : true,
    );
  },
  'layersInAreaResourceAtom',
);
