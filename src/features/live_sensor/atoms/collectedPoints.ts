import { createAtom } from '~utils/atoms/createPrimitives';
import { sensorDataAtom } from './sensorData';
import type { FeatureCollection } from '~utils/geoJSON/helpers';

const defaultState = { type: 'FeatureCollection', features: [] };

export const collectedPointsAtom = createAtom(
  {
    addFeature: () => null,
    reset: () => null,
  },
  ({ onAction, getUnlistedState }, state: FeatureCollection = defaultState) => {
    const sensorData = getUnlistedState(sensorDataAtom);

    onAction('addFeature', () => {
      if (!sensorData) return state;
      const { coordinates, ...otherProps } = sensorData.data;
      if (!coordinates?.lng || !coordinates.lat) return state;

      const feature: GeoJSON.Feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat],
        },
        properties: otherProps,
      };

      state.features = [...state.features, feature];
    });

    onAction('reset', () => (state = defaultState));

    return state;
  },
  'collected live sensor points atom',
);
