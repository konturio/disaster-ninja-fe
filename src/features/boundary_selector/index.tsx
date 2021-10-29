import { sideControlsBarAtom } from '~core/shared_state';
import { BoundarySelectorIcon } from './components/BoundarySelectorIcon';
import { mapLogicalLayersAtom } from '~core/shared_state/mapLogicalLayersAtom';
import { BoundarySelectorLayer } from '~features/boundary_selector/layers/BoundarySelectorLayer';

export const BOUNDARY_SELECTOR_LAYER_ID = 'boundary-selector';

export function initBoundarySelector() {
  mapLogicalLayersAtom.addLayer.dispatch(
    new BoundarySelectorLayer(BOUNDARY_SELECTOR_LAYER_ID),
  );

  sideControlsBarAtom.addControl.dispatch({
    id: 'BoundarySelector',
    name: 'Boundary Selector',
    active: false,
    group: 'tools',
    icon: <BoundarySelectorIcon />,
    onClick: () => {
      sideControlsBarAtom.toggleActiveState.dispatch('BoundarySelector');
      mapLogicalLayersAtom.mountLayer.dispatch(BOUNDARY_SELECTOR_LAYER_ID);
    },
  });
}
