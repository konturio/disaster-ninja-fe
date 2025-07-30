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
import {
  setCurrentMapBbox,
  focusOnGeometry,
} from '~core/shared_state/currentMapPosition';
import { focusedGeometryAtom } from '~core/focused_geometry/model';

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
  if (item.geometry) {
    focusedGeometryAtom.setFocusedGeometry.v3action(ctx, {
      source: { type: 'custom' },
      geometry: item,
    });
    focusOnGeometry(ctx, item);
  }
});

export const resetLocationSearchAction = action((ctx) => {
  fetchLocationsAsyncResource.abort(ctx);
  fetchLocationsAsyncResource.dataAtom.reset(ctx);
  fetchLocationsAsyncResource.errorAtom.reset(ctx);
  fetchLocationsAsyncResource.statusesAtom.reset(ctx);
});
