import { createPrimitiveAtom } from '~utils/atoms/createPrimitives';

export const eventListFilters = createPrimitiveAtom<{
  bbox: [number, number, number] | null;
}>({
  bbox: null,
});
