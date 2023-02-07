import { createAtom } from '~utils/atoms';

export type SensorDataAtomType = {
  accelerometer?: { x: number; y: number; z: number };
  orientation?: { x: number; y: number; z: number };
  coordinates?: { lng: number; lat: number };
  // new Date().getTime()
  timestamp?: number;
};

type SensorKey = keyof SensorDataAtomType;
// type ValueOf<T> = T[keyof T];
// type SensorData = ValueOf< SensorDataAtomType>

// declare function updateSensorOverload (id: 'accelerometer', data: { x: number, y: number, z: number }): void
// declare function updateSensorOverload (id: 'coordinates', data: { lng: number, lat: number }): {id: 'coordinates', data: { lng: number, lat: number }}

// this atom stores and updates sensor data
export const sensorDataAtom = createAtom(
  {
    updateSensor: (id: SensorKey, data: any) => {
      return { id, data };
    },
    resetSensorData: () => null,
  },
  ({ onAction }, state: SensorDataAtomType | null = null) => {
    onAction('updateSensor', ({ id, data }) => {
      const newState = state ? { ...state } : {};
      newState[id] = data;
      newState.timestamp = new Date().getTime();
    });

    onAction('resetSensorData', () => {
      state = null;
      // show it's stopped
    });

    return state;
  },
  'mapStyleAtom',
);
