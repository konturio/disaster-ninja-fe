import { sideControlsBarAtom } from '~core/shared_state';
import { MapRulerIcon } from './components/MapRulerIcon';

export function initMapRuler() {
  sideControlsBarAtom.addControl.dispatch({
    id: 'MeasureDistanceMode',
    name: 'Measure distance',
    active: false,
    group: 'tools',
    icon: <MapRulerIcon />,
    onClick: () => {
      sideControlsBarAtom.toggleActiveState.dispatch('MeasureDistanceMode');
    },
  });
}
