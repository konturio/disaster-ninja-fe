import { registerMapMode } from './registrations/MapMode';
import { modesControlsAtom } from './modesControls';
import { registerReportsMode } from './registrations/registrations';
import { registerProfileMode } from './registrations/ProfileMode';
import { registerAboutMode } from './registrations/AboutMode';

export function initModes() {
  registerAboutMode(modesControlsAtom);
  registerProfileMode(modesControlsAtom);
  registerMapMode(modesControlsAtom);
  registerReportsMode(modesControlsAtom);
}
