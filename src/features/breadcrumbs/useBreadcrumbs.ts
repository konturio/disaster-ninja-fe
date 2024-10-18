import { useEffect } from 'react';
import { getBoundaries } from '~core/api/boundaries';
import { breadcrumbsItemsAtom } from '~features/breadcrumbs/atoms/breadcrumbsItemsAtom';
import { store } from '~core/store/store';
import { debounce } from '~utils/common';
import type { MutableRefObject } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

export function useBreadcrumbs(
  mapRef: MutableRefObject<MapLibreMap | undefined>,
  isFeatureEnabled: boolean,
) {
  useEffect(() => {
    if (!isFeatureEnabled) return;
    const map = mapRef.current;
    if (!map) return;

    const abortController = new AbortController();

    const debouncedUpdateBreadcrumbs = debounce(async () => {
      const center = map.getCenter();
      const coords: [number, number] = [center.lng, center.lat];

      try {
        const response = await getBoundaries(coords, abortController);
        if (!response) return;
        const { features } = response;
        breadcrumbsItemsAtom(store.v3ctx, features);
      } catch (error) {
        console.error('Failed to fetch boundaries:', error);
      }
    }, 300);

    map.on('moveend', debouncedUpdateBreadcrumbs);
    debouncedUpdateBreadcrumbs();

    return () => {
      map.off('moveend', debouncedUpdateBreadcrumbs);
      abortController.abort();
    };
  }, [isFeatureEnabled, mapRef]);
}
