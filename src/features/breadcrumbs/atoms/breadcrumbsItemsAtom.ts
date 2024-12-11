import { action, atom, reatomAsync, type Ctx } from '@reatom/framework';
import { debounce } from '@github/mini-throttle';
import { setCurrentMapBbox, type Bbox } from '~core/shared_state/currentMapPosition';
import { getBboxForGeometry } from '~utils/map/camera';
import { getBoundaries } from '~core/api/boundaries';
import { isAbortError } from '~core/api_client/errors';
import { getCenterFromPosition } from '../helpers/breadcrumbsHelpers';
import type { CurrentMapPositionAtomState } from '~core/shared_state/currentMapPosition';

const debouncedItemsFetch = debounce(
  async (
    ctx: Ctx,
    abortController: AbortController,
    position: CurrentMapPositionAtomState,
  ) => {
    if (position) {
      abortController.abort();
      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();

      try {
        const coords: [number, number] = getCenterFromPosition(position);
        const response = await getBoundaries(coords, abortController);

        if (response) {
          breadcrumbsItemsAtom(ctx, response.features);
        } else {
          breadcrumbsItemsAtom(ctx, null);
        }
      } catch (error) {
        if (!isAbortError(error)) {
          console.error('Error when trying to retrieve boundaries:', error);
        }
      }
    }
  },
  1000,
);

export const fetchBreadcrumbsItems = reatomAsync(
  async (ctx, position: CurrentMapPositionAtomState) => {
    debouncedItemsFetch(ctx, ctx.controller, position);
  },
  'breadcrumbsItemsResource',
);

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
