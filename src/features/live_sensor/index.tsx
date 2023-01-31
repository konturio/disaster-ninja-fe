import { Car24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { toolbarControlsAtom } from '~core/shared_state';
import { controlGroup, controlVisualGroup } from '~core/shared_state/toolbarControls';
import { createStringAtom } from '~utils/atoms/createPrimitives';

const SENSOR_CONTROL = 'sensorControl';

export function initSensor() {
  const sensor = new Accelerometer();
  let interval: NodeJS.Timer;
  // @ts-ignore
  window.TEST_SENSOR = sensor;

  toolbarControlsAtom.addControl.dispatch({
    id: SENSOR_CONTROL,
    name: 'Sensor demo feature',
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
        clearInterval(interval);
        return sensor.stop();
      }

      sensor.onreading = () => {
        interval = setInterval(() => {
          notificationServiceInstance.info(
            {
              title: `data xyz is ${sensor.x}, ${sensor.y}, ${sensor.z}`,
            },
            4000,
          );
        }, 5000);

        sensorDataAtom.set.dispatch(`data xyz is ${sensor.x}, ${sensor.y}, ${sensor.z}`);
      };

      sensor.onerror = (event) => {
        notificationServiceInstance.warning({
          title: event.error.name,
          description: event.error.message,
        });
        clearInterval(interval);
      };

      sensor.start();
    },
  });
}

const sensorDataAtom = createStringAtom('no data');

export function DemoSensorCoords() {
  const [data] = useAtom(sensorDataAtom);
  return (
    <div style={{ zIndex: 2 }}>
      <h4>Sensor data: {data}</h4>
    </div>
  );
}
