import { useEffect, useMemo, useRef } from 'react';
import { getBoundaries } from '~core/api/boundaries';
import { breadcrumbsItemsAtom } from '~features/breadcrumbs/atoms/breadcrumbsItemsAtom';
import { store } from '~core/store/store';
import { debounce } from '~utils/common';
import { isAbortError } from '~utils/atoms/createAsyncAtom/abort-error';
import type { MutableRefObject } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

export function useBreadcrumbs(
  mapRef: MutableRefObject<MapLibreMap | undefined>,
  isFeatureEnabled: boolean,
) {
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedUpdateBreadcrumbs = useMemo(() => {
    return debounce(async () => {
      const map = mapRef.current;
      if (!map) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const center = map.getCenter();
      const coords: [number, number] = [center.lng, center.lat];

      try {
        const response = await getBoundaries(coords, abortControllerRef.current);
        if (!response) return;
        const { features } = response;
        breadcrumbsItemsAtom(store.v3ctx, features);
      } catch (error) {
        if (!isAbortError(error)) {
          console.error('Failed to fetch boundaries:', error);
        }
      }
    }, 1500);
  }, []);

  // Initial Update
  useEffect(() => {
    debouncedUpdateBreadcrumbs();
  }, []);

  useEffect(() => {
    if (!isFeatureEnabled) return;
    const map = mapRef.current;
    if (!map) return;

    map.on('moveend', debouncedUpdateBreadcrumbs);
    return () => {
      map.off('moveend', debouncedUpdateBreadcrumbs);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isFeatureEnabled, mapRef, debouncedUpdateBreadcrumbs]);
}
