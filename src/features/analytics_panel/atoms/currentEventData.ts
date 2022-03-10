import { focusedGeometryAtom } from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import { Event } from '~core/types';

export const currentEventDataAtom = createAtom(
  {
    focusedGeometry: focusedGeometryAtom,
  },
  ({ get }, state: Event | null = null) => {
    const focusedGeometry = get('focusedGeometry');
    if (focusedGeometry) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TODO: fix me
      return focusedGeometry.source?.meta ?? null;
    }
    return null;
  },
);
