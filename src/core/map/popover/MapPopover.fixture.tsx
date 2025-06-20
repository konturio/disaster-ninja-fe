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
import type { IMapPopoverContentProvider } from '../types';
import type { MapMouseEvent } from 'maplibre-gl';

// Map container component with ref callback pattern
function MapContainer({
  children,
  onMapReady,
}: {
  children?: ((map: Map) => React.ReactNode) | React.ReactNode;
  onMapReady?: (map: Map) => void;
}) {
  const [map, setMap] = useState<Map | null>(null);

  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && !map) {
        const mapInstance = new mapLibre.Map({
          container: node,
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
                  properties: {
                    name: 'Another Point',
                    category: 'Important',
                    value: 456,
                  },
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
          onMapReady?.(mapInstance);
        });
      }
    },
    [map, onMapReady],
  );

  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [map]);

  return (
    <div ref={handleRef} style={{ width: '100%', height: '100vh' }}>
      {map && (typeof children === 'function' ? children(map) : children)}
    </div>
  );
}

// Simple provider that shows basic feature info
class SimpleFeatureProvider implements IMapPopoverContentProvider {
  private enabled = true;

  renderContent(mapEvent: MapMouseEvent, onClose: () => void): React.ReactNode | null {
    if (!this.enabled) return null;

    return (
      <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '4px' }}>
        <h4>Simple Provider</h4>
        <p>
          Click position: {mapEvent.point.x}, {mapEvent.point.y}
        </p>
        <p>
          Coordinates: {mapEvent.lngLat.lat.toFixed(4)}, {mapEvent.lngLat.lng.toFixed(4)}
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

class DebugProvider implements IMapPopoverContentProvider {
  private counter = 0;

  renderContent(mapEvent: MapMouseEvent, onClose: () => void): React.ReactNode | null {
    this.counter++;
    const features = mapEvent.target?.queryRenderedFeatures?.(mapEvent.point) || [];

    return (
      <div style={{ padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <h4>Debug Provider (#{this.counter})</h4>
        <p>Features found: {features.length}</p>
        {features.length > 0 && (
          <details>
            <summary>Feature details</summary>
            <pre style={{ fontSize: '10px', maxHeight: '200px', overflow: 'auto' }}>
              {JSON.stringify(features[0].properties, null, 2)}
            </pre>
          </details>
        )}
        <button onClick={onClose}>Close Debug</button>
      </div>
    );
  }
}

function MapIntegration({ map }: { map: Map }) {
  const popoverService = useMapPopoverService();
  const registry = useMemo(() => new MapPopoverContentRegistry(), []);
  const simpleProvider = useMemo(() => new SimpleFeatureProvider(), []);

  useEffect(() => {
    registry.register('simple', simpleProvider);
    return () => registry.unregister('simple');
  }, [registry, simpleProvider]);

  useMapPopoverMaplibreIntegration({ map, popoverService });

  return null;
}

function DefaultDemo() {
  return <MapContainer>{(map: Map) => <MapIntegration map={map} />}</MapContainer>;
}

function DebugMapIntegration({ map }: { map: Map }) {
  const popoverService = useMapPopoverService();
  const registry = useMemo(() => new MapPopoverContentRegistry(), []);
  const debugProvider = useMemo(() => new DebugMapPopoverProvider(), []);

  useEffect(() => {
    registry.register('debug', debugProvider);
    return () => registry.unregister('debug');
  }, [registry, debugProvider]);

  useMapPopoverMaplibreIntegration({ map, popoverService });

  return null;
}

function DebugProviderDemo() {
  return <MapContainer>{(map: Map) => <DebugMapIntegration map={map} />}</MapContainer>;
}

function HotProjectIntegration({ map }: { map: Map }) {
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

  // Create hot project provider
  const hotProjectProvider = useMemo(
    () => ({
      renderContent: (mapEvent: MapMouseEvent, onClose: () => void) => {
        const features =
          mapEvent.target
            ?.queryRenderedFeatures?.(mapEvent.point)
            ?.filter((f) => f.source === 'hot-project-layers') || [];
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
    }),
    [uniLayoutContextValue],
  );

  // Also add debug provider for better development experience
  const debugProvider = useMemo(() => new DebugMapPopoverProvider(), []);

  // Map setup and provider registration
  useEffect(() => {
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
    registry.register('hot-project', hotProjectProvider);
    registry.register('debug', debugProvider);

    return () => {
      registry.unregister('hot-project');
      registry.unregister('debug');

      // Clean up map layers and sources
      if (map.getLayer('hot-project-points')) {
        map.removeLayer('hot-project-points');
      }
      if (map.getSource('hot-project-layers')) {
        map.removeSource('hot-project-layers');
      }
    };
  }, [map, registry, hotProjectProvider, debugProvider]);

  useMapPopoverMaplibreIntegration({ map, popoverService });

  return null;
}

function HotProjectCardDemo() {
  return <MapContainer>{(map: Map) => <HotProjectIntegration map={map} />}</MapContainer>;
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
