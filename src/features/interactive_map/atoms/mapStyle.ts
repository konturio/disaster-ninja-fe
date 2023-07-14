import { createAtom } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import type { StyleSpecification } from 'maplibre-gl';

export const mapStyleAtom = createAtom(
  {
    focusedGeometryAtom,
  },
  ({}, state: StyleSpecification = { version: 8, layers: [], sources: {} }) => {
    return state;
  },
  'mapStyleAtom',
);
