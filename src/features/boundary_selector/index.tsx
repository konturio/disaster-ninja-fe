import { sideControlsBarAtom } from '~core/shared_state';
import { boundaryLogicalLayerAtom } from './atoms/boundaryLogicalLayer';
import BoundarySelectorIcon from '@k2-packages/default-icons/tslib/icons/BoundarySelectorIcon';
import {
  BOUNDARY_SELECTOR_CONTROL_ID,
  BOUNDARY_SELECTOR_CONTROL_NAME,
} from '~features/boundary_selector/constants';
import { controlGroup, controlVisualGroup } from '~core/shared_state/sideControlsBar';

export function initBoundarySelector() {
  boundaryLogicalLayerAtom.init();
  sideControlsBarAtom.addControl.dispatch({
    id: BOUNDARY_SELECTOR_CONTROL_ID,
    name: BOUNDARY_SELECTOR_CONTROL_NAME,
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.withAnalitics,
    icon: <BoundarySelectorIcon />,
    onClick: (becomesActive) => {
      sideControlsBarAtom.toggleActiveState.dispatch(
        BOUNDARY_SELECTOR_CONTROL_ID
      );
    },
    onChange: (becomesActive) => {
      if (becomesActive) {
        boundaryLogicalLayerAtom.mount.dispatch();
      } else {
        boundaryLogicalLayerAtom.unmount.dispatch();
      }
    },
  });
}
