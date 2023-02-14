import { createAtom } from '~utils/atoms';
import { SENSOR_DATA_LIFETIME } from '../constants';
import type { UncertainNumber } from '../utils';

type Accelerometer = {
  accelX: UncertainNumber;
  accelY: UncertainNumber;
  accelZ: UncertainNumber;
  timestamp: number;
};
type Orientation = {
  orientX: UncertainNumber;
  orientY: UncertainNumber;
  orientZ: UncertainNumber;
  orientW: UncertainNumber;
  timestamp: number;
};
type Gyroscope = {
  gyroX: UncertainNumber;
  gyroY: UncertainNumber;
  gyroZ: UncertainNumber;
  timestamp: number;
};

// every value refers to updatedAt by it's index
// accelY[55] was set at updatedAt[55]
type SensorDataAtomType = {
  accelX?: UncertainNumber[];
  accelY?: UncertainNumber[];
  accelZ?: UncertainNumber[];

  orientX?: UncertainNumber[];
  orientY?: UncertainNumber[];
  orientZ?: UncertainNumber[];
  orientW?: UncertainNumber[];

  gyroX?: UncertainNumber[];
  gyroY?: UncertainNumber[];
  gyroZ?: UncertainNumber[];

  timestamp?: UncertainNumber[];
};

// this atom stores and updates sensor data
// we want to store data for last second because geolocation update happens every second
// since frequency can be different per device we need to rely on our own time indicator
export const sensorDataAtom = createAtom(
  {
    updateAccelerometer: (data: Accelerometer) => data,
    updateOrientation: (data: Orientation) => data,
    updateGyroscope: (data: Gyroscope) => data,
    resetAllData: () => null,
  },
  ({ onAction }, state: SensorDataAtomType | null = null) => {
    const newState = { ...state };

    onAction('updateAccelerometer', (data) => updateSensor(data));
    onAction('updateOrientation', (data) => updateSensor(data));
    onAction('updateGyroscope', (data) => updateSensor(data));
    onAction('resetAllData', () => (state = null));

    function updateSensor(data: Accelerometer | Orientation | Gyroscope) {
      const { timestamp } = newState;
      let indexToInsertAt = timestamp?.length || 0;
      // we store everything from this index and afterwards, cut it and paste it after insertion
      let indexOfNewerData = 0;
      const newerData = {};

      if (timestamp?.length) {
        // Find if older parts of array are older than SENSOR_DATA_LIFETIME
        let outdatedDataIndex: number | null = null;
        for (let i = 0; i < timestamp.length; i++) {
          const currentTime = timestamp[i] || 0;
          const incomingTime = data.timestamp;
          if (incomingTime - currentTime > SENSOR_DATA_LIFETIME) {
            outdatedDataIndex = i;
          } else break;
        }
        // and delete if so
        if (outdatedDataIndex)
          Object.entries(newState).forEach(([key, val]) => {
            outdatedDataIndex !== null &&
              (newState[key] = val.slice(outdatedDataIndex + 1));
          });

        // Find if incoming timestamp misses in between values or already exists
        for (let i = timestamp.length; i > -1; i--) {
          const currentTimestamp = timestamp[i] || 0;
          const previousTimestamp = timestamp[i - 1];
          if (data.timestamp > currentTimestamp) break;

          if (currentTimestamp === data.timestamp) {
            indexToInsertAt = i;
            break;
          }

          if (previousTimestamp && data.timestamp > previousTimestamp) {
            indexToInsertAt = i - 1;
            indexOfNewerData = i;
            break;
          }
        }
      }

      // cut off and store newer data if any
      if (indexOfNewerData) {
        Object.entries(newState).forEach(([key, val]) => {
          const olderValuesPerStateKey = [...val].splice(
            indexOfNewerData,
            (timestamp?.length || 0) - indexOfNewerData,
          );
          newerData[key] = olderValuesPerStateKey;
        });
      }

      insertDataMutable(newState, data, indexToInsertAt);

      // paste in newer data afterwards if it existed
      if (Object.keys(newerData).length) {
        Object.entries(newState).forEach(([key, val]) => {
          newState[key] = [...val, ...newerData[key]];
        });
      }

      state = newState;
    }

    return state;
  },
  'sensorDataAtom',
);

function insertDataMutable(
  state: SensorDataAtomType,
  data: Accelerometer | Orientation | Gyroscope,
  index: number,
) {
  Object.keys(data).forEach((key) => {
    if (!state[key]) state[key] = [];
    else state[key][index] = data[key];
  });
}

export type SensorDataAtomExportType = typeof sensorDataAtom;
