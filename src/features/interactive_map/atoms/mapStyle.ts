import { MapBoxStyle } from '@k2-packages/map';
import { createAtom } from '@reatom/core';
import { focusedGeometryAtom } from '~core/shared_state';

export const mapStyleAtom = createAtom(
  {
    focusedGeometryAtom,
  },
  ({}, state: MapBoxStyle = { version: 8 }) => {
    return state;
  },
);
