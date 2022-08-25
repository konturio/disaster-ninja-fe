import { i18n } from '~core/localization';
import type { ApplicationMode } from './currentMode';

export const MODES_LABELS: Record<ApplicationMode, string> = {
  // map: i18n.t('modes.Map'),
  // events: i18n.t('modes.Event'),
  // reports: i18n.t('modes.Reports')
  map: i18n.t('modes.map'),
  events: i18n.t('modes.event'),
  reports: i18n.t('modes.reports'),
};
