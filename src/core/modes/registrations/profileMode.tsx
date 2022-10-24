import { User24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { currentModeAtom } from '../currentMode';
import type { ModesControlsAtom } from '../modesControls';

export function registerProfileMode(modesControlAtom: ModesControlsAtom) {
  modesControlAtom.addControl.dispatch({
    id: 'profile',
    title: i18n.t('modes.profile'),
    active: false,
    icon: <User24 />,
    onClick() {
      currentModeAtom.setCurrentMode.dispatch('profile');
    },
    onChange(isActive) {
      // noop
    },
    order: 20,
  });
}
