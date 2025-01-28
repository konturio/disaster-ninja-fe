import {
  action,
  atom,
  reatomAsync,
  withAbort,
  withDataAtom,
  withErrorAtom,
  withStatusesAtom,
} from '@reatom/framework';
import { getLocations } from '~core/api/search';

export const fetchRefAreaAsyncResource = reatomAsync(
  (ctx, query: string) => getLocations(query, ctx.controller),
  'fetchLocations',
).pipe(withDataAtom(null), withErrorAtom(), withStatusesAtom(), withAbort());

export const searchAction = action((ctx, query) => {
  if (query.trim() === '') return;
  resetSearchRefAreaAtom(ctx);
  fetchRefAreaAsyncResource(ctx, query);
});

export const searchRefAreaAtom = atom((ctx) => {
  const response = ctx.spy(fetchRefAreaAsyncResource.dataAtom);
  const loading = ctx.spy(fetchRefAreaAsyncResource.pendingAtom) > 0;
  const error = ctx.spy(fetchRefAreaAsyncResource.errorAtom);

  const locations = response?.locations?.features?.map((item) => ({
    ...item,
    name: item.properties.display_name,
  }));
  return { data: locations ?? null, loading, error: error?.message ?? null };
}, 'searchLocationsAtom');

export const resetSearchRefAreaAtom = action((ctx) => {
  fetchRefAreaAsyncResource.abort(ctx);
  fetchRefAreaAsyncResource.dataAtom.reset(ctx);
  fetchRefAreaAsyncResource.errorAtom.reset(ctx);
  fetchRefAreaAsyncResource.statusesAtom.reset(ctx);
});
