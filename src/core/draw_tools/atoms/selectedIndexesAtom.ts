import { createAtom } from '~core/store/atoms';
import { createPrimitiveAtom } from '~core/store/atoms/createPrimitives';

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

export const setIndexesForCurrentGeometryAtom = createPrimitiveAtom(false);
