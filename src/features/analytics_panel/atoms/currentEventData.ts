import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { createAtom } from '~utils/atoms';
import { getSourceMetaProperty } from '~core/focused_geometry/utils';
import type { Event } from '~core/types';

export const currentEventDataAtom = createAtom(
  {
    focusedGeometry: focusedGeometryAtom,
  },
  ({ get }, state: Event | null = null) => {
    const focusedGeometry = get('focusedGeometry');
    if (focusedGeometry) {
      return getSourceMetaProperty<Event>(focusedGeometry, 'event', 'meta') || null;
    }
    return null;
  },
  'currentEventDataAtom',
);
