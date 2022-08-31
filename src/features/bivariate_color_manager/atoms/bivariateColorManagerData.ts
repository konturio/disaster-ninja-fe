import { createAtom } from '~utils/atoms';
import { arraysAreEqualWithStrictOrder } from '~utils/array/arraysAreEqual';
import { bivariateColorManagerResourceAtom } from './bivariateColorManagerResource';
import type {
  BivariateColorManagerData,
  BivariateColorManagerDataValue,
  TableDataValue,
} from './bivariateColorManagerResource';
import type { Indicator, Meta } from '~utils/bivariate';
import type { CornerRange } from '~utils/bivariate';

export type BivariateColorManagerDataAtomState = {
  filteredData: BivariateColorManagerData | null;
  _initialData: BivariateColorManagerData | null;
  indicators: Indicator[] | null;
  layersSelection: LayerSelectionInput | null;
  filters: Filters;
  selectedRows: {
    [key: string]: boolean;
  };
  meta: Meta | null;
};

export type Filters = {
  layers?: string;
  sentiments?: string[][];
};

export type FiltersKeys = keyof Filters;
export type FiltersValues = Filters[FiltersKeys];

export type LayerSelectionInput = {
  key: string;
  vertical?: TableDataValue;
  horizontal?: TableDataValue;
};

export type BivariateColorManagerDataAtom = typeof bivariateColorManagerDataAtom;

const DEFAULT_STATE = {
  _initialData: null,
  filteredData: null,
  indicators: null,
  filters: {},
  selectedRows: {},
  layersSelection: null,
  meta: null,
};

export const bivariateColorManagerDataAtom = createAtom(
  {
    setLayersSelection: (input: LayerSelectionInput) => input,
    runFilters: () => undefined,
    setLayersFilter: (input?: string) => input,
    setSentimentsFilter: (sentiments?: string[][]) => sentiments,
    setSelectedRows: (key: string) => key,
    bivariateColorManagerResourceAtom,
  },
  (
    { onAction, onChange, schedule, create },
    state: BivariateColorManagerDataAtomState = DEFAULT_STATE,
  ) => {
    onChange('bivariateColorManagerResourceAtom', (resource) => {
      if (!resource.data) return (state = DEFAULT_STATE);

      const { bivariateColorManagerData, indicators, meta } = resource.data;

      state = {
        ...DEFAULT_STATE,
        _initialData: bivariateColorManagerData,
        filteredData: bivariateColorManagerData,
        indicators: indicators,
        meta,
      };

      if (!state._initialData) {
        state = DEFAULT_STATE;
      }
    });

    onAction('setLayersFilter', (layers) => {
      state.filters = { ...state.filters, layers };
      schedule((dispatch) => {
        dispatch(create('runFilters'));
      });
    });

    onAction('setSentimentsFilter', (sentiments) => {
      state.filters = {
        ...state.filters,
        sentiments: sentiments?.length ? sentiments : undefined,
      };
      schedule((dispatch) => {
        dispatch(create('runFilters'));
      });
    });

    onAction('setSelectedRows', (key) => {
      state = {
        ...state,
        selectedRows: {
          ...state.selectedRows,
          [key]: !state.selectedRows[key],
        },
      };
    });

    onAction('runFilters', () => {
      const { filters, _initialData } = state;
      if (!filters) return;
      const filterFunctionsToApply = Object.entries(filters)
        .map(([key, value]) => (value ? [filterFunctions[key], value] : null))
        .filter(Boolean) as [FilterFunction, FiltersValues][];

      if (filterFunctionsToApply.length === 0 || !_initialData) {
        state = {
          ...state,
          filteredData: _initialData,

          // drop selected rows/sublist after filter cleared
          selectedRows: {},
          layersSelection: null,
        };
        return;
      }

      const nextFilteredData = Object.keys(_initialData).reduce((acc, key) => {
        const value = { ..._initialData[key] };

        // check if row passes all filter functions
        const filterPassed = filterFunctionsToApply.every(
          ([filterFunction, filterValue]) => filterFunction(key, value, filterValue),
        );

        if (filterPassed) {
          // do postprocessing for passed row here

          // if filter layer selected - stay only filtered layer in row's sublist
          if (filters.layers) {
            const isInVerticalSublist = Boolean(value.vertical[filters.layers]);
            const isInHorizontalSublist = Boolean(value.horizontal[filters.layers]);

            // if filtered item in both columns - don't filter
            if (!(isInHorizontalSublist && isInVerticalSublist)) {
              if (isInVerticalSublist)
                value.vertical = {
                  [filters.layers]: value.vertical[filters.layers],
                };
              if (isInHorizontalSublist)
                value.horizontal = {
                  [filters.layers]: value.horizontal[filters.layers],
                };
            }
          }

          acc[key] = value;
        }

        return acc;
      }, {});

      state = {
        ...state,
        filteredData: nextFilteredData,

        // drop selected rows/sublist after filter applied
        selectedRows: {},
        layersSelection: null,
      };
    });

    onAction('setLayersSelection', (input) => {
      const prevSelection = state.layersSelection;

      if (!prevSelection) {
        state = { ...state, layersSelection: input };
        return;
      }

      if (prevSelection.key !== input.key) {
        state = { ...state, layersSelection: input };
      } else {
        const nextSelection = { ...prevSelection, ...input };
        state = { ...state, layersSelection: nextSelection };
      }
    });

    return state;
  },
);

const layersFilterFunction: FilterFunction = (
  _key: string,
  value: BivariateColorManagerDataValue,
  indicator: FiltersValues,
): boolean => {
  if (typeof indicator !== 'string') return false;
  return Boolean(value.horizontal[indicator] || value.vertical[indicator]);
};

function mergeCorner(corner1: CornerRange[], corner2: CornerRange[]): CornerRange[] {
  return [...new Set([...corner1, ...corner2])];
}

const sentimentsFilterFunction: FilterFunction = (
  _key: string,
  { directions: { horizontal, vertical } }: BivariateColorManagerDataValue,
  sentiments: FiltersValues,
): boolean => {
  if (!sentiments || !Array.isArray(sentiments)) return false;

  const colorCombinations = [
    mergeCorner(vertical[0], horizontal[0]),
    mergeCorner(vertical[0], horizontal[1]),
    mergeCorner(vertical[1], horizontal[0]),
    mergeCorner(vertical[1], horizontal[1]),
  ];

  for (let i = 0; i < colorCombinations.length; i++) {
    for (let j = 0; j < sentiments.length; j++) {
      if (arraysAreEqualWithStrictOrder(colorCombinations[i], sentiments[j])) {
        return true;
      }
    }
  }

  return false;
};

type FilterFunction = (
  key: string,
  value: BivariateColorManagerDataValue,
  filterBody: FiltersValues,
) => boolean;

const filterFunctions: {
  [key in FiltersKeys]: FilterFunction;
} = {
  layers: layersFilterFunction,
  sentiments: sentimentsFilterFunction,
};
