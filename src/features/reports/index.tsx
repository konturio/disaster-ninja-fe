import { BookOpen24 } from '@konturio/default-icons';
import { sideControlsBarAtom } from '~core/shared_state';
import { controlVisualGroup } from '~core/shared_state/sideControlsBar';
import { i18n } from '~core/localization';
import { REPORTS_CONTROL_ID, REPORTS_CONTROL_NAME } from './constants';
import type { FeatureInterface } from '~utils/hooks/loadFeature';
import type { History } from 'history';

export const featureInterface: FeatureInterface = {
  initialize(reportReady, history: History) {
    sideControlsBarAtom.addControl.dispatch({
      id: REPORTS_CONTROL_ID,
      name: REPORTS_CONTROL_NAME,
      title: i18n.t('Reports'),
      active: false,
      visualGroup: controlVisualGroup.noAnalytics,
      icon: <BookOpen24 />,
      onClick: (becomesActive) => {
        sideControlsBarAtom.enable.dispatch(REPORTS_CONTROL_ID);
        history.push('./reports');
        sideControlsBarAtom.disable.dispatch(REPORTS_CONTROL_ID);
      },
    });

    reportReady();
  },
  affectsApplicationMap: false,
};
