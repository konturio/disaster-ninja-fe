import { sideControlsBarAtom } from '~core/shared_state';
import MapRulerIcon from '@k2-packages/default-icons/tslib/icons/MapRulerIcon';
import {
  MAP_RULER_CONTROL_ID,
  MAP_RULER_CONTROL_NAME,
} from '~features/map_ruler/constants';
import { mapRulerLogicalLayerAtom } from '~features/map_ruler/atoms/mapRulerLogicalLayer';
import { controlGroup } from '~core/shared_state/sideControlsBar';

export function initMapRuler() {
  mapRulerLogicalLayerAtom.init.dispatch();

  sideControlsBarAtom.addControl.dispatch({
    id: MAP_RULER_CONTROL_ID,
    name: MAP_RULER_CONTROL_NAME,
    active: false,
    group: controlGroup.mapTools,
    icon: <MapRulerIcon />,
    onClick: (becomesActive) => {
      sideControlsBarAtom.toggleActiveState.dispatch(MAP_RULER_CONTROL_ID);
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
