import { Map24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { currentModeAtom } from '../currentMode';
import type { ModesControlsAtom } from '../modesControls';

export function registerMapMode(modesControlAtom: ModesControlsAtom) {
  modesControlAtom.addControl.dispatch({
    id: 'map',
    title: i18n.t('modes.map'),
    active: false,
    icon: <Map24 />,
    onClick() {
      currentModeAtom.setCurrentMode.dispatch('map');
    },
    order: 30,
  });
}
