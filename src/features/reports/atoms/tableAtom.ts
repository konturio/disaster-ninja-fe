import papa from 'papaparse';
import { createAtom } from '~utils/atoms';
import { reportResourceAtom } from './reportResource';
import type { Report } from '~features/reports/atoms/reportsAtom';

export const limit = 100;

type TableState = {
  sortIndex: number;
  thead?: string[];
  data?: string[][] | null | 'sorting';
  ascending: boolean | null;
  initialData?: string[][];
};

export const tableAtom = createAtom(
  {
    sortBy: (sorter: string) => sorter,
    setState: (state: TableState) => state,
    reportResourceAtom,
    sort: () => {
      // noop
    },
  },
  (
    { onAction, onChange, schedule, create },
    state: TableState = { sortIndex: 0, ascending: null },
  ) => {
    onChange('reportResourceAtom', (resource) => {
      if (!resource.data) return (state = { sortIndex: 0, ascending: null });

      const csv = resource.data;
      const parsed = papa.parse<string[]>(csv, {
        delimiter: ';',
        fastMode: true,
        skipEmptyLines: true,
      });

      state = {
        sortIndex: 0,
        thead: parsed.data[0],
        data: parsed.data.slice(1),
        ascending: null,
        initialData: parsed.data.slice(1),
      };
      if (!state.data!.length) state.data = null;
    });

    onAction('sortBy', (sorter) => {
      const newSortIndex = state.thead?.findIndex((val) => val === sorter);

      if (newSortIndex === undefined || newSortIndex < 0)
        throw 'error when sorting #1';

      const ascending = (function () {
        if (state.ascending === null) return true;
        if (state.ascending === true) return false;
        return null;
      })();

      state = { ...state, ascending, sortIndex: newSortIndex, data: 'sorting' };

      schedule((dispatch) => {
        setTimeout(() => {
          dispatch(create('sort'));
        }, 0);
      });
    });

    onAction('setState', (newState) => (state = newState));

    onAction('sort', () => {
      const sorted = (function sortTable() {
        if (!state.initialData) return;
        // ascending === null means we can return initial data
        if (state.ascending === null) return state.initialData;

        // make copy of initial data to prevent mutating
        return [...state.initialData].sort((a, b) => {
          let res: number;
          const numeric_a = Number(a[state.sortIndex]);
          const numeric_b = Number(b[state.sortIndex]);
          const isNumeric =
            !Number.isNaN(numeric_a) && !Number.isNaN(numeric_b);

          // CASE - comparing numbers
          if (isNumeric && state.ascending) res = numeric_a - numeric_b;
          else if (isNumeric) res = numeric_b - numeric_a;
          // CASE - comparing strings
          else if (state.ascending)
            res = a[state.sortIndex]?.localeCompare(b[state.sortIndex]);
          else res = b[state.sortIndex]?.localeCompare(a[state.sortIndex]);
          return res;
        });
      })();

      if (!sorted) throw 'error when sorting #2';

      state = { ...state, data: sorted };
    });

    return state;
  },
);
