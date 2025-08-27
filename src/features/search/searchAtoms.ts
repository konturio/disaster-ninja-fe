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
import { searchHighlightedGeometryAtom } from './atoms/highlightedGeometry';
import { EMPTY_HIGHLIGHT } from './constants';
import type { LocationProperties } from '~core/api/search';
import type { Geometry } from 'geojson';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export type AggregatedSearchItem =
  | (MCDAConfig & { source: 'mcda'; name: string })
  | (GeoJSON.Feature<Geometry, LocationProperties> & {
      source: 'locations';
      name: string;
    });

export const aggregatedSearchAtom = atom((ctx) => {
  const locationsData = ctx.spy(fetchLocationsAsyncResource.dataAtom);
  const mcdaData = ctx.spy(fetchMCDAAsyncResource.dataAtom);

  const results: AggregatedSearchItem[] = [];
  if (mcdaData && mcdaData.config) {
    results.push({
      ...mcdaData.config,
      source: 'mcda' as const,
      name: mcdaData.config.name,
    });
  }

  if (locationsData && locationsData.locations?.features) {
    results.push(
      ...locationsData.locations.features.map((loc) => ({
        ...loc,
        source: 'locations' as const,
        name: loc.properties.display_name,
      })),
    );
  }

  return results;
}, 'aggregatedResultsAtom');

export const searchAction = action((ctx, query) => {
  if (query.trim() === '') return;
  fetchLocationsAsyncResource(ctx, query);
  if (isMCDASearchEnabled) {
    fetchMCDAAsyncResource(ctx, query);
  }
});

export const itemSelectAction = action((ctx, item: AggregatedSearchItem) => {
  if (item.source === 'locations') {
    selectLocationItemAction(ctx, item);
  } else if (item.source === 'mcda') {
    selectMCDAItemAction(ctx);
  }
  searchHighlightedGeometryAtom(ctx, EMPTY_HIGHLIGHT);
});

export const resetSearchAction = action((ctx) => {
  resetLocationSearchAction(ctx);
  resetMCDASearchAction(ctx);
});

// Show info block if no loading, no error, and no results in both data sources
export const showInfoBlockAtom = atom((ctx) => {
  const locationState = ctx.spy(searchLocationsAtom);
  const mcdaState = ctx.spy(MCDASuggestionAtom);

  const hasActiveData =
    (locationState.data && locationState.data.length > 0) || mcdaState.data;
  const hasPendingOrError =
    locationState.loading || locationState.error || mcdaState.loading || mcdaState.error;
  const isEmptyLocations = locationState.data?.length === 0;

  return !hasActiveData && !hasPendingOrError && !isEmptyLocations;
}, 'showInfoBlockAtom');
