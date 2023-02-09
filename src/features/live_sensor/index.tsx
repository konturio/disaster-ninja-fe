import { Car24 } from '@konturio/default-icons';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { toolbarControlsAtom } from '~core/shared_state';
import { controlGroup, controlVisualGroup } from '~core/shared_state/toolbarControls';
import { store } from '~core/store/store';
import { sensorDataAtom } from './atoms/sensorData';
import { resourceTriggerAtom, sensorResourceAtom } from './atoms/sensorResource';
import {
  ADDING_POINTS_INTERVAL,
  REQUESTS_INTERVAL,
  SENSOR_CONTROL,
  SENSOR_CONTROL_NAME,
  SENSOR_PRESICION,
} from './constants';
import { collectedPointsAtom } from './atoms/collectedPoints';
import type { Unsubscribe } from '@reatom/core';

export function initSensor() {
  let accelerometer: Accelerometer;
  let orientationSensor: AbsoluteOrientationSensor;
  let geolocation: Geolocation;
  let gyroscope: Gyroscope;
  let featureInitializingFailed = false;
  let resourceUnsubscribe: Unsubscribe;

  try {
    accelerometer = new Accelerometer();
    orientationSensor = new AbsoluteOrientationSensor();
    gyroscope = new Gyroscope();
    geolocation = navigator.geolocation;
  } catch (e) {
    featureInitializingFailed = true;
  }

  let intervals: NodeJS.Timer[] = [];
  let watchId: number;

  function stopRecording() {
    collectedPointsAtom.reset.dispatch();
    resourceTriggerAtom.set.dispatch(0);
    sensorDataAtom.resetSensorData.dispatch();
    intervals.forEach((i) => clearInterval(i));
    intervals = [];
    accelerometer.stop();
    orientationSensor.stop();
    gyroscope.stop();
    geolocation.clearWatch(watchId);
    resourceUnsubscribe?.();
  }

  function onError(event: SensorErrorEvent | GeolocationPositionError) {
    const eventName = 'code' in event ? event.code + event.message : event.error.name;
    const eventMessage = 'message' in event ? event.message : event.error.message;
    notificationServiceInstance.warning({
      title: eventName || "Can't connect to server",
      description: eventMessage,
    });
    stopRecording();
  }

  toolbarControlsAtom.addControl.dispatch({
    id: SENSOR_CONTROL,
    name: SENSOR_CONTROL_NAME,
    title: 'Start sensor recording',
    active: false,
    visualGroup: controlVisualGroup.noAnalytics,
    exclusiveGroup: controlGroup.mapTools,
    icon: <Car24 />,
    onClick: (isActive) => {
      if (isActive) {
        toolbarControlsAtom.enable.dispatch(SENSOR_CONTROL);
      } else toolbarControlsAtom.disable.dispatch(SENSOR_CONTROL);
    },
    onChange(isActive) {
      if (featureInitializingFailed && isActive) {
        notificationServiceInstance.error({
          title: "Your device don't have needed sensors",
        });
      }
      if (featureInitializingFailed) return;

      if (!isActive) {
        this.title = 'Start sensor recording';
        stopRecording();
        notificationServiceInstance.info({
          title: 'Recording has been finished',
        });
        return;
      }

      this.title = 'Stop sensor recording';
      resourceUnsubscribe = sensorResourceAtom.subscribe(() => {
        /*noop*/
      });
      intervals.push(
        setInterval(() => {
          collectedPointsAtom.addFeature.dispatch();
        }, ADDING_POINTS_INTERVAL),

        setInterval(() => {
          store.dispatch([
            resourceTriggerAtom.increment.dispatch(),
            collectedPointsAtom.reset.dispatch(),
          ]);
        }, REQUESTS_INTERVAL),
      );

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
      orientationSensor.onerror = onError;

      // start sensors
      accelerometer.start();
      orientationSensor.start();
      gyroscope.start();
      // Describe geolocation (and call prompt window to share location)
      watchId = geolocation.watchPosition((pos) => {
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

      notificationServiceInstance.info({
        title: 'Recording has been started',
      });
    },
  });
}

function lowerTheNumber(number: number | undefined) {
  if (!number) return null;
  return +number.toPrecision(SENSOR_PRESICION);
}
