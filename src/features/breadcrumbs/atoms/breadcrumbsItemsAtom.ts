import { action, atom } from '@reatom/core';
import { getBboxForGeometry } from '~utils/map/camera';
import { setCurrentMapBbox, type Bbox } from '~core/shared_state/currentMapPosition';

export const breadcrumbsItemsAtom = atom<GeoJSON.Feature[] | null>(
  null,
  'breadcrumbsAtom',
);

export const onBreadcrumbClick = action((ctx, value: string | number) => {
  const items = ctx.get(breadcrumbsItemsAtom);
  if (!items) return;
  const item = items.find((item) => item.id === value);
  if (!item) {
    console.error(`Breadcrumb item with value ${value} not found.`);
    return;
  }

  const bbox = getBboxForGeometry(item.geometry);
  if (bbox) {
    setCurrentMapBbox(ctx, bbox);
  }
}, 'onBreadcrumbClick');

export const onZoomToWholeWorld = action((ctx) => {
  const bbox: Bbox = [-180, -80, 180, 80];
  setCurrentMapBbox(ctx, bbox);
}, 'onZoomToWholeWorld');
