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
} from './constants';
import { collectedPointsAtom } from './atoms/collectedPoints';
import { getOnErrorFunction, hookGeolocation, hookSensors } from './utils';
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

  const onError = getOnErrorFunction(notificationServiceInstance, stopRecording);

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

      hookSensors(sensorDataAtom, onError, accelerometer, orientationSensor, gyroscope);

      // start sensors
      accelerometer.start();
      orientationSensor.start();
      gyroscope.start();
      // start geolocation afterwards because it has preactivation prompt window
      watchId = hookGeolocation(sensorDataAtom, onError, geolocation);

      notificationServiceInstance.info({
        title: 'Recording has been started',
      });
    },
  });
}
