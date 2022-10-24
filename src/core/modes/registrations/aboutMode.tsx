import { Info24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { currentModeAtom } from '~core/modes/currentMode';
import type { ModesControlsAtom } from '~core/modes/modesControls';

export function registerAboutMode(modesControlAtom: ModesControlsAtom) {
  modesControlAtom.addControl.dispatch({
    id: 'about',
    title: i18n.t('modes.about'),
    active: false,
    icon: <Info24 />,
    onClick() {
      currentModeAtom.setCurrentMode.dispatch('about');
    },
    order: 10,
  });
}
