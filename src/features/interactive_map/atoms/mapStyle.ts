import { createAtom } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
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
