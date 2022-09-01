import { Prefs24 } from '@konturio/default-icons';
import { toolbarControlsAtom } from '~core/shared_state';
import { controlVisualGroup } from '~core/shared_state/toolbarControls';
import { i18n } from '~core/localization';
import {
  BIVARIATE_COLOR_MANAGER_CONTROL_ID,
  BIVARIATE_COLOR_MANAGER_CONTROL_NAME,
} from './constants';
import type { useHistory } from 'react-router';

export function initBivariateColorManagerIcon(history: ReturnType<typeof useHistory>) {
  toolbarControlsAtom.addControl.dispatch({
    id: BIVARIATE_COLOR_MANAGER_CONTROL_ID,
    name: BIVARIATE_COLOR_MANAGER_CONTROL_NAME,
    title: i18n.t('sidebar.biv_color_manager'),
    active: false,
    visualGroup: controlVisualGroup.noAnalytics,
    icon: <Prefs24 />,
    onClick: (_becomesActive) => {
      toolbarControlsAtom.enable.dispatch(BIVARIATE_COLOR_MANAGER_CONTROL_ID);
      history.push('./bivariate-manager');
      toolbarControlsAtom.disable.dispatch(BIVARIATE_COLOR_MANAGER_CONTROL_ID);
    },
  });
}
