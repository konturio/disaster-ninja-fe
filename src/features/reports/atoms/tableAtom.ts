import { createBindAtom } from '~utils/atoms/createBindAtom';
import { reportsClient } from '~core/index';
import { Report } from '~features/reports/atoms/reportsAtom';
import papa from 'papaparse';

export const limit = 100;

type TableState = {
  meta: Report | null;
  sortIndex: number;
  thead?: string[];
  data?: string[][];
  ascending: boolean | null;
  wholeData?: string[][];
  limit: number;
};

async function fetchTable(link: string) {
  const responseData = await reportsClient.get<string>(link, undefined, false);
  if (responseData === undefined) throw new Error('No data received');
  return responseData;
}

export const tableAtom = createBindAtom(
  {
    setReport: (report: Report) => report,
    sortBy: (sorter: string) => sorter,
    setState: (state: TableState) => state,
    addLimit: (cb: () => void) => cb,
    sort: () => {
      // noop
    },
  },
  (
    { onAction, schedule, create },
    state: TableState = { meta: null, sortIndex: 0, ascending: null, limit },
  ) => {
    onAction('setReport', async (report) => {
      if (state.meta?.id === report.id) return;

      schedule(async (dispatch) => {
        const csv = await fetchTable(report.link);
        const parsed = papa.parse<string[]>(csv, {
          delimiter: ';',
          fastMode: true,
        });

        dispatch(
          tableAtom.setState({
            meta: report,
            sortIndex: 0,
            thead: parsed.data[0],
            data: parsed.data.slice(0, state.limit),
            ascending: null,
            wholeData: parsed.data,
            limit,
          }),
        );
      });
    });

    onAction('sortBy', (sorter) => {
      if (!state.meta || state.meta.sortable === false || !state.wholeData)
        return;
      const newSortIndex = state.thead?.findIndex((val) => val === sorter);

      if (newSortIndex === undefined || newSortIndex < 0)
        throw 'error when sorting #1';

      const ascending = (function () {
        if (state.ascending === null) return true;
        if (state.ascending === true) return false;
        return null;
      })();

      state = { ...state, ascending, sortIndex: newSortIndex };
      schedule((dispatch) => {
        dispatch(create('sort'));
      });
    });

    // so we do the dispatch when async but we avoid dispatch when action is sync?!
    onAction('setState', (newState) => (state = newState));

    onAction('addLimit', (cb) => {
      state = { ...state, limit: state.limit + 50 };
      schedule((dispatch) => {
        dispatch(create('sort'));
        cb();
      });
    });

    onAction('sort', () => {
      const sorted = (function sort() {
        if (!state.wholeData) return;
        if (state.ascending === null) return state.wholeData;
        return [...state.wholeData].slice(1, state.limit).sort((a, b) => {
          let res: number;
          const numeric_a = Number(a[state.sortIndex]);
          const numeric_b = Number(b[state.sortIndex]);
          const isNumeric =
            !Number.isNaN(numeric_a) && !Number.isNaN(numeric_b);
          if (isNumeric && state.ascending) res = numeric_a - numeric_b;
          else if (isNumeric) res = numeric_b - numeric_a;
          else if (state.ascending)
            res = a[state.sortIndex]?.localeCompare(b[state.sortIndex]);
          else res = b[state.sortIndex]?.localeCompare(a[state.sortIndex]);

          return res;
        });
      })();
      if (!sorted) throw 'error when sorting #2';

      state = { ...state, data: sorted.slice(0, state.limit) };
    });

    return state;
  },
);
