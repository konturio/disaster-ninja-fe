import { registerMapMode } from './registrations/MapMode';
import { modesControlsAtom } from './modesControls';
import { registerReportsMode } from './registrations/registrations';
import { registerProfileMode } from './registrations/ProfileMode';

export function initModes() {
  registerProfileMode(modesControlsAtom);
  registerMapMode(modesControlsAtom);
  registerReportsMode(modesControlsAtom);
}
