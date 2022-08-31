import { i18n } from '~core/localization';
import type { ApplicationMode } from './currentMode';

export const MODES_LABELS: Record<ApplicationMode, string> = {
  map: i18n.t('modes.map'),
  event: i18n.t('modes.event'),
  reports: i18n.t('modes.reports'),
  bivariateManager: i18n.t('bivariate.color_manager.title'),
};
