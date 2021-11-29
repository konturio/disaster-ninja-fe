import { sideControlsBarAtom } from '~core/shared_state';
import MapRulerIcon from '@k2-packages/default-icons/tslib/icons/MapRulerIcon';
import {
  MAP_RULER_CONTROL_ID,
  MAP_RULER_CONTROL_NAME,
} from '~features/map_ruler/constants';
import { mapRulerLogicalLayerAtom } from '~features/map_ruler/atoms/mapRulerLogicalLayer';
import { BOUNDARY_SELECTOR_CONTROL_ID } from '~features/boundary_selector/constants';

export function initMapRuler() {
  mapRulerLogicalLayerAtom.init.dispatch();

  sideControlsBarAtom.addControl.dispatch({
    id: MAP_RULER_CONTROL_ID,
    name: MAP_RULER_CONTROL_NAME,
    active: false,
    group: 'tools',
    icon: <MapRulerIcon />,
    onClick: (becomesActive) => {
      const exceptions = becomesActive ? [BOUNDARY_SELECTOR_CONTROL_ID] : null
      sideControlsBarAtom.toggleActiveState.dispatch(MAP_RULER_CONTROL_ID, exceptions);
    },
    onChange: (becomesActive) => {
      if (becomesActive) {
        mapRulerLogicalLayerAtom.mount.dispatch();
      } else {
        mapRulerLogicalLayerAtom.unmount.dispatch();
      }
    },
  });
}
