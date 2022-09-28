import { registerMapMode } from './MapMode';
import { modesControlsAtom } from './modesControls';
import { registerReportsMode } from './ReportsMode';
import { registerAboutMode } from './registrations/AboutMode';
export function initModes() {
  registerAboutMode(modesControlsAtom);
  registerMapMode(modesControlsAtom);
  registerReportsMode(modesControlsAtom);
}
