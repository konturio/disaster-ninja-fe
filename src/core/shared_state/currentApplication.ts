import { createPrimitiveAtom } from '~utils/atoms/createPrimitives';

export const currentApplicationAtom = createPrimitiveAtom<null | string>(
  null,
  null,
  '[Shared state] currentApplicationAtom',
);
