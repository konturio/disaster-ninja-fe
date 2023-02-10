import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { SENSOR_PRESICION } from './constants';
import type { SensorDataAtomExportType } from './atoms/sensorData';
import type { TriggerRequestActionType } from './atoms/sensorResource';

export function hookSensors(
  sensorDataAtom: SensorDataAtomExportType,
  stopRecording: () => void,
  accelerometer: Accelerometer,
  orientationSensor: AbsoluteOrientationSensor,
  gyroscope: Gyroscope,
) {
  // Describe accelerometer
  accelerometer.onreading = () => {
    sensorDataAtom.updateSensor.dispatch('accelerometer', {
      x: lowerTheNumber(accelerometer.x),
      y: lowerTheNumber(accelerometer.y),
      z: lowerTheNumber(accelerometer.z),
      timestamp: accelerometer.timestamp,
    });
  };
  accelerometer.onerror = getOnErrorFunction(stopRecording, 'accelerometer');

  // Describe orientationSensor
  orientationSensor.onreading = () => {
    const quaternion = orientationSensor.quaternion || [];
    sensorDataAtom.updateSensor.dispatch('orientation', {
      x: lowerTheNumber(quaternion[0]),
      y: lowerTheNumber(quaternion[1]),
      z: lowerTheNumber(quaternion[2]),
      w: lowerTheNumber(quaternion[3]),
      timestamp: orientationSensor.timestamp,
    });
  };
  orientationSensor.onerror = getOnErrorFunction(stopRecording, 'orientation');

  // Describe gyroscope
  gyroscope.onreading = () => {
    sensorDataAtom.updateSensor.dispatch('gyroscope', {
      x: lowerTheNumber(gyroscope.x),
      y: lowerTheNumber(gyroscope.y),
      z: lowerTheNumber(gyroscope.z),
      timestamp: gyroscope.timestamp,
    });
  };
  gyroscope.onerror = getOnErrorFunction(undefined, 'gyroscope');
}

export function hookGeolocation(
  sensorDataAtom: SensorDataAtomExportType,
  stopRecording: () => void,
  geolocation: Geolocation,
  requestAction: TriggerRequestActionType,
) {
  // It calls prompt window to allow sharing location for the first time
  const watchId = geolocation.watchPosition((pos) => {
    // This function runs each second after user allowed sharing navigation
    // Run updating sensor first
    sensorDataAtom.updateSensor.dispatch('coordinates', {
      lng: pos.coords.longitude,
      lat: pos.coords.longitude,
      alt: pos.coords.altitude,
      accuracy: pos.coords.accuracy,
      speed: pos.coords.speed,
      heading: pos.coords.heading,
      timestamp: pos.timestamp,
    });
    // Then run request and following reset
    requestAction.dispatch();
  }, getOnErrorFunction(stopRecording, 'geolocation'));
  return watchId;
}

function getOnErrorFunction(stopRecording?: () => void, sensorName?: string) {
  return function onError(event: SensorErrorEvent | GeolocationPositionError) {
    const eventName = 'code' in event ? event.code + event.message : event.error.name;
    const eventMessage = 'message' in event ? event.message : event.error.message;
    notificationServiceInstance.warning({
      title: eventName || `Can't connect to sensor ${sensorName}`,
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
