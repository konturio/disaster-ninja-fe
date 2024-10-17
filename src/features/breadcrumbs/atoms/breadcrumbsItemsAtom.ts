import { action, atom } from '@reatom/core';
import { currentMapPositionAtom } from '~core/shared_state';
import type { Bbox } from '~core/shared_state/currentMapPosition';

export const breadcrumbsItemsAtom = atom<GeoJSON.Feature[] | null>(
  null,
  'breadcrumbsAtom',
);

export const onBreadcrumbClick = action((ctx, value: string | number) => {
  const items = ctx.get(breadcrumbsItemsAtom);
  if (!items) return;
  const index = items.findIndex((item) => item.id === value);
}, 'onBreadcrumbClick');

export const onZoomToWholeWorld = action(() => {
  const bbox: Bbox = [-180, -80, 180, 80];
  currentMapPositionAtom.setCurrentMapBbox.dispatch(bbox);
}, 'onZoomToWholeWorld');
