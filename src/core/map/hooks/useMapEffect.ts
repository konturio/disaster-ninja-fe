import { useEffect, type DependencyList } from 'react';
import type { IMap } from '../providers/IMapProvider';

export function useMapEffect<TMap extends IMap>(
  map: TMap,
  effect: (map: TMap) => void | (() => void),
  deps: DependencyList,
): void {
  useEffect(() => {
    return effect(map); // Map guaranteed ready
  }, [map, ...deps]);
}
