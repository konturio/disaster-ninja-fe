# ADR-006: Migration Guide - Modular Map Hook Architecture

## Implementation Phases

### Phase 1: Provider Abstraction

**Create**: `src/core/map/providers/IMapProvider.ts`

```typescript
export interface IMapProvider<TMap, TConfig> {
  createMap(container: HTMLElement, config: TConfig): TMap;
  supportsFeature(feature: string): boolean;
  getTypeName(): string;
}

export interface IMap {
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  getCenter(): { lng: number; lat: number };
  getZoom(): number;
  getBounds(): { north: number; south: number; east: number; west: number };
  addLayer(layer: any, beforeId?: string): void;
  removeLayer(layerId: string): void;
  addSource(sourceId: string, source: any): void;
  removeSource(sourceId: string): void;
  getLayer(layerId: string): any;
  getSource(sourceId: string): any;
  resize(): void;
  destroy(): void;
}
```

**Create**: `src/core/map/providers/MapLibreProvider.ts`

```typescript
import { Map as MapLibreMap } from 'maplibre-gl';
import type { MapOptions } from 'maplibre-gl';
import type { IMapProvider, IMap } from './IMapProvider';

export class MapLibreProvider implements IMapProvider<MapLibreMap, MapOptions> {
  createMap(container: HTMLElement, config: MapOptions): MapLibreMap {
    return new MapLibreMap({ container, ...config });
  }

  supportsFeature(feature: string): boolean {
    const supportedFeatures = ['rtl-text', 'terrain', 'custom-layers'];
    return supportedFeatures.includes(feature);
  }

  getTypeName(): string {
    return 'maplibre-gl';
  }
}

export class MapLibreAdapter implements IMap {
  constructor(private map: MapLibreMap) {}

  on(event: string, handler: Function): void {
    this.map.on(event as any, handler as any);
  }

  off(event: string, handler: Function): void {
    this.map.off(event as any, handler as any);
  }

  getCenter(): { lng: number; lat: number } {
    const center = this.map.getCenter();
    return { lng: center.lng, lat: center.lat };
  }

  getZoom(): number {
    return this.map.getZoom();
  }

  getBounds(): { north: number; south: number; east: number; west: number } {
    const bounds = this.map.getBounds();
    return {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    };
  }

  addLayer(layer: any, beforeId?: string): void {
    this.map.addLayer(layer, beforeId);
  }

  removeLayer(layerId: string): void {
    this.map.removeLayer(layerId);
  }

  addSource(sourceId: string, source: any): void {
    this.map.addSource(sourceId, source);
  }

  removeSource(sourceId: string): void {
    this.map.removeSource(sourceId);
  }

  getLayer(layerId: string): any {
    return this.map.getLayer(layerId);
  }

  getSource(sourceId: string): any {
    return this.map.getSource(sourceId);
  }

  resize(): void {
    this.map.resize();
  }

  destroy(): void {
    this.map.remove();
  }
}
```

### Phase 2: Suspense-Based Core Hooks

**Create**: `src/core/map/hooks/useMapEffect.ts`

```typescript
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
```

**Create**: `src/core/map/hooks/useMapInstance.ts`

```typescript
import { useMemo } from 'react';
import type { IMapProvider, IMap } from '../providers/IMapProvider';

interface MapCache {
  [key: string]: {
    promise?: Promise<IMap>;
    map?: IMap;
    error?: Error;
  };
}

const mapCache: MapCache = {};

function createMapPromise<TMap extends IMap, TConfig>(
  container: HTMLElement,
  provider: IMapProvider<TMap, TConfig>,
  config: TConfig,
): Promise<TMap> {
  return new Promise((resolve, reject) => {
    try {
      const mapInstance = provider.createMap(container, config);

      const handleLoad = () => {
        mapInstance.off('load', handleLoad);
        mapInstance.off('error', handleError);
        resolve(mapInstance);
      };

      const handleError = (error: any) => {
        mapInstance.off('load', handleLoad);
        mapInstance.off('error', handleError);
        reject(error);
      };

      mapInstance.on('load', handleLoad);
      mapInstance.on('error', handleError);
    } catch (error) {
      reject(error);
    }
  });
}

export function useMapInstance<TMap extends IMap, TConfig>(
  container: React.RefObject<HTMLElement>,
  provider: IMapProvider<TMap, TConfig>,
  config: TConfig,
): TMap {
  const cacheKey = useMemo(() => {
    return `${provider.getTypeName()}-${JSON.stringify(config)}-${container.current?.id || 'default'}`;
  }, [provider, config, container.current]);

  if (!container.current) {
    throw new Error('Container ref not ready');
  }

  const cached = mapCache[cacheKey];

  if (cached?.error) {
    throw cached.error;
  }

  if (cached?.map) {
    return cached.map as TMap;
  }

  if (!cached?.promise) {
    mapCache[cacheKey] = {
      promise: createMapPromise(container.current, provider, config)
        .then((map) => {
          mapCache[cacheKey].map = map;
          delete mapCache[cacheKey].promise;
          return map;
        })
        .catch((error) => {
          mapCache[cacheKey].error = error;
          delete mapCache[cacheKey].promise;
          throw error;
        }),
    };
  }

  throw cached.promise;
}
```

