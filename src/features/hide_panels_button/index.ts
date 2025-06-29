import { toolbar } from '~core/toolbar';
import { i18n } from '~core/localization';
import { HIDE_PANELS_CONTROL_ID, HIDE_PANELS_CONTROL_NAME } from './constants';

export const hidePanelsControl = toolbar.setupControl({
  id: HIDE_PANELS_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: HIDE_PANELS_CONTROL_NAME,
    hint: HIDE_PANELS_CONTROL_NAME,
    icon: 'EyeOff16',
    preferredSize: 'tiny',
  },
});

hidePanelsControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    document.body.classList.add('panels-hidden');
  } else {
    document.body.classList.remove('panels-hidden');
  }
});

export function initHidePanelsControl() {
  hidePanelsControl.init();
}
