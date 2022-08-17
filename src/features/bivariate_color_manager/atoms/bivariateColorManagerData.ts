import { createAtom } from '~utils/atoms';
import { bivariateColorManagerResourceAtom } from './bivariateColorManagerResource';
import type { TableDataValue } from './bivariateColorManagerResource';
import type { BivariateColorManagerData } from './bivariateColorManagerResource';
import type { Indicator, Meta } from '~utils/bivariate';
import type { SelectItemType } from '@konturio/ui-kit/tslib/Select/types';
import type { BivariateColorManagerDataValue } from './bivariateColorManagerResource';

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
  layers: string | number | null;
};

export type FiltersKeys = keyof Filters;
export type FiltersValues = Filters[keyof Filters];

export type LayerSelectionInput = {
  key: string;
  vertical?: TableDataValue;
  horizontal?: TableDataValue;
};

export type BivariateColorManagerDataAtom =
  typeof bivariateColorManagerDataAtom;

const DEFAULT_STATE = {
  _initialData: null,
  filteredData: null,
  indicators: null,
  filters: { layers: null },
  selectedRows: {},
  layersSelection: null,
  meta: null,
};

export const bivariateColorManagerDataAtom = createAtom(
  {
    setLayersSelection: (input: LayerSelectionInput) => input,
    runFilters: () => undefined,
    setLayersFilter: (input: SelectItemType | null) => input,
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

    onAction('setLayersFilter', (input) => {
      state.filters = { ...state.filters, layers: input?.value || null };
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
          ([filterFunction, filterValue]) =>
            filterFunction(key, value, filterValue),
        );

        if (filterPassed) {
          // do postprocessing for passed row here

          // if filter layer selected - stay only filtered layer in row's sublist
          if (filters.layers) {
            const isInVerticalSublist = Boolean(value.vertical[filters.layers]);
            const isInHorizontalSublist = Boolean(
              value.horizontal[filters.layers],
            );

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

type FilterFunction = (
  key: string,
  value: BivariateColorManagerDataValue,
  filterBody: FiltersValues,
) => boolean;

const filterFunctions: {
  [key in FiltersKeys]: FilterFunction;
} = {
  layers: layersFilterFunction,
};
