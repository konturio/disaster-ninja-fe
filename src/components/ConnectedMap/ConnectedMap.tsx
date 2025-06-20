import { useRef, useMemo, useEffect, useCallback, Suspense, useState } from 'react';
import { useAction } from '@reatom/react-v2';
import { useAtom } from '@reatom/npm-react';
import { Map as MapLibreMap } from 'maplibre-gl';
import {
  mapPopoverRegistry,
  useMapPopoverService,
  MapPopoverProvider,
  useMapPopoverMaplibreIntegration,
} from '~core/map';
import { configRepo } from '~core/config';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder/layersOrder';
import { mapLibreParentsIds } from '~core/logical_layers/utils/layersOrder/mapLibreParentsIds';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { currentMapAtom } from '~core/shared_state/currentMap';
import { currentMapPositionAtom } from '~core/shared_state/currentMapPosition';
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

function MapContainer({ className }: { className?: string }) {
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null);
  const mapBaseStyle = configRepo.get().mapBaseStyle;
  const [currentPosition] = useAtom(currentMapPositionAtom, [], false);
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
      {mapInstance && <MapIntegration map={mapInstance} />}
    </div>
  );
}

function MapIntegration({ map }: { map: MapLibreMap }) {
  const resetCurrentMap = useAction(currentMapAtom.resetMap);
  const popoverService = useMapPopoverService();

  useEffect(() => {
    return () => {
      resetCurrentMap();
      const cleanup = (map as any)._cleanup;
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [map, resetCurrentMap]);

  // MapPopover integration with proper position tracking
  useMapPopoverMaplibreIntegration({
    map,
    popoverService,
    enabled: true,
    trackingThrottleMs: 16,
  });

  return null;
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
