import { MapBoxStyle } from '@k2-packages/map';
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
