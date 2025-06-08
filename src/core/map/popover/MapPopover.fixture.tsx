import React, {
  useRef,
  useMemo,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react';
import mapLibre, { type Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPopoverProvider, useMapPopoverService } from './MapPopoverProvider';
import { MapPopoverContentRegistry } from './MapPopoverContentRegistry';
import { DebugMapPopoverProvider } from './DebugMapPopoverProvider';
import { useMapPopoverMaplibreIntegration } from '../hooks/useMapPopoverMaplibreIntegration';
import {
  UniLayoutContext,
  useUniLayoutContextValue,
} from '~components/Uni/Layout/UniLayoutContext';
import { UniLayoutRenderer } from '~components/Uni/Layout/UniLayoutRenderer';
import { hotProjectLayoutTemplate } from '~components/Uni/__mocks__/_hotLayout.js';
import { hotData } from '~core/api/__mocks__/_hotSampleData';
import type { MapClickContext } from '../types';
import type { MapMouseEvent } from 'maplibre-gl';
import { screenPointToMapContainerPoint } from './coordinateConverter';

// Simple map initialization hook
function useMapInstance(containerRef: React.RefObject<HTMLDivElement>) {
  const [map, setMap] = useState<Map | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const mapInstance = new mapLibre.Map({
      container: containerRef.current,
      style: 'https://demotiles.maplibre.org/styles/osm-bright-gl-style/style.json',
      center: [11.4, 47.25],
      zoom: 11,
    });

    mapInstance.on('load', () => {
      // Add sample features for testing
      mapInstance.addSource('sample-features', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Sample Point', type: 'Demo', value: 123 },
              geometry: { type: 'Point', coordinates: [11.41, 47.25] },
            },
            {
              type: 'Feature',
              properties: { name: 'Another Point', category: 'Important', value: 456 },
              geometry: { type: 'Point', coordinates: [11.4, 47.252] },
            },
          ],
        },
      });

      mapInstance.addLayer({
        id: 'sample-points',
        type: 'circle',
        source: 'sample-features',
        paint: {
          'circle-radius': 8,
          'circle-color': '#ff4444',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
        metadata: {
          tooltip: {
            type: 'markdown',
            paramName: 'name',
          },
        },
      });

      setMap(mapInstance);
    });

    return () => {
      mapInstance.remove();
      setMap(null);
    };
  }, [containerRef]);

  return map;
}

// Stable content rendering function for fallback
function defaultRenderContent(context: MapClickContext) {
  if (context.features && context.features.length > 0) {
    return (
      <div>
        <h4>Simple Feature Info</h4>
        <p>Found {context.features.length} feature(s)</p>
        <p>
          Coordinates: {context.lngLat.lng.toFixed(5)}, {context.lngLat.lat.toFixed(5)}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p>
        Clicked at: {context.lngLat.lng.toFixed(5)}, {context.lngLat.lat.toFixed(5)}
      </p>
      <p>No features found at this location</p>
    </div>
  );
}

function DefaultDemo() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMapInstance(mapRef);
  const popoverService = useMapPopoverService();

  useMapPopoverMaplibreIntegration({
    map,
    popoverService,
    renderContent: defaultRenderContent,
  });

  return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
}

function DebugProviderDemo() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMapInstance(mapRef);
  const popoverService = useMapPopoverService();
  const registry = useMemo(() => new MapPopoverContentRegistry(), []);

  // Reuse existing DebugMapPopoverProvider - much better than custom implementation
  const debugProvider = useMemo(() => new DebugMapPopoverProvider(), []);

  useEffect(() => {
    if (map && debugProvider) {
      registry.register(debugProvider);
      return () => {
        registry.unregister(debugProvider);
      };
    }
  }, [map, registry, debugProvider]);

  useMapPopoverMaplibreIntegration({
    map,
    popoverService,
    registry,
  });

  return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
}

