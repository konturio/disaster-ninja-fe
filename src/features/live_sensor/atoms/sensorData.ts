import { createAtom } from '~utils/atoms';
import { SENSOR_DATA_LIFETIME } from '../constants';
import type { UncertainNumber } from '../utils';

type Accelerometer = {
  accelX: UncertainNumber;
  accelY: UncertainNumber;
  accelZ: UncertainNumber;
  accelTime: number;
};
type Orientation = {
  orientX: UncertainNumber;
  orientY: UncertainNumber;
  orientZ: UncertainNumber;
  orientW: UncertainNumber;
  orientTime: number;
};
type Gyroscope = {
  gyroX: UncertainNumber;
  gyroY: UncertainNumber;
  gyroZ: UncertainNumber;
  gyroTime: number;
};

// every value refers to timestamp by it's index
// accelY[55] was set at timestamp[55]
type SensorDataAtomType = {
  accelX?: UncertainNumber[];
  accelY?: UncertainNumber[];
  accelZ?: UncertainNumber[];
  accelTime?: UncertainNumber[];

  orientX?: UncertainNumber[];
  orientY?: UncertainNumber[];
  orientZ?: UncertainNumber[];
  orientW?: UncertainNumber[];
  orientTime?: UncertainNumber[];

  gyroX?: UncertainNumber[];
  gyroY?: UncertainNumber[];
  gyroZ?: UncertainNumber[];
  gyroTime?: UncertainNumber[];
};
type PayloadKey = keyof SensorDataAtomType;

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

    onAction('updateAccelerometer', (data) =>
      updateSensor(
        data,
        ['accelX', 'accelY', 'accelZ', 'accelTime'],
        newState.accelTime,
        data.accelTime,
      ),
    );
    onAction('updateOrientation', (data) =>
      updateSensor(
        data,
        ['orientX', 'orientY', 'orientZ', 'orientW', 'orientTime'],
        newState.orientTime,
        data.orientTime,
      ),
    );
    onAction('updateGyroscope', (data) =>
      updateSensor(
        data,
        ['gyroX', 'gyroY', 'gyroZ', 'gyroTime'],
        newState.gyroTime,
        data.gyroTime,
      ),
    );
    onAction('resetAllData', () => (state = null));

    function updateSensor(
      data: Accelerometer | Orientation | Gyroscope,
      sensorKeys: PayloadKey[],
      sensorTimes: UncertainNumber[] | undefined,
      incomingTime?: number,
    ) {
      if (!incomingTime) {
        console.error('no timestamp provided', data);
        return;
      }

      let outdatedDataIndex: number | null = null;

      if (sensorTimes?.length) {
        // Find if older parts of array are older than SENSOR_DATA_LIFETIME
        for (let i = 0; i < sensorTimes.length; i++) {
          const featuredTime = sensorTimes[i] || 0;
          if (incomingTime - featuredTime > SENSOR_DATA_LIFETIME) {
            outdatedDataIndex = i;
          } else break;
        }
      }

      // push data for each sensor key
      sensorKeys.forEach((sensorKey) => {
        let sensorData = newState[sensorKey];

        // delete old records for each sensors
        if (sensorData && outdatedDataIndex) {
          sensorData = sensorData.slice(outdatedDataIndex + 1);
        }
        if (sensorData) sensorData.push(data[sensorKey]);

        newState[sensorKey] = sensorData || [data[sensorKey]];
      });

      state = newState;
    }

    return state;
  },
  'sensorDataAtom',
);

export type SensorDataAtomExportType = typeof sensorDataAtom;
