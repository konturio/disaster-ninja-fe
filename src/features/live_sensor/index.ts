import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { toolbar } from '~core/toolbar';
import { i18n } from '~core/localization';
import { store } from '~core/store/store';
import { SENSOR_CONTROL_ID } from './constants';
import { LiveSensor } from './LiveSensor';

export const liveSensorsControl = toolbar.setupControl<{
  liveSensor?: LiveSensor;
}>({
  id: SENSOR_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: i18n.t('toolbar.record_sensors'),
    hint: i18n.t('toolbar.record_sensors'),
    icon: 'Car24',
    preferredSize: 'large',
  },
});

liveSensorsControl.onInit((ctx) => {
  const liveSensor = new LiveSensor();
  ctx.liveSensor = liveSensor;
});

liveSensorsControl.onStateChange(async (ctx, state) => {
  if (state === 'active') {
    try {
      await ctx.liveSensor?.start();
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
    ctx.liveSensor?.stop();
    notificationServiceInstance.info({
      title: i18n.t('live_sensor.finishMessage'),
    });
  }
});

liveSensorsControl.onRemove((ctx) => {
  ctx.liveSensor?.stop();
});

export function initSensor() {
  liveSensorsControl.init();
}
