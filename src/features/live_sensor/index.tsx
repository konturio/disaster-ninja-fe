import { Car24 } from '@konturio/default-icons';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { toolbarControlsAtom } from '~core/shared_state';
import { controlGroup, controlVisualGroup } from '~core/shared_state/toolbarControls';
import { i18n } from '~core/localization';
import { SENSOR_CONTROL, SENSOR_CONTROL_NAME } from './constants';
import { LiveSensor } from './new/main';

const liveSensor = new LiveSensor();

export function initSensor() {
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
      } else {
        toolbarControlsAtom.disable.dispatch(SENSOR_CONTROL);
      }
    },
    onChange(isActive) {
      if (isActive) {
        /* Activation */
        liveSensor
          .start()
          .then(() => {
            this.title = i18n.t('live_sensor.finish');
            notificationServiceInstance.info({
              title: i18n.t('live_sensor.startMessage'),
            });
          })
          .catch((e) => {
            console.error(e);
            notificationServiceInstance.error({
              title: i18n.t('live_sensor.noSensorsError'),
            });
            toolbarControlsAtom.disable.dispatch(SENSOR_CONTROL);
          });
      } else {
        /* Deactivation */
        this.title = i18n.t('live_sensor.start');
        liveSensor.stop();
        notificationServiceInstance.info({
          title: i18n.t('live_sensor.finishMessage'),
        });
      }
    },
  });
}
