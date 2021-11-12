import { focusedGeometryAtom } from '~core/shared_state';
import { createBindAtom } from '~utils/atoms';
import { Event } from '~appModule/types';

export const currentEventDataAtom = createBindAtom(
  {
    focusedGeometry: focusedGeometryAtom,
  },
  ({ get }, state: Event | null = null) => {
    const focusedGeometry = get('focusedGeometry');
    if (focusedGeometry) {
      return focusedGeometry.source?.meta ?? null;
    }
    return null;
  },
);
