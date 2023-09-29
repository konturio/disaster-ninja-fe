import {
  BOUNDARY_SELECTOR_CONTROL_ID,
  BOUNDARY_SELECTOR_CONTROL_NAME,
} from '~features/boundary_selector/constants';
import { i18n } from '~core/localization';
import { toolbar } from '~core/toolbar';
import type { Action } from '@reatom/core';

export const boundarySelectorControl = toolbar.setupControl<{
  boundaryRegistryAtom?: { start: () => Action; stop: () => Action };
}>({
  id: BOUNDARY_SELECTOR_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: BOUNDARY_SELECTOR_CONTROL_NAME,
    hint: i18n.t('boundary_selector.title'),
    icon: 'SelectArea24',
    preferredSize: 'small',
  },
});

export function initBoundarySelector() {
  boundarySelectorControl.init();
}
