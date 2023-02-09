import { SENSOR_PRESICION } from './constants';
import type { SensorDataAtomExportType } from './atoms/sensorData';
import type { NotificationService } from '~core/notifications';

export function getOnErrorFunction(
  notificationServiceInstance: NotificationService,
  stopRecording: () => void,
) {
  return function onError(event: SensorErrorEvent | GeolocationPositionError) {
    const eventName = 'code' in event ? event.code + event.message : event.error.name;
    const eventMessage = 'message' in event ? event.message : event.error.message;
    notificationServiceInstance.warning({
      title: eventName || "Can't connect to server",
      description: eventMessage,
    });
    stopRecording();
  };
}

export function hookSensors(
  sensorDataAtom: SensorDataAtomExportType,
  onError: (event: SensorErrorEvent | GeolocationPositionError) => void,
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
    });
  };
  accelerometer.onerror = onError;

  // Describe orientationSensor
  orientationSensor.onreading = () => {
    const quaternion = orientationSensor.quaternion || [];
    sensorDataAtom.updateSensor.dispatch('orientation', {
      x: lowerTheNumber(quaternion[0]),
      y: lowerTheNumber(quaternion[1]),
      z: lowerTheNumber(quaternion[2]),
      w: lowerTheNumber(quaternion[3]),
    });
  };
  orientationSensor.onerror = onError;

  // Describe gyroscope
  gyroscope.onreading = () => {
    sensorDataAtom.updateSensor.dispatch('gyroscope', {
      x: lowerTheNumber(gyroscope.x),
      y: lowerTheNumber(gyroscope.y),
      z: lowerTheNumber(gyroscope.z),
    });
  };
  gyroscope.onerror = onError;
}

export function hookGeolocation(
  sensorDataAtom: SensorDataAtomExportType,
  onError: (event: SensorErrorEvent | GeolocationPositionError) => void,
  geolocation: Geolocation,
) {
  // It calls prompt window to allow sharing location for the first time
  const watchId = geolocation.watchPosition((pos) => {
    // This function runs each second after user allowed sharing navigation
    sensorDataAtom.updateSensor.dispatch('coordinates', {
      lng: pos.coords.longitude,
      lat: pos.coords.longitude,
      alt: pos.coords.altitude,
      accuracy: pos.coords.accuracy,
      speed: pos.coords.speed,
      course: pos.coords.heading,
    });
  }, onError);
  return watchId;
}

export function lowerTheNumber(number: number | undefined) {
  if (!number) return null;
  return +number.toPrecision(SENSOR_PRESICION);
}
