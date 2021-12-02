import { sideControlsBarAtom } from '~core/shared_state';
import { REPORTS_CONROL_ID, REPORTS_CONROL_NAME } from './constants';
import { ReportsIcon } from './components/icon/ReportsIcon';
import { History } from 'history';
import { controlVisualGroup } from '~core/shared_state/sideControlsBar';

export function initReportsIcon(history: History) {
  sideControlsBarAtom.addControl.dispatch({
    id: REPORTS_CONROL_ID,
    name: REPORTS_CONROL_NAME,
    active: false,
    visualGroup: controlVisualGroup.noAnalitics,
    icon: ReportsIcon(),
    onClick: (becomesActive) => {
      sideControlsBarAtom.enable.dispatch(REPORTS_CONROL_ID);
      history.push('./reports');
      sideControlsBarAtom.disable.dispatch(REPORTS_CONROL_ID);
    },
  });
}
