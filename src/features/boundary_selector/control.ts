import {
  BOUNDARY_SELECTOR_CONTROL_ID,
  BOUNDARY_SELECTOR_CONTROL_NAME,
} from '~features/boundary_selector/constants';
import { toolbar } from '~core/toolbar';
import type { Action } from '@reatom/core-v2';

export const boundarySelectorToolbarControl = toolbar.setupControl<{
  boundaryRegistryAtom?: { start: () => Action; stop: () => Action };
}>({
  id: BOUNDARY_SELECTOR_CONTROL_ID,
  type: 'button',
  borrowMapInteractions: true,
  typeSettings: {
    name: BOUNDARY_SELECTOR_CONTROL_NAME,
    hint: BOUNDARY_SELECTOR_CONTROL_NAME,
    icon: 'SelectArea24',
    preferredSize: 'large',
  },
});