**Create**: `src/core/map/hooks/useMapEvents.ts`

```typescript
import { useMapEffect } from './useMapEffect';
import type { IMap } from '../providers/IMapProvider';

export interface MapEventHandler {
  event: string;
  handler: (event: any) => boolean | void;
  priority?: number;
}

export function useMapEvents<TMap extends IMap>(
  map: TMap,
  handlers: MapEventHandler[],
): void {
  useMapEffect(
    map,
    (map) => {
      const handlersByEvent = handlers.reduce(
        (acc, handler) => {
          if (!acc[handler.event]) {
            acc[handler.event] = [];
          }
          acc[handler.event].push(handler);
          return acc;
        },
        {} as Record<string, MapEventHandler[]>,
      );

      const cleanupFunctions: (() => void)[] = [];

      Object.entries(handlersByEvent).forEach(([eventType, eventHandlers]) => {
        const sortedHandlers = eventHandlers.sort(
          (a, b) => (a.priority || 100) - (b.priority || 100),
        );

        const compositeHandler = (event: any) => {
          for (const { handler } of sortedHandlers) {
            const continueChain = handler(event);
            if (continueChain === false) break;
          }
        };

        map.on(eventType, compositeHandler);
        cleanupFunctions.push(() => map.off(eventType, compositeHandler));
      });

      return () => {
        cleanupFunctions.forEach((cleanup) => cleanup());
      };
    },
    [handlers],
  );
}
```

### Phase 3: Layer Management

**Create**: `src/core/map/hooks/useMapLayers.ts`

```typescript
import { useArrayDiff } from '~components/ConnectedMap/map-libre-adapter/useArrayDiff';
import { useMapEffect } from './useMapEffect';
import type { IMap } from '../providers/IMapProvider';
import type { ApplicationLayer } from '~components/ConnectedMap/ConnectedMap';

interface LayerManagementOptions {
  layersOnTop?: string[];
  cleanup?: boolean;
}

export function useMapLayers<TMap extends IMap>(
  map: TMap,
  layers: ApplicationLayer[],
  options: LayerManagementOptions = {},
): void {
  const { added: addedLayers, deleted: deletedLayers } = useArrayDiff(layers, false);

  const { layersOnTop = [], cleanup = true } = options;

  useMapEffect(
    map,
    (map) => {
      addedLayers.forEach((layer) => {
        const previouslyAdded = map.getLayer(layer.id) !== undefined;

        if (previouslyAdded) {
          map.setLayoutProperty(layer.id, 'visibility', 'visible');
        } else {
          const beforeLayer = layersOnTop.find(
            (id) => map.getLayer(id) !== undefined && !layersOnTop.includes(layer.id),
          );

          map.addLayer(layer, beforeLayer);
        }
      });

      deletedLayers.forEach((layer) => {
        if (cleanup) {
          map.removeLayer(layer.id);
          const sourceInUse = map
            .getStyle()
            .layers?.some((l) => l.source === layer.source && l.id !== layer.id);
          if (!sourceInUse && layer.source) {
            map.removeSource(layer.source as string);
          }
        } else {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });
    },
    [addedLayers, deletedLayers, layersOnTop, cleanup],
  );
}
```

