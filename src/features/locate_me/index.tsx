import { toolbar } from '~core/toolbar';
import { LOCATE_ME_CONTROL_ID } from './constants';
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
