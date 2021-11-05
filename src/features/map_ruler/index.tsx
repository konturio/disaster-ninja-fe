import {
  logicalLayersRegistryAtom,
  sideControlsBarAtom,
} from '~core/shared_state';
import MapRulerIcon from '@k2-packages/default-icons/tslib/icons/MapRulerIcon';
import {
  MAP_RULER_CONTROL_ID,
  MAP_RULER_CONTROL_NAME,
} from '~features/map_ruler/constants';
import { mapRulerLogicalLayerAtom } from '~features/map_ruler/atoms/mapRulerLogicalLayer';

export function initMapRuler() {
  logicalLayersRegistryAtom.registerLayer.dispatch(mapRulerLogicalLayerAtom);

  sideControlsBarAtom.addControl.dispatch({
    id: MAP_RULER_CONTROL_ID,
    name: MAP_RULER_CONTROL_NAME,
    active: false,
    group: 'tools',
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