**Replace**: [`src/components/ConnectedMap/map-libre-adapter/index.tsx:202-242`](../../src/components/ConnectedMap/map-libre-adapter/index.tsx#L202-L242)

```typescript
const layers = mapStyle.layers || [];
useMapLayers(map, layers, {
  layersOnTop: LAYERS_ON_TOP,
  cleanup: true,
});
```

### Phase 4: Position Tracking

**Create**: `src/core/map/hooks/useMapPositionTracking.ts`

```typescript
import { throttle } from '~utils/common';
import { useMapEffect } from './useMapEffect';
import type { IMap } from '../providers/IMapProvider';

interface PositionTrackingConfig {
  onPositionChange: (position: { lng: number; lat: number; zoom: number }) => void;
  debounceMs?: number;
  trackUserOnly?: boolean;
}

export function useMapPositionTracking<TMap extends IMap>(
  map: TMap,
  config: PositionTrackingConfig,
): void {
  const { onPositionChange, debounceMs = 16, trackUserOnly = true } = config;

  useMapEffect(
    map,
    (map) => {
      const throttledCallback = throttle(onPositionChange, debounceMs);

      const handleMove = (e?: any) => {
        if (trackUserOnly && !e?.originalEvent) return;

        const center = map.getCenter();
        const zoom = map.getZoom();
        throttledCallback({ lng: center.lng, lat: center.lat, zoom });
      };

      map.on('moveend', handleMove);
      return () => map.off('moveend', handleMove);
    },
    [debounceMs, trackUserOnly],
  );
}
```

**Replace**: [`src/components/ConnectedMap/useMapPositionSync.ts:10-36`](../../src/components/ConnectedMap/useMapPositionSync.ts#L10-L36)

```typescript
import { useAtom } from '@reatom/npm-react';
import { useMapPositionTracking } from '~core/map/hooks/useMapPositionTracking';
import { currentMapPositionAtom } from '~core/shared_state/currentMapPosition';
import type { IMap } from '~core/map/providers/IMapProvider';

export function useMapPositionSync<TMap extends IMap>(map: TMap) {
  const [, updateCurrentMapPositionAtom] = useAtom(currentMapPositionAtom);

  useMapPositionTracking(map, {
    onPositionChange: updateCurrentMapPositionAtom,
    trackUserOnly: true,
    debounceMs: 0,
  });
}
```

### Phase 5: Plugin System

**Create**: `src/core/map/plugins/MapPlugin.ts`

```typescript
import type { IMap } from '../providers/IMapProvider';

// Plugin is a hook function that can be called in React context
export type MapPlugin<TMap extends IMap = IMap> = (map: TMap) => void;
```

**Create**: `src/core/map/plugins/ReatomSyncPlugin.ts`

```typescript
import { useAtom } from '@reatom/npm-react';
import { useMapPositionTracking } from '../hooks/useMapPositionTracking';
import { useMapEffect } from '../hooks/useMapEffect';
import { currentMapAtom } from '~core/shared_state/currentMap';
import { currentMapPositionAtom } from '~core/shared_state/currentMapPosition';
import type { MapPlugin } from './MapPlugin';
import type { IMap } from '../providers/IMapProvider';

export function createReatomSyncPlugin(): MapPlugin {
  return function useReatomSyncPlugin<TMap extends IMap>(map: TMap): void {
    const [, updatePosition] = useAtom(currentMapPositionAtom);

    // Sync map instance with Reatom
    useMapEffect(
      map,
      (map) => {
        currentMapAtom.setMap.dispatch(map.underlying || map);
        return () => currentMapAtom.resetMap.dispatch();
      },
      [],
    );

    // Sync position changes
    useMapPositionTracking(map, {
      onPositionChange: updatePosition,
      trackUserOnly: true,
      debounceMs: 0,
    });
  };
}
```

**Create**: `src/core/map/plugins/MapPopoverPlugin.ts`

```typescript
import { useMapEvents } from '../hooks/useMapEvents';
import { useMapPopoverService } from '~core/map/popover/MapPopoverProvider';
import type { MapPlugin } from './MapPlugin';
import type { IMap } from '../providers/IMapProvider';
import type { IMapPopoverContentRegistry } from '~core/map/types';

interface MapPopoverPluginOptions {
  priority?: number;
}

export function createMapPopoverPlugin(
  registry: IMapPopoverContentRegistry,
  options: MapPopoverPluginOptions = {},
): MapPlugin {
  return function useMapPopoverPlugin<TMap extends IMap>(map: TMap): void {
    const popoverService = useMapPopoverService();
    const { priority = 55 } = options;

    useMapEvents(map, [
      {
        event: 'click',
        handler: (event: any) => {
          if (popoverService.isOpen()) {
            popoverService.close();
            return false;
          }

          const hasContent = popoverService.showWithEvent(event);
          return !hasContent;
        },
        priority,
      },
      {
        event: 'movestart',
        handler: () => {
          if (popoverService.isOpen()) {
            popoverService.close();
          }
          return true;
        },
        priority: 1, // High priority to close early
      },
    ]);
  };
}
```

### Phase 6: Application Hook & URL Position Handling

**Position Initialization**: URL state gets applied during map creation for deterministic loading:

```typescript
// URL position applied at map creation time
const mapConfig = useMemo(() => {
  const config: any = {
    style: mapBaseStyle,
    attributionControl: false,
  };

  // Apply URL position as initial map position
  if (currentPosition) {
    if ('bbox' in currentPosition) {
      config.bounds = currentPosition.bbox;
    } else {
      config.center = [currentPosition.lng, currentPosition.lat];
      config.zoom = currentPosition.zoom;
    }
  }

  return config;
}, [mapBaseStyle, currentPosition]);
```

**Create**: `src/core/map/hooks/useApplicationMap.ts`

```typescript
import { useMemo } from 'react';
import { useMapInstance } from './useMapInstance';
import { useMapEvents } from './useMapEvents';
import type { IMapProvider, IMap } from '../providers/IMapProvider';
import type { MapPlugin } from '../plugins/MapPlugin';
import type { MapEventHandler } from './useMapEvents';

interface UseApplicationMapConfig<TConfig> {
  container: React.RefObject<HTMLElement>;
  provider: IMapProvider<any, TConfig>;
  config: TConfig;
  mapId: string; // User-controlled identity
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

  // Apply plugins - all are hook functions
  for (const plugin of plugins) {
    plugin(map);
  }

  return map;
}
```

**Position Handling Principles**:

1. **Creation-Time Application**: URL position applied during map construction prevents race conditions
2. **Reactive Fallback**: Default extent only applies if no URL position exists
3. **Deterministic Caching**: User-controlled map IDs enable predictable behavior
4. **Clean Separation**: Position logic separated from ongoing position tracking

````

### Phase 7: ConnectedMap Migration

**Replace**: [`src/components/ConnectedMap/ConnectedMap.tsx:42-143`](../../src/components/ConnectedMap/ConnectedMap.tsx#L42-L143)

```typescript
import { useRef, useMemo, useEffect, Suspense } from 'react';
import { useAtom } from '@reatom/react-v2';
import { MapLibreProvider } from '~core/map/providers/MapLibreProvider';
import { useApplicationMap } from '~core/map/hooks/useApplicationMap';
import { createMapPopoverPlugin } from '~core/map/plugins/MapPopoverPlugin';
import { mapListenersAtom } from '~core/shared_state';
import { mapPopoverRegistry } from '~core/map';
import { configRepo } from '~core/config';

// This component will suspend until map is ready
function ConnectedMapCore({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const provider = useMemo(() => new MapLibreProvider(), []);
  const mapBaseStyle = configRepo.get().mapBaseStyle;

  const [mapListeners] = useAtom(mapListenersAtom);

  const events = useMemo(
    () => [
      ...mapListeners.click.map(({ listener, priority }) => ({
        event: 'click',
        handler: (event: any) => listener(event, map),
        priority,
      })),
      ...mapListeners.mousemove.map(({ listener, priority }) => ({
        event: 'mousemove',
        handler: (event: any) => listener(event, map),
        priority,
      })),
    ],
    [mapListeners],
  );

  // Include initial position in map config if available
  const mapConfig = useMemo(() => {
    const config: any = {
      style: mapBaseStyle,
      attributionControl: false,
    };

    // Apply URL position as initial map position
    if (currentPosition) {
      if ('bbox' in currentPosition) {
        config.bounds = currentPosition.bbox;
      } else {
        config.center = [currentPosition.lng, currentPosition.lat];
        config.zoom = currentPosition.zoom;
      }
    }

    return config;
  }, [mapBaseStyle, currentPosition]);

  // This suspends until map is ready - no isReady checks needed
  const map = useApplicationMap({
    container: containerRef,
    provider,
    config: mapConfig,
    mapId: 'main-map', // User-controlled map identity
    events,
    plugins: [
      createMapPopoverPlugin(mapPopoverRegistry, { priority: 55 }),
    ],
  });

  useEffect(() => {
    if (!globalThis.KONTUR_MAP) {
      console.info('Map instance available by window.KONTUR_MAP', map.underlying || map);
      globalThis.KONTUR_MAP = map.underlying || map;

      if (map.underlying) {
        map.underlying.touchZoomRotate.disableRotation();
        map.underlying.toJSON = () => '[Mapbox Object]';

        setTimeout(() => {
          requestAnimationFrame(() => {
            map.underlying.resize();
          });
        }, 1000);
      }
    }
  }, [map]);

  useEffect(() => {
    const mapInstance = map.underlying || map;
    const resizeObserver = new ResizeObserver(() => {
      mapInstance.resize();
    });
    const mapContainer = mapInstance.getCanvasContainer();
    resizeObserver.observe(mapContainer);
    return () => {
      resizeObserver.unobserve(mapContainer);
    };
  }, [map]);

  return <div ref={containerRef} className={className} />;
}

// Wrapper with Suspense boundary
export function ConnectedMapWithPopover({ className }: { className?: string }) {
  return (
    <Suspense fallback={<div className={className}>Loading map...</div>}>
      <ConnectedMapCore className={className} />
    </Suspense>
  );
}
````

## Current State References

**Coupling Points**:

- [`src/components/ConnectedMap/map-libre-adapter/index.tsx:4-10`](../../src/components/ConnectedMap/map-libre-adapter/index.tsx#L4-L10) - Business logic imports
- [`src/components/ConnectedMap/ConnectedMap.tsx:83-104`](../../src/components/ConnectedMap/ConnectedMap.tsx#L83-L104) - Manual event composition
- [`src/components/ConnectedMap/useMapPositionSync.ts:10-36`](../../src/components/ConnectedMap/useMapPositionSync.ts#L10-L36) - Direct atom coupling
- [`src/core/map/popover/useMapPopoverMaplibreIntegration.ts`](../../src/core/map/popover/useMapPopoverMaplibreIntegration.ts) - Provider-specific integration

**Memory Issue**: [`index.tsx:238`](../../src/components/ConnectedMap/map-libre-adapter/index.tsx#L238) - Layer cleanup TODO

**Existing Utilities**:

- [`useArrayDiff`](../../src/components/ConnectedMap/map-libre-adapter/useArrayDiff.ts) - O(n+m) diffing algorithm
- [`@github/mini-throttle`](../../src/utils/common/index.ts) - Performance utilities
- [`clusterize<T>`](../../src/utils/bivariate/legend/legendClusters.ts) - Grouping patterns

## Reatom Integration

### Current Reatom Usage

**Position Sync**: [`src/core/shared_state/currentMapPosition.ts:36-44`](../../src/core/shared_state/currentMapPosition.ts#L36-L44)

```typescript
export const setCurrentMapPosition = action((ctx, position: CenterZoomPosition) => {
  const map = currentMapAtom.getState();
  if (map) {
    jumpTo(map, position);
  }
  currentMapPositionAtom(ctx, position);
}, 'setCurrentMapPosition');
```

**Map Instance**: [`src/core/shared_state/currentMap.ts:7-25`](../../src/core/shared_state/currentMap.ts#L7-L25)

```typescript
export const currentMapAtom = createAtom(
  {
    setMap: (map: ApplicationMap) => map,
    resetMap: () => null,
  },
  ({ onAction, schedule }, state: ApplicationMap | null = null) => {
    onAction('setMap', (map: ApplicationMap) => {
      if (map !== state) {
        state = map;
        schedule((dispatch) => {
          dispatch(mountedLayersAtom.clear());
        });
      }
    });
    return state;
  },
);
```

### Application Integration

**Direct Reatom Integration**: ConnectedMap handles app-specific state synchronization without plugins:

```typescript
// App-specific integrations using clean hook patterns
// Map instance sync
useMapEffect(
  map,
  (map) => {
    setCurrentMap(map.underlying || map);
    return () => resetCurrentMap();
  },
  [],
);

// Position tracking
useMapPositionTracking(map, {
  onPositionChange: updatePosition,
  trackUserOnly: true,
  debounceMs: 0,
});
```

**Update**: `src/core/map/hooks/useApplicationMap.ts` - Automatic Reatom Integration

```typescript
import { useMemo } from 'react';
import { useMapInstance } from './useMapInstance';
import { useMapEvents } from './useMapEvents';
import { ReatomSyncPlugin } from '../plugins/ReatomSyncPlugin';
import type { IMapProvider, IMap } from '../providers/IMapProvider';
import type { MapPlugin } from '../plugins/MapPlugin';
import type { MapEventHandler } from './useMapEvents';

interface UseApplicationMapConfig<TConfig> {
  container: React.RefObject<HTMLElement>;
  provider: IMapProvider<any, TConfig>;
  config: TConfig;
  events?: MapEventHandler[];
  plugins?: MapPlugin[];
  enableReatomSync?: boolean; // Default: true
}

export function useApplicationMap<TMap extends IMap, TConfig>({
  container,
  provider,
  config,
  events = [],
  plugins = [],
  enableReatomSync = true,
}: UseApplicationMapConfig<TConfig>) {
  const { map, isReady } = useMapInstance<TMap, TConfig>(container, provider, config);

  const allPlugins = useMemo(() => {
    const result = [...plugins];
    if (enableReatomSync) {
      result.unshift(new ReatomSyncPlugin());
    }
    return result;
  }, [plugins, enableReatomSync]);

  useMapEvents(map, events);

  allPlugins.forEach((plugin) => {
    plugin.usePlugin(map);
  });

  return { map, isReady };
}
```

## Suspense Integration

### Current Loading State Issues

**Manual State Tracking**: [`src/core/map/hooks/useMapInstance.ts`](../../src/core/map/hooks/useMapInstance.ts)

```typescript
// Current approach - manual boolean tracking
const [isReady, setIsReady] = useState(false);

useEffect(() => {
  const handleLoad = () => setIsReady(true);
  mapInstance.on('load', handleLoad);
}, []);
```

**Conditional Effects**: Throughout hooks like `useMapEffect`

```typescript
useEffect(() => {
  if (!map || !condition) return; // Manual condition checking
  return effect(map);
}, [map, condition, ...deps]);
```

### Suspense-Based Map Loading

**Create**: `src/core/map/hooks/useMapInstanceSuspense.ts`

```typescript
import { useMemo } from 'react';
import type { IMapProvider, IMap } from '../providers/IMapProvider';

interface MapCache {
  [key: string]: {
    promise?: Promise<IMap>;
    map?: IMap;
    error?: Error;
  };
}

const mapCache: MapCache = {};

function createMapPromise<TMap extends IMap, TConfig>(
  container: HTMLElement,
  provider: IMapProvider<TMap, TConfig>,
  config: TConfig,
): Promise<TMap> {
  return new Promise((resolve, reject) => {
    try {
      const mapInstance = provider.createMap(container, config);

      const handleLoad = () => {
        mapInstance.off('load', handleLoad);
        mapInstance.off('error', handleError);
        resolve(mapInstance);
      };

      const handleError = (error: any) => {
        mapInstance.off('load', handleLoad);
        mapInstance.off('error', handleError);
        reject(error);
      };

      mapInstance.on('load', handleLoad);
      mapInstance.on('error', handleError);
    } catch (error) {
      reject(error);
    }
  });
}

export function useMapInstanceSuspense<TMap extends IMap, TConfig>(
  container: React.RefObject<HTMLElement>,
  provider: IMapProvider<TMap, TConfig>,
  config: TConfig,
): TMap {
  const cacheKey = useMemo(() => {
    return `${provider.getTypeName()}-${JSON.stringify(config)}-${container.current?.id || 'default'}`;
  }, [provider, config, container.current]);

  if (!container.current) {
    throw new Error('Container ref not ready');
  }

  const cached = mapCache[cacheKey];

  if (cached?.error) {
    throw cached.error;
  }

  if (cached?.map) {
    return cached.map as TMap;
  }

  if (!cached?.promise) {
    mapCache[cacheKey] = {
      promise: createMapPromise(container.current, provider, config)
        .then((map) => {
          mapCache[cacheKey].map = map;
          delete mapCache[cacheKey].promise;
          return map;
        })
        .catch((error) => {
          mapCache[cacheKey].error = error;
          delete mapCache[cacheKey].promise;
          throw error;
        }),
    };
  }

  throw cached.promise;
}
```

**Create**: `src/core/map/hooks/useApplicationMapSuspense.ts`

```typescript
import { useMapInstanceSuspense } from './useMapInstanceSuspense';
import { useMapEvents } from './useMapEvents';
import { ReatomSyncPlugin } from '../plugins/ReatomSyncPlugin';
import type { IMapProvider, IMap } from '../providers/IMapProvider';
import type { MapPlugin } from '../plugins/MapPlugin';
import type { MapEventHandler } from './useMapEvents';

interface UseApplicationMapSuspenseConfig<TConfig> {
  container: React.RefObject<HTMLElement>;
  provider: IMapProvider<any, TConfig>;
  config: TConfig;
  events?: MapEventHandler[];
  plugins?: MapPlugin[];
  enableReatomSync?: boolean;
}

export function useApplicationMapSuspense<TMap extends IMap, TConfig>({
  container,
  provider,
  config,
  events = [],
  plugins = [],
  enableReatomSync = true,
}: UseApplicationMapSuspenseConfig<TConfig>): TMap {
  // This will suspend until map is ready
  const map = useMapInstanceSuspense<TMap, TConfig>(container, provider, config);

  const allPlugins = useMemo(() => {
    const result = [...plugins];
    if (enableReatomSync) {
      result.unshift(new ReatomSyncPlugin());
    }
    return result;
  }, [plugins, enableReatomSync]);

  useMapEvents(map, events);

  // No need for isReady checks - map is guaranteed to be ready
  allPlugins.forEach((plugin) => {
    plugin.usePlugin(map);
  });

  return map;
}
```

### Simplified Hook Implementation

**Update**: `src/core/map/hooks/useMapEffect.ts` - Suspense Version

```typescript
import { useEffect, type DependencyList } from 'react';
import type { IMap } from '../providers/IMapProvider';

// Suspense version - no condition checking needed
export function useMapEffectSuspense<TMap extends IMap>(
  map: TMap,
  effect: (map: TMap) => void | (() => void),
  deps: DependencyList,
): void {
  useEffect(() => {
    return effect(map); // Map is guaranteed ready
  }, [map, ...deps]);
}

// Legacy version with condition checking
export function useMapEffect<TMap extends IMap>(
  map: TMap | null,
  condition: boolean,
  effect: (map: TMap) => void | (() => void),
  deps: DependencyList,
): void {
  useEffect(() => {
    if (!map || !condition) return;
    return effect(map);
  }, [map, condition, ...deps]);
}
```

**Update**: `src/core/map/hooks/useMapLayers.ts` - Suspense Version

```typescript
import { useArrayDiff } from '~components/ConnectedMap/map-libre-adapter/useArrayDiff';
import { useMapEffectSuspense } from './useMapEffect';
import type { IMap } from '../providers/IMapProvider';
import type { ApplicationLayer } from '~components/ConnectedMap/ConnectedMap';

interface LayerManagementOptions {
  layersOnTop?: string[];
  cleanup?: boolean;
}

export function useMapLayersSuspense<TMap extends IMap>(
  map: TMap,
  layers: ApplicationLayer[],
  options: LayerManagementOptions = {},
): void {
  const { added: addedLayers, deleted: deletedLayers } = useArrayDiff(layers, false); // Never freeze

  const { layersOnTop = [], cleanup = true } = options;

  useMapEffectSuspense(
    map,
    (map) => {
      addedLayers.forEach((layer) => {
        const previouslyAdded = map.getLayer(layer.id) !== undefined;

        if (previouslyAdded) {
          map.setLayoutProperty(layer.id, 'visibility', 'visible');
        } else {
          const beforeLayer = layersOnTop.find(
            (id) => map.getLayer(id) !== undefined && !layersOnTop.includes(layer.id),
          );

          map.addLayer(layer, beforeLayer);
        }
      });

      deletedLayers.forEach((layer) => {
        if (cleanup) {
          map.removeLayer(layer.id);
          const sourceInUse = map
            .getStyle()
            .layers?.some((l) => l.source === layer.source && l.id !== layer.id);
          if (!sourceInUse && layer.source) {
            map.removeSource(layer.source as string);
          }
        } else {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });
    },
    [addedLayers, deletedLayers, layersOnTop, cleanup],
  );
}
```

### ConnectedMap with Suspense

**Update**: [`src/components/ConnectedMap/ConnectedMap.tsx`](../../src/components/ConnectedMap/ConnectedMap.tsx)

```typescript
import { useRef, useMemo, useEffect } from 'react';
import { useAtom } from '@reatom/react-v2';
import { MapLibreProvider } from '~core/map/providers/MapLibreProvider';
import { useApplicationMapSuspense } from '~core/map/hooks/useApplicationMapSuspense';
import { MapPopoverPlugin } from '~core/map/plugins/MapPopoverPlugin';
import { mapListenersAtom } from '~core/shared_state';
import { mapPopoverRegistry } from '~core/map';
import { configRepo } from '~core/config';

// This component will suspend until map is ready
function ConnectedMapCore({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const provider = useMemo(() => new MapLibreProvider(), []);
  const mapBaseStyle = configRepo.get().mapBaseStyle;

  const [mapListeners] = useAtom(mapListenersAtom);

  const events = useMemo(
    () => [
      ...mapListeners.click.map(({ listener, priority }) => ({
        event: 'click',
        handler: (event: any) => listener(event, map),
        priority,
      })),
      ...mapListeners.mousemove.map(({ listener, priority }) => ({
        event: 'mousemove',
        handler: (event: any) => listener(event, map),
        priority,
      })),
    ],
    [mapListeners],
  );

  // This suspends until map is ready - no isReady checks needed
  const map = useApplicationMapSuspense({
    container: containerRef,
    provider,
    config: { style: mapBaseStyle },
    events,
    plugins: [
      new MapPopoverPlugin(mapPopoverRegistry, { priority: 55 }),
    ],
    enableReatomSync: true, // Automatic Reatom integration
  });

  useEffect(() => {
    if (!globalThis.KONTUR_MAP) {
      console.info('Map instance available by window.KONTUR_MAP', map.underlying || map);
      globalThis.KONTUR_MAP = map.underlying || map;

      if (map.underlying) {
        map.underlying.touchZoomRotate.disableRotation();
        map.underlying.toJSON = () => '[Mapbox Object]';

        setTimeout(() => {
          requestAnimationFrame(() => {
            map.underlying.resize();
          });
        }, 1000);
      }
    }
  }, [map]);

  useEffect(() => {
    const mapInstance = map.underlying || map;
    const resizeObserver = new ResizeObserver(() => {
      mapInstance.resize();
    });
    const mapContainer = mapInstance.getCanvasContainer();
    resizeObserver.observe(mapContainer);
    return () => {
      resizeObserver.unobserve(mapContainer);
    };
  }, [map]);

  return <div ref={containerRef} className={className} />;
}

// Wrapper with Suspense boundary
export function ConnectedMapWithPopover({ className }: { className?: string }) {
  return (
    <Suspense fallback={<div className={className}>Loading map...</div>}>
      <ConnectedMapCore className={className} />
    </Suspense>
  );
}
```

### Benefits of Hook-Based Plugin Architecture

**React Integration**:

- Plugins are hook functions, can use React hooks properly
- No class component restrictions
- Natural composition with React patterns

**Code Simplicity**:

- Factory functions like `createMapPopoverPlugin()` return reusable hooks
- Direct function calls in plugin application: `plugin(map)`
- Eliminates wrapper interfaces and method calls

**Type Safety**:

- `MapPlugin<TMap extends IMap = IMap> = (map: TMap) => void`
- Direct type flow from factory to usage
- No interface abstraction overhead

**Performance**:

- No class instantiation overhead
- Direct hook execution
- Cleaner dependency tracking

### Benefits of Suspense Integration

**Code Reduction**:

- Eliminates `isReady` boolean tracking
- Removes conditional effect logic (`if (!map || !condition)`)
- Simplifies hook implementations

**Better UX**:

- Declarative loading states
- Composable with React.lazy
- Consistent with existing Suspense usage in [`src/views/Map/Map.tsx:133`](../../src/views/Map/Map.tsx#L133)

**Performance**:

- No re-renders due to `isReady` state changes
- Eliminates effect dependency arrays with conditions
- Cleaner component lifecycle

## Implementation Status

### Phase 1: ✅ **COMPLETED** - MapPopover Plugin System

**Status**: Fully implemented and ready for deployment
**Documentation**: [`MapPopover-Plugin-Implementation.md`](./MapPopover-Plugin-Implementation.md)

**Achievements**:

- ✅ **70+ lines of duplication eliminated** in MapPopover hooks
- ✅ **Plugin system foundation** established with `MapPlugin` and `MapEventPlugin` interfaces
- ✅ **Zero breaking changes** - existing ConnectedMap code unchanged
- ✅ **Performance improvements** through consolidated state management
- ✅ **Error handling** enhanced with fault isolation

**Files Implemented**:

- [`src/core/map/plugins/types.ts`](../../src/core/map/plugins/types.ts) - Plugin interfaces (29 lines)
- [`src/core/map/plugins/MapPopoverPlugin.ts`](../../src/core/map/plugins/MapPopoverPlugin.ts) - Consolidated plugin (118 lines)
- [`src/core/map/hooks/useMapPopoverPlugin.ts`](../../src/core/map/hooks/useMapPopoverPlugin.ts) - Bridge hook (97 lines)

**Files Modified**:

- [`src/core/map/hooks/useMapPopoverPriorityIntegration.ts`](../../src/core/map/hooks/useMapPopoverPriorityIntegration.ts) - 74% reduction (70→18 lines)
- [`src/core/map/index.ts`](../../src/core/map/index.ts) - Added plugin system exports

**Deployment Status**: Ready for immediate deployment with zero coordination required

### Next Phases: Pending ConnectedMap Review

**Phase 2**: Map Ruler and Draw Tools plugin conversion
**Phase 3**: Plugin manager integration in ConnectedMap
**Phase 4**: Legacy priority system removal

The plugin system foundation is now ready for broader ConnectedMap modernization when appropriate.
