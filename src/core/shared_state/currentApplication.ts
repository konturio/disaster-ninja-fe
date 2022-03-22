import { createPrimitiveAtom } from '~utils/atoms/createPrimitives';

export const currentApplicationAtom = createPrimitiveAtom<string | null>(null);
