import { createAtom } from '~utils/atoms';

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
