import { useMemo, useEffect } from 'react';
import { MapLibreAdapter } from '../providers/MapLibreProvider';
import type { IMapProvider, IMap } from '../providers/IMapProvider';
import type { Map as MapLibreMap } from 'maplibre-gl';

interface MapCache {
  [key: string]: {
    promise?: Promise<IMap>;
    map?: IMap;
    error?: Error;
  };
}

const mapCache: MapCache = {};

function createMapPromise<TMap, TConfig>(
  container: HTMLElement,
  provider: IMapProvider<TMap, TConfig>,
  config: TConfig,
): Promise<IMap> {
  return new Promise((resolve, reject) => {
    try {
      const mapInstance = provider.createMap(container, config);

      // Wrap MapLibre in adapter
      const adapter = new MapLibreAdapter(mapInstance as MapLibreMap);

      const handleLoad = () => {
        adapter.off('load', handleLoad);
        adapter.off('error', handleError);
        resolve(adapter);
      };

      const handleError = (error: any) => {
        adapter.off('load', handleLoad);
        adapter.off('error', handleError);
        reject(error);
      };

      adapter.on('load', handleLoad);
      adapter.on('error', handleError);
    } catch (error) {
      reject(error);
    }
  });
}

export function useMapInstance<TConfig>(
  container: React.RefObject<HTMLElement>,
  provider: IMapProvider<any, TConfig>,
  config: TConfig,
  mapId: string,
): IMap {
  // Cleanup cache on unmount
  useEffect(() => {
    return () => {
      if (mapCache[mapId]) {
        mapCache[mapId].map?.destroy();
        delete mapCache[mapId];
      }
    };
  }, [mapId]);

  // Container is guaranteed to be ready by the calling architecture
  if (!container.current) {
    throw new Error('Container ref not ready - architecture error');
  }

  const cached = mapCache[mapId];

  if (cached?.error) {
    throw cached.error;
  }

  if (cached?.map) {
    return cached.map;
  }

  if (!cached?.promise) {
    mapCache[mapId] = {
      promise: createMapPromise(container.current, provider, config)
        .then((map) => {
          mapCache[mapId].map = map;
          return map;
        })
        .catch((error) => {
          mapCache[mapId].error = error;
          throw error;
        }),
    };
  }

  if (!mapCache[mapId].map) {
    throw mapCache[mapId].promise;
  }

  return mapCache[mapId].map;
}
