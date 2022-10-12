import { Alarm24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { currentModeAtom } from '~core/modes/currentMode';
import type { ModesControlsAtom } from '~core/modes/modesControls';

export function registerReportsMode(modesControlAtom: ModesControlsAtom) {
  modesControlAtom.addControl.dispatch({
    id: 'reports',
    title: i18n.t('modes.reports'),
    active: false,
    icon: <Alarm24 />,
    onClick() {
      currentModeAtom.setCurrentMode.dispatch('reports');
    },
  });
}
