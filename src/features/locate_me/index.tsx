import { toolbar } from '~core/toolbar';
import { i18n } from '~core/localization';
import { LOCATE_ME_CONTROL_ID, LOCATE_ME_CONTROL_NAME } from './constants';
import { LocateMeButton } from './LocateMeButton';

export const locateMeControl = toolbar.setupControl({
  id: LOCATE_ME_CONTROL_ID,
  type: 'widget',
  typeSettings: {
    component: LocateMeButton,
  },
});

export function initLocateMe() {
  locateMeControl.init();
}
