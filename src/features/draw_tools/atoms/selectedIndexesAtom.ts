import { createBindAtom } from '~utils/atoms/createBindAtom';

export const selectedIndexesAtom = createBindAtom(
  {
    setIndexes: (indexes: number[]) => indexes,
  },
  ({ onAction }, state: number[] = []) => {
    onAction('setIndexes', (indexes) => {
      state = indexes
    });

    return state;
  },
  'selectedIndexesAtom',
);