function HotProjectCardDemo() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMapInstance(mapRef);
  const popoverService = useMapPopoverService();
  const registry = useMemo(() => new MapPopoverContentRegistry(), []);

  // Stable action handler
  const handleAction = useCallback((action: string, payload: any) => {
    alert(`Action: ${action}, Payload: ${JSON.stringify(payload)}`);
  }, []);

  // Stable layout context value
  const uniLayoutContextValue = useUniLayoutContextValue({
    layout: hotProjectLayoutTemplate,
    actionHandler: handleAction,
  });

  // Stable render function using useCallback
  const renderHotProjectCard = useCallback(
    (mapEvent: MapMouseEvent) => {
      if (!map) return null;

      const context: MapClickContext = {
        map,
        lngLat: mapEvent.lngLat,
        point: screenPointToMapContainerPoint(mapEvent.point),
        features: mapEvent.target.queryRenderedFeatures(mapEvent.point),
        originalEvent: mapEvent,
      };

      const features =
        context.features?.filter((f) => f.source === 'hot-project-layers') || [];
      if (features.length === 0) return null;

      const feature = features[0];
      if (!feature || !feature.properties) return null;

      const data = hotData.find((d) => d.projectId === feature.properties!.projectId);
      if (!data) return null;

      return (
        <UniLayoutContext.Provider value={uniLayoutContextValue}>
          <UniLayoutRenderer node={hotProjectLayoutTemplate} data={data} />
        </UniLayoutContext.Provider>
      );
    },
    [map, uniLayoutContextValue],
  );

  // Create stable content provider
  const hotProjectProvider = useMemo(
    () => ({
      renderContent: renderHotProjectCard,
      getPopoverOptions: () => ({ placement: 'top' as const }),
    }),
    [renderHotProjectCard],
  );

  // Also add debug provider for better development experience
  const debugProvider = useMemo(() => new DebugMapPopoverProvider(), []);

  // Map setup and provider registration
  useEffect(() => {
    if (!map) return;

    // Check if source already exists before adding
    if (!map.getSource('hot-project-layers')) {
      // Add hot project data
      map.addSource('hot-project-layers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { id: '1', name: 'Hot Project 5522', projectId: 5522 },
              geometry: { type: 'Point', coordinates: [11.41, 47.25] },
            },
            {
              type: 'Feature',
              properties: { id: '2', name: 'Hot Project 9165', projectId: 9165 },
              geometry: { type: 'Point', coordinates: [11.4, 47.252] },
            },
          ],
        },
      });
    }

    // Check if layer already exists before adding
    if (!map.getLayer('hot-project-points')) {
      map.addLayer({
        id: 'hot-project-points',
        type: 'circle',
        source: 'hot-project-layers',
        paint: {
          'circle-radius': 10,
          'circle-color': '#00b8d9',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      });
    }

    // Register both providers - hot project has priority, debug as fallback
    registry.register(hotProjectProvider);
    registry.register(debugProvider);

    return () => {
      registry.unregister(hotProjectProvider);
      registry.unregister(debugProvider);

      // Clean up map layers and sources
      if (map.getLayer('hot-project-points')) {
        map.removeLayer('hot-project-points');
      }
      if (map.getSource('hot-project-layers')) {
        map.removeSource('hot-project-layers');
      }
    };
  }, [map, registry, hotProjectProvider, debugProvider]);

  useMapPopoverMaplibreIntegration({
    map,
    popoverService,
    registry,
  });

  return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
}

export default {
  DefaultDemo: (
    <MapPopoverProvider>
      <DefaultDemo />
    </MapPopoverProvider>
  ),
  DebugProviderDemo: (
    <MapPopoverProvider>
      <DebugProviderDemo />
    </MapPopoverProvider>
  ),
  HotProjectCardDemo: (
    <MapPopoverProvider>
      <HotProjectCardDemo />
    </MapPopoverProvider>
  ),
};
