import core from '~core/index';
import { createAtom } from '~core/store/atoms';
import type { Event } from '~core/types';

export const currentEventDataAtom = createAtom(
  {
    focusedGeometry: core.sharedState.focusedGeometryAtom,
  },
  ({ get }, state: Event | null = null) => {
    const focusedGeometry = get('focusedGeometry');
    if (focusedGeometry) {
      return (
        ('meta' in focusedGeometry.source && focusedGeometry.source?.meta) ||
        null
      );
    }
    return null;
  },
);
