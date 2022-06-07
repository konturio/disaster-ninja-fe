import { createAtom } from '~utils/atoms';
import { reportsClient } from '~core/apiClientInstance';
import type { Report } from '~features/reports/atoms/reportsAtom';
import papa from 'papaparse';

export const limit = 100;

type TableState = {
  meta: Report | null;
  sortIndex: number;
  thead?: string[];
  data?: string[][];
  ascending: boolean | null;
  initialData?: string[][];
};

async function fetchTable(link: string) {
  const responseData = await reportsClient.get<string>(link, undefined, false);
  if (responseData === undefined) throw new Error('No data received');
  return responseData;
}

export const tableAtom = createAtom(
  {
    setReport: (report: Report) => report,
    sortBy: (sorter: string) => sorter,
    setState: (state: TableState) => state,
    sort: () => {
      // noop
    },
  },
  (
    { onAction, schedule, create },
    state: TableState = { meta: null, sortIndex: 0, ascending: null },
  ) => {
    onAction('setReport', async (report) => {
      if (state.meta?.id === report.id) return;

      schedule(async (dispatch) => {
        const csv = await fetchTable(report.link);
        const parsed = papa.parse<string[]>(csv, {
          delimiter: ';',
          fastMode: true,
          skipEmptyLines: true,
        });

        dispatch(
          tableAtom.setState({
            meta: report,
            sortIndex: 0,
            thead: parsed.data[0],
            data: parsed.data.slice(1),
            ascending: null,
            initialData: parsed.data.slice(1),
          }),
        );
      });
    });

    onAction('sortBy', (sorter) => {
      if (!state.meta || state.meta.sortable === false || !state.initialData)
        return;
      const newSortIndex = state.thead?.findIndex((val) => val === sorter);

      if (newSortIndex === undefined || newSortIndex < 0)
        throw 'error when sorting #1';

      const ascending = (function () {
        if (state.ascending === null) return true;
        if (state.ascending === true) return false;
        return null;
      })();

      state = { ...state, ascending, sortIndex: newSortIndex, data: [] };

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
        // ascneding === null means we can return initial data
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
