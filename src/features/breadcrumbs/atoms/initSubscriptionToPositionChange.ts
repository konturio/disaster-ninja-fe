import { debounce } from '@github/mini-throttle';
import { LngLatBounds } from 'maplibre-gl';
import { getBoundaries } from '~core/api/boundaries';
import { breadcrumbsItemsAtom } from '~features/breadcrumbs/atoms/breadcrumbsItemsAtom';
import { store } from '~core/store/store';
import { isAbortError } from '~core/api_client/errors';
import {
  mapPositionAtom,
  type BboxPosition,
  type CenterZoomPosition,
  type CurrentMapPositionAtomState,
} from '~core/shared_state/currentMapPosition';

let abortController: AbortController | null = null;

export const debouncedBreadcrumbsUpdate = debounce(
  async (position: BboxPosition | CenterZoomPosition) => {
    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();

    try {
      const coords: [number, number] = getCenterFromPosition(position);
      const response = await getBoundaries(coords, abortController);

      if (!response) return;
      const { features } = response;
      breadcrumbsItemsAtom(store.v3ctx, features);
    } catch (error) {
      if (!isAbortError(error)) {
        console.error('Error when trying to retrieve boundaries:', error);
      }
    }
  },
  1000,
);

export function initSubscriptionToPositionChange() {
  const unsubscribe = mapPositionAtom.onChange((ctx, position) => {
    handlePositionUpdate(position);
  });

  const currentMapPosition = store.v3ctx.get(mapPositionAtom);
  handlePositionUpdate(currentMapPosition);
  return unsubscribe;
}

function handlePositionUpdate(position: CurrentMapPositionAtomState) {
  if (position) {
    debouncedBreadcrumbsUpdate(position);
  }
}

function getCenterFromPosition(
  position: BboxPosition | CenterZoomPosition,
): [number, number] {
  if (isBboxPosition(position)) {
    try {
      const bounds = new LngLatBounds(position.bbox);
      const center = bounds.getCenter();
      return center.toArray();
    } catch {
      throw new Error('Invalid position data provided');
    }
  } else {
    return [position.lng, position.lat];
  }
}

function isBboxPosition(
  position: BboxPosition | CenterZoomPosition,
): position is BboxPosition {
  return 'bbox' in position;
}
