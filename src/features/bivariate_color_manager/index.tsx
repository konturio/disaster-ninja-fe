import { Prefs24 } from '@konturio/default-icons';
import { sideControlsBarAtom } from '~core/shared_state';
import { controlVisualGroup } from '~core/shared_state/sideControlsBar';
import { i18n } from '~core/localization';
import {
  BIVARIATE_COLOR_MANAGER_CONTROL_ID,
  BIVARIATE_COLOR_MANAGER_CONTROL_NAME,
} from './constants';
import type { History } from 'history';

export function initBivariateColorManagerIcon(history: History) {
  sideControlsBarAtom.addControl.dispatch({
    id: BIVARIATE_COLOR_MANAGER_CONTROL_ID,
    name: BIVARIATE_COLOR_MANAGER_CONTROL_NAME,
    title: i18n.t('sidebar.biv-color-manager'),
    active: false,
    visualGroup: controlVisualGroup.noAnalytics,
    icon: <Prefs24 />,
    onClick: (_becomesActive) => {
      sideControlsBarAtom.enable.dispatch(BIVARIATE_COLOR_MANAGER_CONTROL_ID);
      history.push('./bivariate-manager');
      sideControlsBarAtom.disable.dispatch(BIVARIATE_COLOR_MANAGER_CONTROL_ID);
    },
  });
}
