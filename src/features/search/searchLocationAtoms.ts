import { atom, action } from '@reatom/core';
import {
  reatomAsync,
  withAbort,
  withDataAtom,
  withErrorAtom,
  withStatusesAtom,
} from '@reatom/async';
import { currentMapPositionAtom, FeatureFlag } from '~core/shared_state';
import { getLocations } from '~core/api/search';
import { fetchMCDAAsyncResource } from '~features/search/searchMcdaAtoms';
import { configRepo } from '~core/config';
import type { LocationProperties } from '~core/api/search';
import type { Feature, Geometry } from 'geojson';

export const fetchLocationsAsyncResource = reatomAsync(
  (ctx, query: string) => getLocations(query, ctx.controller),
  'fetchLocations',
).pipe(withDataAtom(null), withErrorAtom(), withStatusesAtom(), withAbort());

export const searchLocationsAtom = atom((ctx) => {
  const locationsResult = ctx.spy(fetchLocationsAsyncResource.dataAtom);
  const loading = ctx.spy(fetchLocationsAsyncResource.pendingAtom) > 0;
  const error = ctx.spy(fetchLocationsAsyncResource.errorAtom);
  const emptyResult =
    Array.isArray(locationsResult?.locations?.features) &&
    locationsResult?.locations.features.length === 0;

  const locations = locationsResult?.locations?.features.map((location) => ({
    title: location.properties.display_name,
    value: location.properties.osm_id,
  }));

  return { data: locations || [], loading, error: error?.message ?? null, emptyResult };
}, 'searchLocationsAtom');

export const locationsAtom = atom<Feature<Geometry, LocationProperties>[]>((ctx) => {
  const locationsResult = ctx.spy(fetchLocationsAsyncResource.dataAtom);
  return locationsResult?.locations?.features || [];
});

export const searchQueryAction = action(async (ctx, query) => {
  resetAction(ctx);
  fetchLocationsAsyncResource(ctx, query);
  if (configRepo.get().features[FeatureFlag.LLM_MCDA]) {
    fetchMCDAAsyncResource(ctx, query);
  }
});

export const resetAction = action((ctx) => {
  fetchLocationsAsyncResource.dataAtom.reset(ctx);
  fetchLocationsAsyncResource.errorAtom.reset(ctx);
  fetchLocationsAsyncResource.statusesAtom.reset(ctx);
});

export const itemSelectAction = action((ctx, index: number) => {
  const selectedLocation = ctx.get(locationsAtom)[index];
  const bbox = selectedLocation.properties.bbox;

  currentMapPositionAtom.setCurrentMapBbox.dispatch(bbox);
});
