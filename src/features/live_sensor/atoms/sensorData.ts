import { createAtom } from '~utils/atoms';

type uncertainNumber = number | null;
type Accelerometer = {
  x: uncertainNumber;
  y: uncertainNumber;
  z: uncertainNumber;
  timestamp: number;
};
type Orientation = {
  x: uncertainNumber;
  y: uncertainNumber;
  z: uncertainNumber;
  w: uncertainNumber;
  timestamp: number;
};
type Gyroscope = { x: uncertainNumber; y: uncertainNumber; z: uncertainNumber };
type Coordinates = {
  lng: uncertainNumber;
  lat: uncertainNumber;
  alt: uncertainNumber;
  speed: uncertainNumber;
  accuracy: uncertainNumber;
  heading: uncertainNumber;
  timestamp: number;
};

export type SensorDataAtomType = {
  accelerometer?: Accelerometer;
  orientation?: Orientation;
  coordinates?: Coordinates;
  gyroscope?: Gyroscope;
};

// this atom stores and updates sensor data
export const sensorDataAtom = createAtom(
  {
    updateSensor: <T extends keyof SensorDataAtomType>(
      id: T,
      data: Exclude<SensorDataAtomType[T], undefined>,
    ) => {
      return { id, data };
    },
    resetSensorData: () => null,
  },
  ({ onAction }, state: SensorDataAtomType | null = null) => {
    onAction('updateSensor', ({ id, data }) => {
      const newState = state ? { ...state } : {};
      // Todo - fight typescript.
      if (id === 'orientation') {
        newState.orientation = data as Orientation;
      } else if (id === 'gyroscope') {
        newState.gyroscope = data as Gyroscope;
      } else if (id === 'accelerometer') {
        newState.accelerometer = data as Accelerometer;
      } else if (id === 'coordinates') {
        newState.coordinates = data as Coordinates;
      }

      state = newState;
    });

    onAction('resetSensorData', () => {
      state = null;
    });

    return state;
  },
  'sensorDataAtom',
);

export type SensorDataAtomExportType = typeof sensorDataAtom;
