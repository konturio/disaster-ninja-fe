import { createAtom } from '~utils/atoms';
import { createPrimitiveAtom } from '~utils/atoms/createPrimitives';

export const selectedIndexesAtom = createAtom(
  {
    setIndexes: (indexes: number[]) => indexes,
  },
  ({ onAction }, state: number[] = []) => {
    onAction('setIndexes', (indexes) => {
      state = indexes;
    });

    return state;
  },
  'selectedIndexesAtom',
);

export const setIndexesForCurrentGeometryAtom = createPrimitiveAtom(
  false,
  undefined,
  'setIndexesForCurrentGeometryAtom',
);
