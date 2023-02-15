import { createAtom } from '~utils/atoms/createPrimitives';
import { sensorDataAtom } from './sensorData';
import { sensorResourceAtom } from './sensorResource';
import type { FeatureCollection } from '~utils/geoJSON/helpers';
import type { UncertainNumber } from '../utils';

const defaultState = { type: 'FeatureCollection', features: [] };

export type CoordinatesData = {
  lng: UncertainNumber;
  lat: UncertainNumber;
  alt: UncertainNumber;
  altAccuracy: UncertainNumber;
  speed: UncertainNumber;
  accuracy: UncertainNumber;
  heading: UncertainNumber;
  coordTimestamp: number;
  coordSystTimestamp: number;
};

// This atom responsible for collecting sensor data as geojson points entities
// We need that due to our process of building analytical geospatial layers
// It can either add a new feature formed from current sensor data or reset itself
export const collectedPointsAtom = createAtom(
  {
    addFeature: (data: CoordinatesData) => data,
    resetFeatures: () => null,
  },
  ({ onAction, getUnlistedState, schedule }, state: FeatureCollection = defaultState) => {
    const sensorData = getUnlistedState(sensorDataAtom);

    onAction('addFeature', (data) => {
      if (!sensorData) return state;
      const { lat, lng } = data;
      if (lng === null || lat === null) return state;

      const feature: GeoJSON.Feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          ...sensorData,
          ...data,
          userAgent: navigator.userAgent,
        },
      };

      state.features = [...state.features, feature];

      // Trigger request after each new feature was added
      // schedule((dispatch) => dispatch(resourceHandlingAtom.triggerRequest()));

      // Trigger request after each new feature was added
      schedule((dispatch) =>
        dispatch([
          sensorResourceAtom.request({ ...state }),
          sensorDataAtom.resetAllData(),
        ]),
      );
    });

    onAction('resetFeatures', () => {
      state = defaultState;
    });

    return state;
  },
  'collectedPointsAtom',
);

export type CollectedPointsAtomType = typeof collectedPointsAtom;
