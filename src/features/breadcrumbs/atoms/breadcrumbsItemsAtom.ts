import { action, atom, reatomAsync } from '@reatom/framework';
import { LRUCache } from 'lru-cache';
import { setCurrentMapBbox, type Bbox } from '~core/shared_state/currentMapPosition';
import { getBboxForGeometry } from '~utils/map/camera';
import { getBoundaries } from '~core/api/boundaries';
import { isAbortError } from '~core/api_client/errors';
import { getCenterFromPosition } from '../helpers/breadcrumbsHelpers';
import { getBreadcrumbsForPoint } from './getBreadcrumbsForPoint';
import type { CurrentMapPositionAtomState } from '~core/shared_state/currentMapPosition';

const CACHE_SIZE = 256;
const boundariesCache = new LRUCache<string | number, GeoJSON.Feature>({
  max: CACHE_SIZE,
});

const updateBreadcrumbsFromCache = action(
  (ctx, position: CurrentMapPositionAtomState) => {
    if (!position) {
      breadcrumbsItemsAtom(ctx, null);
      return;
    }

    const coords: [number, number] = getCenterFromPosition(position);
    const items = getBreadcrumbsForPoint(boundariesCache, coords);
    breadcrumbsItemsAtom(ctx, items.length > 0 ? items : null);
  },
  'updateBreadcrumbsFromCache',
);

// Manual queue processes only the most recent request. Intermediate positions
// are discarded deliberately to avoid race conditions. This behavior is OK for
// geographic breadcrumbs because only the latest map state should win.
let inFlight = false;
let queuedPosition: CurrentMapPositionAtomState | null = null;

export const fetchBreadcrumbsItems = reatomAsync(
  async (ctx, position: CurrentMapPositionAtomState) => {
    updateBreadcrumbsFromCache(ctx, position);

    if (!position) return;

    if (inFlight) {
      queuedPosition = position;
      return;
    }
    inFlight = true;

    try {
      const coords: [number, number] = getCenterFromPosition(position);
      const response = await getBoundaries(coords);
      const features = response?.features;
      if (features) {
        for (const feature of features) {
          if (feature.id !== undefined) {
            boundariesCache.set(feature.id, feature);
          }
        }
        updateBreadcrumbsFromCache(ctx, position);
      }
    } catch (error) {
      if (!isAbortError(error)) {
        console.error('Error when trying to retrieve boundaries:', error);
      }
    } finally {
      inFlight = false;
      if (queuedPosition) {
        const next = queuedPosition;
        queuedPosition = null;
        fetchBreadcrumbsItems(ctx, next);
      }
    }
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
