import { User24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { currentModeAtom } from '../currentMode';
import type { ModesControlsAtom } from '../modesControls';

export function registerAboutMode(modesControlAtom: ModesControlsAtom) {
  modesControlAtom.addControl.dispatch({
    id: 'about',
    title: i18n.t('modes.about'),
    active: false,
    icon: <User24 />,
    onClick() {
      currentModeAtom.setCurrentMode.dispatch('about');
    },
    onChange(isActive) {
      // noop
    },
  });
}
