import {
  action,
  atom,
  concurrent,
  reatomResource,
  withDataAtom,
  withErrorAtom,
} from '@reatom/framework';
import { getBboxForGeometry } from '~utils/map/camera';
import {
  currentMapPositionAtom,
  setCurrentMapBbox,
  type Bbox,
} from '~core/shared_state/currentMapPosition';
import { getBoundaries } from '~core/api/boundaries';
import { isAbortError } from '~core/api_client/errors';
import { delay } from '~utils/common';
import { getCenterFromPosition } from './initSubscriptionToPositionChange';
import type { CtxSpy } from '@reatom/framework';

let abortController: AbortController | null = null;

const breadcrumbsItemsResource = reatomResource<GeoJSON.Feature[] | null>(
  concurrent(async (ctx) => {
    const position = (ctx as CtxSpy).spy(currentMapPositionAtom);
    if (position) {
      await delay(1000);
      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();

      try {
        const coords: [number, number] = getCenterFromPosition(position);
        const response = await getBoundaries(coords, abortController);

        if (!response) return null;
        return response.features;
      } catch (error) {
        if (!isAbortError(error)) {
          console.error('Error when trying to retrieve boundaries:', error);
        }
      }
    }
    return null;
  }),
  'breadcrumbsItemsResource',
).pipe(withDataAtom(null), withErrorAtom());

export const breadcrumbsItemsAtom = atom<GeoJSON.Feature[] | null>((ctx) => {
  return ctx.spy(breadcrumbsItemsResource.dataAtom);
}, 'breadcrumbsAtom');

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
