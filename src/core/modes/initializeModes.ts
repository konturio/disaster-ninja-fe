import { AppFeature } from '~core/auth/types';
import { registerBivariateColorManagerMode } from './BivariateColorManagerMode';
import { registerMapMode } from './MapMode';
import { modesControlsAtom } from './modesControls';
import { registerReportsMode } from './ReportsMode';
import type { UserDataModel } from '~core/auth';

export function initModes(userModel?: UserDataModel | null) {
  registerMapMode(modesControlsAtom);
  registerReportsMode(modesControlsAtom);
  if (userModel?.hasFeature(AppFeature.BIVARIATE_COLOR_MANAGER)) {
    registerBivariateColorManagerMode(modesControlsAtom);
  }
}
