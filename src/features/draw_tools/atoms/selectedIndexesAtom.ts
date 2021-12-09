import { createBindAtom } from '~utils/atoms/createBindAtom';

export const selectedIndexesAtom = createBindAtom(
  {
    setIndexes: (indexes: number[]) => indexes,
  },
  ({ onAction }, state: number[] = []) => {
    onAction('setIndexes', (indexes) => {
      state = indexes

      console.log('%c⧭ setIndexes', 'color: #1d3f73', state);
    });

    return state;
  },
  'selectedIndexesAtom',
);
