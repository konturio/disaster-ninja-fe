import { User24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { i18n } from '~core/localization';
import { userStateAtom } from '~core/auth/atoms/userState';
import { currentModeAtom } from '../currentMode';
import type { ModesControlsAtom } from '../modesControls';

export function registerProfileMode(modesControlAtom: ModesControlsAtom) {
  modesControlAtom.addControl.dispatch({
    id: 'profile',
    // @ts-expect-error - Fix me - allow react component
    title: <ATitle />,
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

function ATitle() {
  const [userState] = useAtom(userStateAtom);
  return userState === 'authorized'
    ? i18n.t('modes.profile')
    : i18n.t('login.login_button');
}
