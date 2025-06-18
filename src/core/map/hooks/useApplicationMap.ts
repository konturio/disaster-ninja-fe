import { useEffect } from 'react';
import { useMapInstance } from './useMapInstance';
import { useMapEvents } from './useMapEvents';
import type { IMapProvider, IMap } from '../providers/IMapProvider';
import type { MapPlugin } from '../types';
import type { MapEventHandler } from './useMapEvents';

interface UseApplicationMapConfig<TConfig> {
  container: React.RefObject<HTMLElement>;
  provider: IMapProvider<any, TConfig>;
  config: TConfig;
  mapId: string;
  events?: MapEventHandler[];
  plugins?: MapPlugin[];
}

export function useApplicationMap<TConfig>({
  container,
  provider,
  config,
  mapId,
  events = [],
  plugins = [],
}: UseApplicationMapConfig<TConfig>): IMap {
  // This will suspend until map is ready
  const map = useMapInstance<TConfig>(container, provider, config, mapId);

  useMapEvents(map, events);

  // Apply plugins and handle cleanup functions
  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    for (const plugin of plugins) {
      const cleanup = plugin(map);
      if (cleanup) {
        cleanupFunctions.push(cleanup);
      }
    }

    // Return cleanup function to run all plugin cleanups
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [map, plugins]);

  return map;
}
