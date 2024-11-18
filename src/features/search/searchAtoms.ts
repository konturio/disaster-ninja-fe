import { atom, action } from '@reatom/framework';
import {
  fetchLocationsAsyncResource,
  selectLocationItemAction,
  resetLocationSearchAction,
  searchLocationsAtom,
} from '~features/search/searchLocationAtoms';
import {
  fetchMCDAAsyncResource,
  MCDASuggestionAtom,
  resetMCDASearchAction,
  selectMCDAItemAction,
  isMCDASearchEnabled,
} from '~features/search/searchMcdaAtoms';
import type { LocationProperties } from '~core/api/search';
import type { Geometry } from 'geojson';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export const inputAtom = atom('', 'inputAtom');
export const isMenuOpenAtom = atom(false, 'isMenuOpenAtom');
export const highlightedIndexAtom = atom(-1, 'highlightedIndexAtom');

export type AggregatedSearchItem =
  | (MCDAConfig & { source: 'mcda' })
  | (GeoJSON.Feature<Geometry, LocationProperties> & { source: 'locations' });

export const aggregatedSearchAtom = atom((ctx) => {
  const locationsData = ctx.spy(fetchLocationsAsyncResource.dataAtom);
  const mcdaData = ctx.spy(fetchMCDAAsyncResource.dataAtom);

  const results: AggregatedSearchItem[] = [];
  if (mcdaData && mcdaData.config) {
    results.push({ ...mcdaData.config, source: 'mcda' as const });
  }

  if (locationsData && locationsData.locations?.features) {
    results.push(
      ...locationsData.locations.features.map((loc) => ({
        ...loc,
        source: 'locations' as const,
      })),
    );
  }

  return results;
}, 'aggregatedResultsAtom');

export const searchAction = action((ctx) => {
  const query = ctx.get(inputAtom);
  if (query.trim() === '') return;
  resetResourceAtomsAction(ctx);
  fetchLocationsAsyncResource(ctx, query);
  if (isMCDASearchEnabled) {
    fetchMCDAAsyncResource(ctx, query);
  }
  isMenuOpenAtom(ctx, false);
});

export const itemSelectAction = action((ctx, item: AggregatedSearchItem) => {
  if (item.source === 'locations') {
    selectLocationItemAction(ctx, item);
    inputAtom(ctx, item.properties.display_name);
  } else if (item.source === 'mcda') {
    selectMCDAItemAction(ctx);
  }
  isMenuOpenAtom(ctx, false);
});

export const resetSearchAction = action((ctx) => {
  inputAtom(ctx, '');
  isMenuOpenAtom(ctx, false);
  highlightedIndexAtom(ctx, -1);
  resetResourceAtomsAction(ctx);
});

export const resetResourceAtomsAction = action((ctx) => {
  resetLocationSearchAction(ctx);
  resetMCDASearchAction(ctx);
});

export const handleKeyDownAction = action(
  (ctx, event: React.KeyboardEvent<HTMLInputElement>) => {
    const results = ctx.get(aggregatedSearchAtom);
    const highlightedIndex = ctx.get(highlightedIndexAtom);

    if (ctx.get(isMenuOpenAtom) && results.length) {
      switch (event.key) {
        case 'ArrowDown':
          highlightedIndexAtom(ctx, (highlightedIndex + 1) % results.length);
          break;
        case 'ArrowUp':
          highlightedIndexAtom(
            ctx,
            (highlightedIndex - 1 + results.length) % results.length,
          );
          break;
        case 'Enter':
          if (highlightedIndex >= 0 && results[highlightedIndex]) {
            itemSelectAction(ctx, results[highlightedIndex]);
          } else {
            searchAction(ctx);
          }
          isMenuOpenAtom(ctx, false);
          break;
        default:
          break;
      }
    } else if (event.key === 'Enter') {
      searchAction(ctx);
    } else if (event.key === 'Escape') {
      isMenuOpenAtom(ctx, false);
    }
  },
);

// Show info block if no loading, no error, and no results in both data sources
export const showInfoBlockAtom = atom((ctx) => {
  const locationState = ctx.spy(searchLocationsAtom);
  const mcdaState = ctx.spy(MCDASuggestionAtom);

  const hasActiveData = locationState.data?.length > 0 || mcdaState.data;
  const hasPendingOrError =
    locationState.loading || locationState.error || mcdaState.loading || mcdaState.error;

  return !hasActiveData && !hasPendingOrError && !locationState.emptyResult;
}, 'showInfoBlockAtom');

searchLocationsAtom.onChange((ctx, state) => {
  if (state.emptyResult || state.error || state.data.length) {
    isMenuOpenAtom(ctx, true);
  }
});

if (isMCDASearchEnabled) {
  MCDASuggestionAtom.onChange((ctx, state) => {
    if (state.loading || state.error || state.data) {
      isMenuOpenAtom(ctx, true);
    }
  });
}
