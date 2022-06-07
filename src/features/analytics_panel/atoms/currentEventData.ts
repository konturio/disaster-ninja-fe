import { focusedGeometryAtom } from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import type { Event } from '~core/types';

export const currentEventDataAtom = createAtom(
  {
    focusedGeometry: focusedGeometryAtom,
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
