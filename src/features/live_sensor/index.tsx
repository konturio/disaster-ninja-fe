import { Car24 } from '@konturio/default-icons';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { toolbarControlsAtom } from '~core/shared_state';
import { controlGroup, controlVisualGroup } from '~core/shared_state/toolbarControls';
import { store } from '~core/store/store';
import { i18n } from '~core/localization';
import { sensorDataAtom } from './atoms/sensorData';
import {
  resourceTriggerAtom,
  sensorResourceAtom,
  triggerRequestAction,
} from './atoms/sensorResource';
import { SENSOR_CONTROL, SENSOR_CONTROL_NAME } from './constants';
import { collectedPointsAtom } from './atoms/collectedPoints';
import { hookGeolocation, hookSensors } from './utils';
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

  let interval: NodeJS.Timer;
  let watchId: number;

  function stopRecording() {
    store.dispatch([
      collectedPointsAtom.reset(),
      resourceTriggerAtom.set(0),
      sensorDataAtom.resetAllData(),
    ]);
    clearInterval(interval);
    accelerometer.stop();
    orientationSensor.stop();
    gyroscope.stop();
    geolocation.clearWatch(watchId);
    resourceUnsubscribe?.();
  }

  toolbarControlsAtom.addControl.dispatch({
    id: SENSOR_CONTROL,
    name: SENSOR_CONTROL_NAME,
    title: i18n.t('live_sensor.start'),
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
          title: i18n.t('live_sensor.noSensorsError'),
        });
      }
      if (featureInitializingFailed) return;

      if (!isActive) {
        this.title = i18n.t('live_sensor.start');
        stopRecording();
        notificationServiceInstance.info({
          title: i18n.t('live_sensor.finishMessage'),
        });
        return;
      }

      this.title = i18n.t('live_sensor.finish');
      resourceUnsubscribe = sensorResourceAtom.subscribe(() => {
        /*noop*/
      });

      hookSensors(
        sensorDataAtom,
        stopRecording,
        accelerometer,
        orientationSensor,
        gyroscope,
      );

      // start sensors
      accelerometer.start();
      orientationSensor.start();
      gyroscope.start();
      // start geolocation afterwards because it has preactivation prompt window
      watchId = hookGeolocation(
        collectedPointsAtom,
        stopRecording,
        geolocation,
        triggerRequestAction,
      );

      notificationServiceInstance.info({
        title: i18n.t('live_sensor.startMessage'),
      });
    },
  });
}