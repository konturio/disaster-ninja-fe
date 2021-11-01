import { sideControlsBarAtom } from '~core/shared_state';
import { logicalLayersRegistryAtom } from '~core/shared_state/logicalLayersRegistry';
import { BoundarySelectorIcon } from './components/BoundarySelectorIcon';
import { boundaryLogicalLayerAtom } from './atoms/boundaryLogicalLayer';

export function initBoundarySelector() {
  logicalLayersRegistryAtom.registerLayer.dispatch(boundaryLogicalLayerAtom);

  sideControlsBarAtom.addControl.dispatch({
    id: 'BoundarySelector',
    name: 'Boundary Selector',
    active: false,
    group: 'tools',
    icon: <BoundarySelectorIcon />,
    onClick: (becomesActive) => {
      sideControlsBarAtom.toggleActiveState.dispatch('BoundarySelector');
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
