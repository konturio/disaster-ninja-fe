import { atom, action } from '@reatom/core';
import { getLocations } from '~core/api/locations';
import type { LocationProperties } from '~core/api/locations';
import type { Feature, Geometry } from 'geojson';
import type { SelectableItem } from '~features/search_locations/types';

const initialState = {
  isLoading: false,
  locations: [],
  error: false,
  noResults: false,
};

export const isLoadingAtom = atom(initialState.isLoading);
export const locationsAtom = atom<Feature<Geometry, LocationProperties>[]>(
  initialState.locations,
);
export const selectableLocationsAtom = atom<SelectableItem[]>((ctx) => {
  const locations = ctx.spy(locationsAtom);
  return locations.map((location) => ({
    title: location.properties.display_name,
    value: location.properties.osm_id,
  }));
});
export const errorAtom = atom(initialState.error);
export const noResultsAtom = atom(initialState.noResults);

// Actions
export const setSearchState = action((ctx, newState) => {
  isLoadingAtom(ctx, newState.isLoading ?? ctx.get(isLoadingAtom));
  locationsAtom(ctx, newState.locations ?? ctx.get(locationsAtom));
  errorAtom(ctx, newState.error ?? ctx.get(errorAtom));
  noResultsAtom(ctx, newState.noResults ?? ctx.get(noResultsAtom));
});

export const searchLocations = action(async (ctx, query) => {
  setSearchState(ctx, { isLoading: true, noResults: false, error: false });

  try {
    const response = await getLocations(query);
    const items = response?.locations.features || [];
    if (items.length === 0) {
      setSearchState(ctx, { noResults: true });
    } else {
      setSearchState(ctx, { locations: items });
    }
  } catch (e) {
    setSearchState(ctx, { error: true });
  } finally {
    setSearchState(ctx, { isLoading: false });
  }
});
