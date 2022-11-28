import papa from 'papaparse';
import { createAtom } from '~utils/atoms';
import { reportResourceAtom } from './reportResource';

export const limit = 100;

type TableState = {
  sortIndex: number;
  thead?: string[];
  data?: string[][] | null;
  ascending: boolean | null;
  initialData?: string[][];
  isSorting?: boolean;
  _defaultSortedData?: string[][];
};

export const tableAtom = createAtom(
  {
    sortBy: (sorter: string) => sorter,
    setState: (state: TableState) => state,
    reportResourceAtom,
    sort: () => {
      // noop
    },
    search: (query: string, columnIndexes: number[]) => {
      return { query, columnIndexes };
    },
  },
  (
    { onAction, onChange, schedule, create },
    state: TableState = { sortIndex: 0, ascending: null },
  ) => {
    onChange('reportResourceAtom', (resource) => {
      if (!resource.data) {
        state = { sortIndex: 0, ascending: null, isSorting: false };
        return;
      }
      const csv = resource.data;

      schedule((dispatch) => {
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

        dispatch(create('setState', state));
      });
    });

    onAction('sortBy', (sorter) => {
      const newSortIndex = state.thead?.findIndex((val) => val === sorter);

      if (newSortIndex === undefined || newSortIndex < 0) throw 'error when sorting #1';

      const ascending = (function () {
        if (state.ascending === null) return true;
        if (state.ascending === true) return false;
        return null;
      })();

      state = { ...state, ascending, sortIndex: newSortIndex, isSorting: true };

      schedule((dispatch) => {
        setTimeout(() => {
          dispatch(create('sort'));
        }, 0);
      });
    });

    onAction('setState', (newState) => {
      state = newState;
    });

    onAction('sort', () => {
      const sorted = (function sortTable() {
        // ascending === null means we want to deactivate sorting
        if (state.ascending === null || !state.data?.length)
          return state._defaultSortedData!;

        // make copy of initial data to prevent mutating
        return [...state.data].sort((a, b) => {
          let res: number;
          const numeric_a = Number(a[state.sortIndex]);
          const numeric_b = Number(b[state.sortIndex]);
          const isNumeric = !Number.isNaN(numeric_a) && !Number.isNaN(numeric_b);

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

      if (!sorted) {
        state = { ...state, data: state.initialData, isSorting: false };
        throw 'error when sorting #2';
      }

      state = {
        ...state,
        data: sorted,
        isSorting: false,
        _defaultSortedData: state.data?.length ? state.data : state._defaultSortedData,
      };
    });

    onAction('search', ({ query, columnIndexes }) => {
      if (!query || !columnIndexes.length || !state.initialData)
        return (state = { ...state, data: state.initialData });

      const filtered = state.initialData.filter((row) => {
        for (let i = 0; i < columnIndexes.length; i++) {
          const index = columnIndexes[i];
          if (row[index].toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
            return true;
          }
        }
      });
      state = { ...state, data: filtered, isSorting: false };
    });

    return state;
  },
  'reports:tableAtom',
);
