import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { SENSOR_PRESICION } from './constants';
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
      timestamp: accelerometer.timestamp || getTime(),
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
      timestamp: orientationSensor.timestamp || getTime(),
    });
  };
  orientationSensor.onerror = getOnErrorFunction(stopRecording);

  // Describe gyroscope
  gyroscope.onreading = () => {
    sensorDataAtom.updateGyroscope.dispatch({
      gyroX: lowerTheNumber(gyroscope.x),
      gyroY: lowerTheNumber(gyroscope.y),
      gyroZ: lowerTheNumber(gyroscope.z),
      timestamp: gyroscope.timestamp || getTime(),
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
      lat: pos.coords.longitude,
      alt: pos.coords.altitude,
      accuracy: pos.coords.accuracy,
      speed: pos.coords.speed,
      heading: pos.coords.heading,
      coordTimestamp: pos.timestamp,
      coordSystTimestamp: new Date().getTime(),
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
    notificationServiceInstance.warning({
      title: eventName,
      description: eventMessage,
    });
    // optional. Not needed for non crucial sensors like gyroscope
    stopRecording?.();
  };
}

function lowerTheNumber(number: number | undefined) {
  if (!number) return null;
  return +number.toPrecision(SENSOR_PRESICION);
}

export function getTime() {
  return new Date().getTime();
}
