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
  const response = ctx.spy(fetchLocationsAsyncResource.dataAtom);
  const loading = ctx.spy(fetchLocationsAsyncResource.pendingAtom) > 0;
  const error = ctx.spy(fetchLocationsAsyncResource.errorAtom);

  const locations = response?.locations?.features;

  return { data: locations ?? null, loading, error: error?.message ?? null };
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
