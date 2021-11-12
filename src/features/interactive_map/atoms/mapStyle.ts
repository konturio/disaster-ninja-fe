import { MapBoxStyle } from '@k2-packages/map';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { focusedGeometryAtom } from '~core/shared_state';

export const mapStyleAtom = createBindAtom(
  {
    focusedGeometryAtom,
  },
  ({}, state: MapBoxStyle = { version: 8 }) => {
    return state;
  },
  'mapStyleAtom',
);
