import { AppFeature } from '~core/auth/types';
import { registerBivariateColorManagerMode } from './registrations/bivariateColorManagerMode';
import { registerMapMode } from './registrations/mapMode';
import { modesControlsAtom } from './modesControls';
import { registerReportsMode } from './registrations/reportsMode';
import { registerAboutMode } from './registrations/aboutMode';
import { registerProfileMode } from './registrations/profileMode';
import type { UserDataModel } from '~core/auth';

export function initModes(userModel?: UserDataModel | null) {
  registerAboutMode(modesControlsAtom);
  registerMapMode(modesControlsAtom);
  if (userModel?.hasFeature(AppFeature.REPORTS)) {
    registerReportsMode(modesControlsAtom);
  }
  if (userModel?.hasFeature(AppFeature.BIVARIATE_COLOR_MANAGER)) {
    registerBivariateColorManagerMode(modesControlsAtom);
  }
  if (userModel?.hasFeature(AppFeature.APP_LOGIN)) {
    registerProfileMode(modesControlsAtom);
  }
}
