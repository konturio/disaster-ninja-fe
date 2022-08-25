import { Map24 } from '@konturio/default-icons';
import { currentModeAtom } from './currentMode';
import type { ModesControlsAtom } from './modesControls';

export function registerMapMode(modesControlAtom: ModesControlsAtom) {
  modesControlAtom.addControl.dispatch({
    id: 'map',
    active: true,
    icon: <Map24 />,
    onClick() {
      currentModeAtom.setCurrentMode.dispatch('map');
    },
    onChange(isActive) {
      // noop
    },
  });
}
