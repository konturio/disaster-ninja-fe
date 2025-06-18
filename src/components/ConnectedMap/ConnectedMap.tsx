import { useRef, useMemo, useEffect, useCallback, Suspense, useState, memo } from 'react';
import { useAtom, useAction } from '@reatom/react-v2';
import { useAtom as useReatom3Atom } from '@reatom/npm-react';
import { Map as MapLibreMap } from 'maplibre-gl';
import { throttle } from '@github/mini-throttle';
import { typedObjectEntries } from '~core/types/entry';
import {
  mapPopoverRegistry,
  useMapPopoverService,
  MapPopoverProvider,
  useMapPopoverMaplibreIntegration,
} from '~core/map';
import { mapListenersAtom } from '~core/shared_state';
import { configRepo } from '~core/config';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder/layersOrder';
import { mapLibreParentsIds } from '~core/logical_layers/utils/layersOrder/mapLibreParentsIds';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { currentMapAtom } from '~core/shared_state/currentMap';
import { currentMapPositionAtom } from '~core/shared_state/currentMapPosition';
import { registerMapListener } from '~core/shared_state/mapListeners';
import type { LayerSpecification } from 'maplibre-gl';

export type ApplicationMap = MapLibreMap;
export type ApplicationLayer = LayerSpecification;

const LAYERS_ON_TOP = [
  'editable-layer',
  'hovered-boundaries-layer',
  'selected-boundaries-layer',
];

// Module-level singleton to prevent multiple map instances
let globalMapInstance: MapLibreMap | null = null;

// This component handles DOM mounting (normal React lifecycle)
function MapContainer({ className }: { className?: string }) {
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null);
  const mapBaseStyle = configRepo.get().mapBaseStyle;
  const [currentPosition] = useReatom3Atom(currentMapPositionAtom, [], false);

  // Reatom actions for map sync
  const setCurrentMap = useAction(currentMapAtom.setMap);

  // Capture initial position once
  const initialPosition = useRef(currentPosition);
  if (!initialPosition.current && currentPosition) {
    initialPosition.current = currentPosition;
  }

  // Create map config once
  const mapConfig = useMemo(() => {
    const config: any = {
      style: mapBaseStyle,
      attributionControl: false,
    };

    // Apply URL position as initial map position ONLY
    if (initialPosition.current) {
      if ('bbox' in initialPosition.current) {
        config.bounds = initialPosition.current.bbox;
      } else {
        config.center = [initialPosition.current.lng, initialPosition.current.lat];
        config.zoom = initialPosition.current.zoom;
      }
    }

    return config;
  }, []);

  // Create map instance directly when DOM node is ready
  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && !mapInstance) {
        // Return existing instance if available
        if (globalMapInstance) {
          console.warn('Reusing existing MapLibre map instance');
          setMapInstance(globalMapInstance);
          // Sync with Reatom atoms immediately
          setCurrentMap(globalMapInstance);
          return;
        }

        const newMapInstance = new MapLibreMap({
          container: node,
          ...mapConfig,
        });

        // Store as global singleton
        globalMapInstance = newMapInstance;

        // Set up light for extrusion layers
        newMapInstance.once('styledata', () => {
          newMapInstance.setLight({ anchor: 'viewport', color: '#FFF', intensity: 1 });
        });

        // === ONE-TIME INITIALIZATION (moved from useEffect) ===

        // Global map access
        globalThis.KONTUR_MAP = newMapInstance;
        newMapInstance.touchZoomRotate.disableRotation();
        (newMapInstance as any).toJSON = () => '[Mapbox Object]';

        // Auto-resize setup
        const resizeObserver = new ResizeObserver(() => newMapInstance.resize());
        const mapContainer = newMapInstance.getCanvasContainer();
        resizeObserver.observe(mapContainer);

        // Layers manager initialization - wait for map to load
        newMapInstance.once('load', () => {
          layersOrderManager.init(newMapInstance, mapLibreParentsIds, layersSettingsAtom);
        });

        // Apply default extent if no URL position was used
        if (!initialPosition.current) {
          const extent = configRepo.get().extent;
          if (extent) {
            newMapInstance.fitBounds(extent, { animate: false });
          }
        }

        // Delayed resize for layout stability
        setTimeout(() => {
          requestAnimationFrame(() => newMapInstance.resize());
        }, 1000);

        // Sync with Reatom atoms immediately
        setCurrentMap(newMapInstance);

        // Store cleanup function for unmount
        (newMapInstance as any)._cleanup = () => {
          resizeObserver.disconnect();
          layersOrderManager.destroy();
          if (globalMapInstance === newMapInstance) {
            globalMapInstance = null;
          }
          newMapInstance.remove();
        };

        setMapInstance(newMapInstance);
      }
    },
    [mapInstance, mapConfig, initialPosition, setCurrentMap],
  );

  return (
    <div ref={handleRef} className={className}>
      {mapInstance && <MapInstance map={mapInstance} />}
    </div>
  );
}

function MapInstance({ map }: { map: MapLibreMap }) {
  const resetCurrentMap = useAction(currentMapAtom.resetMap);

  useEffect(() => {
    return () => {
      resetCurrentMap();
      const cleanup = (map as any)._cleanup;
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [map, resetCurrentMap]);

  return <MapIntegration map={map} />;
}

// handles all reactive state integration
function MapIntegration({ map }: { map: MapLibreMap }) {
  // App state integration
  const [mapListeners] = useAtom(mapListenersAtom);
  const [, updatePosition] = useReatom3Atom(currentMapPositionAtom, [], false);
  const popoverService = useMapPopoverService();

  // Apply mapListeners directly to map - single event loop with priorities
  useEffect(() => {
    const handlers = new Map();

    typedObjectEntries(mapListeners).forEach(([eventType, listeners]) => {
      // Sort by priority (higher priority = earlier execution)
      const sortedListeners = listeners.sort((a, b) => b.priority - a.priority);

      const chainHandler = (event: any) => {
        for (const { listener } of sortedListeners) {
          const shouldContinue = listener(event, event.target);
          if (!shouldContinue) break; // Priority chain stops
        }
      };

      map.on(eventType, chainHandler);
      handlers.set(eventType, chainHandler);
    });

    return () => {
      handlers.forEach((handler, eventType) => {
        map.off(eventType, handler);
      });
    };
  }, [map, mapListeners]);

  // MapPopover integration with proper position tracking
  useMapPopoverMaplibreIntegration({
    map,
    popoverService,
    enabled: true,
    trackingThrottleMs: 16,
  });

  // Position tracking via mapListeners system - prevents infinite loops
  useEffect(() => {
    const throttledHandler = throttle(() => {
      const center = map.getCenter();
      updatePosition({
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom(),
      });
    }, 100);

    const unregister = registerMapListener(
      'moveend',
      () => {
        throttledHandler();
        return true; // Continue chain
      },
      10, // Standard priority
    );

    return unregister;
  }, []); // NO dependencies - register once only

  return null; // This component only handles integration
}

export function ConnectedMap({ className }: { className?: string }) {
  const content = useMemo(
    () => (
      <MapPopoverProvider registry={mapPopoverRegistry}>
        <Suspense fallback={<div className={className}>Loading map...</div>}>
          <MapContainer className={className} />
        </Suspense>
      </MapPopoverProvider>
    ),
    [className],
  );

  return content;
}
