import { sideControlsBarAtom } from '~core/shared_state';
import { REPORTS_CONTROL_ID, REPORTS_CONTROL_NAME } from './constants';
import { ReportsIcon } from './components/icon/ReportsIcon';
import { History } from 'history';
import { controlVisualGroup } from '~core/shared_state/sideControlsBar';
import { TranslationService as i18n } from '~core/localization';

export function initReportsIcon(history: History) {
  sideControlsBarAtom.addControl.dispatch({
    id: REPORTS_CONTROL_ID,
    name: REPORTS_CONTROL_NAME,
    title: i18n.t('Reports'),
    active: false,
    visualGroup: controlVisualGroup.noAnalytics,
    icon: ReportsIcon(),
    onClick: (becomesActive) => {
      sideControlsBarAtom.enable.dispatch(REPORTS_CONTROL_ID);
      history.push('./reports');
      sideControlsBarAtom.disable.dispatch(REPORTS_CONTROL_ID);
    },
  });
}
