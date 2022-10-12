import { Prefs24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { currentModeAtom } from '~core/modes/currentMode';
import type { ModesControlsAtom } from '~core/modes/modesControls';

export function registerBivariateColorManagerMode(modesControlsAtom: ModesControlsAtom) {
  modesControlsAtom.addControl.dispatch({
    id: 'bivariateManager',
    title: i18n.t('sidebar.biv_color_manager'),
    active: false,
    icon: <Prefs24 />,
    onClick() {
      currentModeAtom.setCurrentMode.dispatch('bivariateManager');
    },
  });
}
