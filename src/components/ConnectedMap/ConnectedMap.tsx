import { useRef, useMemo, useEffect, Suspense, useState } from 'react';
import { useAtom, useAction } from '@reatom/react-v2';
import { useAtom as useReatom3Atom } from '@reatom/npm-react';
import { typedObjectEntries } from '~core/types/entry';
import {
  MapLibreProvider,
  useApplicationMap,
  mapPopoverRegistry,
  useMapPopoverService,
  MapPopoverProvider,
  type MapEventHandler,
} from '~core/map';
import { useMapPopoverPriorityIntegration } from '~core/map/hooks/useMapPopoverPriorityIntegration';
import { mapListenersAtom } from '~core/shared_state';
import { configRepo } from '~core/config';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder/layersOrder';
import { mapLibreParentsIds } from '~core/logical_layers/utils/layersOrder/mapLibreParentsIds';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { currentMapAtom } from '~core/shared_state/currentMap';
import { currentMapPositionAtom } from '~core/shared_state/currentMapPosition';
import { useMapPositionTracking } from '~core/map/hooks/useMapPositionTracking';
import { useMapEffect } from '~core/map/hooks/useMapEffect';
import type { LayerSpecification, Map as MapLibreMap } from 'maplibre-gl';
// temporary set generic map class to mapbox map
// todo: change mapbox map declaration to generic map later
export type ApplicationMap = MapLibreMap;
export type ApplicationLayer = LayerSpecification;

const LAYERS_ON_TOP = [
  'editable-layer',
  'hovered-boundaries-layer',
  'selected-boundaries-layer',
];

// This component handles DOM mounting (normal React lifecycle)
function MapContainer({ className }: { className?: string }) {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setContainerElement} className={className}>
      {containerElement && (
        <Suspense fallback={null}>
          <MapInstance containerElement={containerElement} />
        </Suspense>
      )}
    </div>
  );
}

// This component handles map loading (Suspense for async operations)
function MapInstance({ containerElement }: { containerElement: HTMLDivElement }) {
  const provider = useMemo(() => new MapLibreProvider(), []);
  const mapBaseStyle = configRepo.get().mapBaseStyle;

  // App state integration
  const [mapListeners] = useAtom(mapListenersAtom);
  const setCurrentMap = useAction(currentMapAtom.setMap);
  const resetCurrentMap = useAction(currentMapAtom.resetMap);
  const [currentPosition, updatePosition] = useReatom3Atom(currentMapPositionAtom);
  const popoverService = useMapPopoverService();

  const events: MapEventHandler[] = useMemo(() => {
    return typedObjectEntries(mapListeners).flatMap(([eventType, listeners]) =>
      listeners.map(({ listener, priority }) => ({
        event: eventType,
        handler: (event: any) => {
          const shouldContinue = listener(event, event.target);
          return shouldContinue;
        },
        priority,
      })),
    );
  }, [mapListeners]);

  // Clean map initialization with new architecture
  const containerRef = useRef<HTMLDivElement>(containerElement);

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

  const map = useApplicationMap({
    container: containerRef,
    provider,
    config: mapConfig,
    mapId: 'main-map', // User-controlled map identity
    events,
    plugins: [],
  });

  // Integrate MapPopover with legacy priority system
  useMapPopoverPriorityIntegration({
    map: map.underlying || map,
    popoverService,
    priority: 55,
    enabled: true,
  });

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

  // Apply default extent only if no URL position was used during map creation
  useMapEffect(
    map,
    (map) => {
      const mapInstance = map.underlying;
      if (!mapInstance) return;

      // Only set default extent if no position was applied during map creation
      if (!currentPosition) {
        const extent = configRepo.get().extent;
        if (extent) {
          mapInstance.fitBounds(extent, { animate: false });
          const center = mapInstance.getCenter();
          updatePosition({
            lat: center.lat,
            lng: center.lng,
            zoom: mapInstance.getZoom(),
          });
        }
      }
    },
    [], // Run once on map load
  );

  // Position tracking
  useMapPositionTracking(map, {
    onPositionChange: updatePosition,
    trackUserOnly: true,
    throttleMs: 0,
  });

  // Global map access
  useEffect(() => {
    const mapInstance = map.underlying;
    if (mapInstance && !globalThis.KONTUR_MAP) {
      globalThis.KONTUR_MAP = mapInstance;
      mapInstance.touchZoomRotate.disableRotation();
      (mapInstance as any).toJSON = () => '[Mapbox Object]';

      setTimeout(() => {
        requestAnimationFrame(() => mapInstance.resize());
      }, 1000);
    }
  }, [map]);

  // Auto-resize
  useEffect(() => {
    const mapInstance = map.underlying;
    if (!mapInstance) return;

    const resizeObserver = new ResizeObserver(() => mapInstance.resize());
    const mapContainer = mapInstance.getCanvasContainer();
    resizeObserver.observe(mapContainer);

    return () => resizeObserver.disconnect();
  }, [map]);

  // Layers manager
  useEffect(() => {
    const mapInstance = map.underlying;
    if (!mapInstance) return;

    layersOrderManager.init(mapInstance, mapLibreParentsIds, layersSettingsAtom);
    return () => layersOrderManager.destroy();
  }, [map]);

  return null; // Map renders into the container via MapLibre
}

export function ConnectedMap({ className }: { className?: string }) {
  return (
    <MapPopoverProvider registry={mapPopoverRegistry}>
      <Suspense fallback={<div className={className}>Loading map...</div>}>
        <MapContainer className={className} />
      </Suspense>
    </MapPopoverProvider>
  );
}
