import { BookOpen24 } from '@konturio/default-icons';
import { toolbarControlsAtom } from '~core/shared_state';
import { controlVisualGroup } from '~core/shared_state/toolbarControls';
import { i18n } from '~core/localization';
import { REPORTS_CONTROL_ID, REPORTS_CONTROL_NAME } from './constants';
import type { useHistory } from 'react-router';

export function initReportsIcon(history: ReturnType<typeof useHistory>) {
  toolbarControlsAtom.addControl.dispatch({
    id: REPORTS_CONTROL_ID,
    name: REPORTS_CONTROL_NAME,
    title: i18n.t('sidebar.reports'),
    active: false,
    visualGroup: controlVisualGroup.noAnalytics,
    icon: <BookOpen24 />,
    onClick: (becomesActive) => {
      toolbarControlsAtom.enable.dispatch(REPORTS_CONTROL_ID);
      history.push('./reports');
      toolbarControlsAtom.disable.dispatch(REPORTS_CONTROL_ID);
    },
  });
}
