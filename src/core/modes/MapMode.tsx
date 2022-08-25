import { Map16 } from '@konturio/default-icons';
import { currentModeAtom } from './currentMode';
import type { ModesControlsAtom } from './modesControls';

export function registerMapMode(modesControlAtom: ModesControlsAtom) {
  modesControlAtom.addControl.dispatch({
    id: 'Map',
    active: true,
    // todo add Map24
    icon: <Map16 />,
    onClick() {
      currentModeAtom.setCurrentMode.dispatch('Map');
    },
    onChange(isActive) {
      // noop
    },
  });
}
