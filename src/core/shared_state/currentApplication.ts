import { createPrimitiveAtom } from '~utils/atoms/createPrimitives';

export const currentApplicationAtom = createPrimitiveAtom<null | string>(
  '',
  null,
  '[Shared state] currentApplicationAtom',
);
