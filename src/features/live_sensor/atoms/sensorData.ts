import { createAtom } from '~utils/atoms';

type uncertainNumber = number | null;
type Accelerometer = { x: uncertainNumber; y: uncertainNumber; z: uncertainNumber };
type Orientation = {
  x: uncertainNumber;
  y: uncertainNumber;
  z: uncertainNumber;
  w: uncertainNumber;
};
type Gyroscope = { x: uncertainNumber; y: uncertainNumber; z: uncertainNumber };
type Coordinates = {
  lng: uncertainNumber;
  lat: uncertainNumber;
  alt: uncertainNumber;
  speed: uncertainNumber;
  accuracy: uncertainNumber;
  course: uncertainNumber;
};

export type SensorDataAtomType = {
  data: {
    accelerometer?: Accelerometer;
    orientation?: Orientation;
    coordinates?: Coordinates;
    gyroscope?: Gyroscope;
  };
  // new Date().getTime()
  timestamp?: number;
};

// this atom stores and updates sensor data
export const sensorDataAtom = createAtom(
  {
    updateSensor: <T extends keyof SensorDataAtomType['data']>(
      id: T,
      data: Exclude<SensorDataAtomType['data'][T], undefined>,
    ) => {
      return { id, data };
    },
    resetSensorData: () => null,
  },
  ({ onAction }, state: SensorDataAtomType | null = null) => {
    onAction('updateSensor', ({ id, data }) => {
      const newState = state ? { ...state } : { data: {} };
      // Todo - fight typescript.
      if (id === 'orientation') {
        newState.data.orientation = data as Orientation;
      } else if (id === 'gyroscope') {
        newState.data.gyroscope = data as Gyroscope;
      } else if (id === 'accelerometer') {
        newState.data.accelerometer = data as Accelerometer;
      } else if (id === 'coordinates') {
        newState.data.coordinates = data as Coordinates;
      }

      newState.timestamp = new Date().getTime();
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
