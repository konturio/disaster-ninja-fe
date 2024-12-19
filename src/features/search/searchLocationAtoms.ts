import {
  atom,
  action,
  reatomAsync,
  withAbort,
  withDataAtom,
  withErrorAtom,
  withStatusesAtom,
} from '@reatom/framework';
import { getLocations } from '~core/api/search';
import { setCurrentMapBbox } from '~core/shared_state/currentMapPosition';

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

  const locations = locationsResult?.locations?.features;

  return { data: locations || [], loading, error: error?.message ?? null, emptyResult };
}, 'searchLocationsAtom');

export const selectLocationItemAction = action((ctx, item) => {
  const bbox = item.properties.bbox;
  setCurrentMapBbox(ctx, bbox);
});

export const resetLocationSearchAction = action((ctx) => {
  fetchLocationsAsyncResource.abort(ctx);
  fetchLocationsAsyncResource.dataAtom.reset(ctx);
  fetchLocationsAsyncResource.errorAtom.reset(ctx);
  fetchLocationsAsyncResource.statusesAtom.reset(ctx);
});
