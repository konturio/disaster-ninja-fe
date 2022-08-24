import { registerMapMode } from './MapMode';
import { modesControlsAtom } from './modesControls';
import { registerReportsMode } from './ReportsMode';

export function initModes() {
  registerMapMode(modesControlsAtom);
  registerReportsMode(modesControlsAtom);
}
