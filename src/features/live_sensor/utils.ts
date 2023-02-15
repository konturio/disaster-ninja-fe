import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { SENSOR_PRECISION } from './constants';
import type { SensorDataAtomExportType } from './atoms/sensorData';
import type { CollectedPointsAtomType } from './atoms/collectedPoints';
import type { TriggerRequestActionType } from './atoms/triggerResource';

export type UncertainNumber = number | null;

export function hookSensors(
  sensorDataAtom: SensorDataAtomExportType,
  stopRecording: () => void,
  accelerometer: Accelerometer,
  orientationSensor: AbsoluteOrientationSensor,
  gyroscope: Gyroscope,
) {
  // Describe accelerometer
  accelerometer.onreading = () => {
    sensorDataAtom.updateAccelerometer.dispatch({
      accelX: lowerTheNumber(accelerometer.x),
      accelY: lowerTheNumber(accelerometer.y),
      accelZ: lowerTheNumber(accelerometer.z),
      accelTime: accelerometer.timestamp || getTime(),
    });
  };
  accelerometer.onerror = getOnErrorFunction(stopRecording);

  // Describe orientationSensor
  orientationSensor.onreading = () => {
    const quaternion = orientationSensor.quaternion || [];
    sensorDataAtom.updateOrientation.dispatch({
      orientX: lowerTheNumber(quaternion[0]),
      orientY: lowerTheNumber(quaternion[1]),
      orientZ: lowerTheNumber(quaternion[2]),
      orientW: lowerTheNumber(quaternion[3]),
      orientTime: orientationSensor.timestamp || getTime(),
    });
  };
  orientationSensor.onerror = getOnErrorFunction(stopRecording);

  // Describe gyroscope
  gyroscope.onreading = () => {
    sensorDataAtom.updateGyroscope.dispatch({
      gyroX: lowerTheNumber(gyroscope.x),
      gyroY: lowerTheNumber(gyroscope.y),
      gyroZ: lowerTheNumber(gyroscope.z),
      gyroTime: gyroscope.timestamp || getTime(),
    });
  };
  gyroscope.onerror = getOnErrorFunction(undefined);
}

export function hookGeolocation(
  collectedPointsAtom: CollectedPointsAtomType,
  stopRecording: () => void,
  geolocation: Geolocation,
  requestAction: TriggerRequestActionType,
) {
  // It calls prompt window to allow sharing location for the first time
  const watchId = geolocation.watchPosition((pos) => {
    // This function runs each second or more after user allowed sharing navigation
    collectedPointsAtom.addFeature.dispatch({
      lng: pos.coords.longitude,
      lat: pos.coords.latitude,
      alt: pos.coords.altitude,
      altAccuracy: pos.coords.altitudeAccuracy,
      accuracy: pos.coords.accuracy,
      speed: pos.coords.speed,
      heading: pos.coords.heading,
      coordTimestamp: pos.timestamp,
      coordSystTimestamp: getTime(),
    });
    // Then run request and following reset
    requestAction.dispatch();
  }, getOnErrorFunction(stopRecording));
  return watchId;
}

function getOnErrorFunction(stopRecording?: () => void) {
  return function onError(event: SensorErrorEvent | GeolocationPositionError) {
    const eventName = 'code' in event ? event.code + event.message : event.error.name;
    const eventMessage = 'message' in event ? event.message : event.error.message;
    if (stopRecording) {
      // optional. Not needed for non crucial sensors like gyroscope
      notificationServiceInstance.warning({
        title: eventName,
        description: eventMessage,
      });
      stopRecording();
    } else {
      notificationServiceInstance.info({
        title: eventName,
        description: eventMessage,
      });
    }
  };
}

function lowerTheNumber(number: number | undefined) {
  if (number === undefined) return null;
  return +number.toPrecision(SENSOR_PRECISION);
}

export function getTime() {
  return new Date().getTime();
}
