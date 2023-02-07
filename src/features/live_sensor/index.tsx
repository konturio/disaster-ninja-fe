import { Car24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { toolbarControlsAtom } from '~core/shared_state';
import { controlGroup, controlVisualGroup } from '~core/shared_state/toolbarControls';
import { createStringAtom } from '~utils/atoms/createPrimitives';
import { sensorDataAtom } from './atoms/sensorData';
import { resourceTriggerAtom } from './atoms/sensorResource';
import {
  REQUESTS_INTERVAL,
  SENSOR_CONTROL,
  SENSOR_CONTROL_NAME,
  UPDATES_PER_MINUTE,
} from './constants';

export function initSensor() {
  const accelerometer = new Accelerometer({ frequency: UPDATES_PER_MINUTE });
  const orientationSensor = new AbsoluteOrientationSensor({
    frequency: UPDATES_PER_MINUTE,
  });
  const geolocation = navigator.geolocation;

  let interval: NodeJS.Timer;
  let watchId: number;

  function stopRecording() {
    clearInterval(interval);
    resourceTriggerAtom.set.dispatch(0);
    accelerometer.stop();
    orientationSensor.stop();
    geolocation.clearWatch(watchId);
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

  // @ts-ignore
  window.TEST_SENSOR = accelerometer;

  toolbarControlsAtom.addControl.dispatch({
    id: SENSOR_CONTROL,
    name: SENSOR_CONTROL_NAME,
    title: 'Sensor',
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
      if (!isActive) {
        stopRecording();
        notificationServiceInstance.info({
          title: 'Recording has been finished',
        });
        return;
      }

      interval = setInterval(() => {
        resourceTriggerAtom.increment.dispatch();
      }, REQUESTS_INTERVAL);

      // Describe accelerometer
      // accelerometer.onactivate = ?
      accelerometer.onreading = () => {
        sensorDataAtom.updateSensor('accelerometer', {
          x: accelerometer.x,
          y: accelerometer.y,
          z: accelerometer.z,
        });
      };
      accelerometer.onerror = onError;

      // Describe orientationSensor
      orientationSensor.onreading = () => {
        const quaternion = orientationSensor.quaternion || [];
        sensorDataAtom.updateSensor('orientation', {
          x: quaternion[0],
          y: quaternion[1],
          z: quaternion[2],
        });
        sensorDataAtomDebug.set.dispatch(
          `quaternion is ${quaternion.toString()},acc y z is: ${accelerometer.y}, ${
            accelerometer.z
          }`,
        );
      };
      orientationSensor.onerror = onError;

      // Describe geolocation
      watchId = geolocation.watchPosition((pos) => {
        sensorDataAtom.updateSensor('accelerometer', {
          x: accelerometer.x,
          y: accelerometer.y,
          z: accelerometer.z,
        });
      }, onError);
      // start sensors
      accelerometer.start();
      orientationSensor.start();

      notificationServiceInstance.info({
        title: 'Recording has been started',
      });
    },
  });
}

const sensorDataAtomDebug = createStringAtom('no data');

export function DemoSensorCoords() {
  const [data] = useAtom(sensorDataAtomDebug);
  return (
    <div style={{ zIndex: 2 }}>
      <h4>Sensor data: {data}</h4>
    </div>
  );
}
