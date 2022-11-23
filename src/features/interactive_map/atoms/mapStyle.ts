import { createAtom } from '~core/store/atoms';
import { focusedGeometryAtom } from '~core/shared_state';
import type { MapBoxStyle } from '~components/ConnectedMap/map-libre-adapter';

export const mapStyleAtom = createAtom(
  {
    focusedGeometryAtom,
  },
  ({}, state: MapBoxStyle = { version: 8 }) => {
    return state;
  },
  'mapStyleAtom',
);
