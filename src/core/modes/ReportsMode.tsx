import { BookOpen24 } from '@konturio/default-icons';
import { currentModeAtom } from './currentMode';
import type { ModesControlsAtom } from './modesControls';

export function registerReportsMode(modesControlAtom: ModesControlsAtom) {
  modesControlAtom.addControl.dispatch({
    id: 'reports',
    active: false,
    icon: <BookOpen24 />,
    onClick() {
      currentModeAtom.setCurrentMode.dispatch('reports');
    },
    onChange(isActive) {
      // noop
    },
  });
}
