import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { toolbar } from '~core/toolbar';
import { i18n } from '~core/localization';
import { store } from '~core/store/store';
import { SENSOR_CONTROL, SENSOR_CONTROL_NAME } from './constants';
import { LiveSensor } from './LiveSensor';

export const liveSensorsControl = toolbar.setupControl({
  id: SENSOR_CONTROL,
  type: 'button',
  typeSettings: {
    name: SENSOR_CONTROL_NAME,
    hint: {
      regular: i18n.t('live_sensor.start'),
      active: i18n.t('live_sensor.finish'),
      disabled: i18n.t('live_sensor.start'),
    },
    icon: 'Car24',
    preferredSize: 'small',
  },
  onInit: () => {
    const liveSensor = new LiveSensor();
    return { liveSensor };
  },
  onStateChange: async (state, ctx) => {
    if (state === 'active') {
      try {
        await ctx.liveSensor.start();
        notificationServiceInstance.info({
          title: i18n.t('live_sensor.startMessage'),
        });
      } catch (error) {
        console.error(error);
        notificationServiceInstance.error({
          title: i18n.t('live_sensor.noSensorsError'),
        });
        store.dispatch(liveSensorsControl.setState('disabled'));
      }
    } else {
      ctx.liveSensor.stop();
      notificationServiceInstance.info({
        title: i18n.t('live_sensor.finishMessage'),
      });
    }
  },
  onRemove(ctx) {
    ctx.liveSensor.stop();
  },
});

export function initSensor() {
  liveSensorsControl.init();
}
