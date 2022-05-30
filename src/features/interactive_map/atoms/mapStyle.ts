import { MapBoxStyle } from '~components/ConnectedMap/map-libre-adapter';
import { createAtom } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/shared_state';

export const mapStyleAtom = createAtom(
  {
    focusedGeometryAtom,
  },
  ({}, state: MapBoxStyle = { version: 8 }) => {
    return state;
  },
  'mapStyleAtom',
);
