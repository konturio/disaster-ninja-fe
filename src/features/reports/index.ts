import { sideControlsBarAtom } from '~core/shared_state';
import { REPORTS_CONROL_ID, REPORTS_CONROL_NAME } from './constants';
import { ReportsIcon } from './components/icon/ReportsIcon';
import { History } from 'history';

export function initReportsIcon(history: History) {
  sideControlsBarAtom.addControl.dispatch({
    id: REPORTS_CONROL_ID,
    name: REPORTS_CONROL_NAME,
    active: false,
    group: 'tools',
    icon: ReportsIcon(),
    onClick: (becomesActive) => {
      sideControlsBarAtom.toggleActiveState.dispatch(REPORTS_CONROL_ID);
      history.push('./reports');
    },
  });
}
