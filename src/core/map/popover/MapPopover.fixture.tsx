import React, { useMemo, useEffect, useCallback } from 'react';
import { type Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPopoverProvider, useMapPopoverService } from './MapPopoverProvider';
import { mapPopoverRegistry } from './globalMapPopoverRegistry';
import { DebugMapPopoverProvider } from './DebugMapPopoverProvider';
import { useMapPopoverMaplibreIntegration } from '../hooks/useMapPopoverMaplibreIntegration';
import {
  UniLayoutContext,
  useUniLayoutContextValue,
} from '~components/Uni/Layout/UniLayoutContext';
import { UniLayoutRenderer } from '~components/Uni/Layout/UniLayoutRenderer';
import { hotProjectLayoutTemplate } from '~components/Uni/__mocks__/_hotLayout.js';
import { hotData } from '~core/api/__mocks__/_hotSampleData';
import type { IMapPopoverContentProvider, IMapPopoverProviderContext } from '../types';
import { ProviderPriority } from '../types';
import {
  MapLibreContainer,
  MapOptions,
} from '~components/ConnectedMap/MapLibreContainer';

// Map container component with ref callback pattern
function FixtureMapContainer({
  children,
  onMapReady,
}: {
  children?: ((map: Map) => React.ReactNode) | React.ReactNode;
  onMapReady?: (map: Map) => void;
}) {
  const mapOptions: MapOptions = useMemo(
    () => ({
      getConfig: () => ({
        style: 'https://demotiles.maplibre.org/styles/osm-bright-gl-style/style.json',
        center: [11.4, 47.25],
        zoom: 11,
      }),
      onMapCreated: (mapInstance) => {
        mapInstance.once('style.load', () => {
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
        });
        onMapReady?.(mapInstance);
      },
      onMapDestroy: (mapInstance) => {
        try {
          if (mapInstance.style) {
            mapInstance.removeLayer('sample-points');
            mapInstance.removeSource('sample-features');
          }
        } catch (error) {
          console.warn('Failed to cleanup map resources:', error);
        }
      },
    }),
    [],
  );
  const _st = `.map-container{flex-grow:1;}`;
  return (
    <>
      <style>{_st}</style>
      <MapLibreContainer options={mapOptions} className="map-container">
        {(map: Map) => (typeof children === 'function' ? children(map) : children)}
      </MapLibreContainer>
    </>
  );
}

// Simple provider that shows basic feature info
class SimpleFeatureProvider implements IMapPopoverContentProvider {
  readonly priority = ProviderPriority.NORMAL;
  private enabled = true;

  renderContent(context: IMapPopoverProviderContext): React.ReactNode | null {
    if (!this.enabled) return null;

    const { mapEvent, onClose } = context;

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

function MapIntegration({
  map,
  providers,
}: {
  map: Map;
  providers: { id: string; provider: IMapPopoverContentProvider }[];
}) {
  const popoverService = useMapPopoverService();

  useEffect(() => {
    providers.forEach(({ id, provider }) => {
      mapPopoverRegistry.register(id, provider);
    });
    return () => {
      providers.forEach(({ id }) => mapPopoverRegistry.unregister(id));
    };
  }, [providers]);

  useMapPopoverMaplibreIntegration({ map, popoverService });

  return null;
}

function DefaultDemo() {
  const simpleProvider = useMemo(() => new SimpleFeatureProvider(), []);
  const providers = useMemo(
    () => [{ id: 'simple', provider: simpleProvider }],
    [simpleProvider],
  );
  return (
    <FixtureMapContainer>
      {(map: Map) => <MapIntegration map={map} providers={providers} />}
    </FixtureMapContainer>
  );
}

function DebugProviderDemo() {
  const debugProvider = useMemo(() => new DebugMapPopoverProvider(), []);
  const providers = useMemo(
    () => [{ id: 'debug', provider: debugProvider }],
    [debugProvider],
  );

  return (
    <FixtureMapContainer>
      {(map: Map) => <MapIntegration map={map} providers={providers} />}
    </FixtureMapContainer>
  );
}

function HotProjectIntegration({ map }: { map: Map }) {
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
    (): IMapPopoverContentProvider => ({
      priority: ProviderPriority.HIGH,
      renderContent: (context: IMapPopoverProviderContext) => {
        const features = context
          .getFeatures()
          .filter((f) => f.source === 'hot-project-layers');
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
    [],
  );

  // Also add debug provider for better development experience
  const debugProvider = useMemo(() => new DebugMapPopoverProvider(), []);

  const providers = useMemo(
    () => [
      { id: 'hot-project', provider: hotProjectProvider },
      { id: 'debug', provider: debugProvider },
    ],
    [],
  );

  // Map setup
  useEffect(() => {
    map.once('style.load', () => {
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
    });

    return () => {
      // Clean up map layers and sources
      try {
        if (map.style) {
          map.removeLayer('hot-project-points');
          map.removeSource('hot-project-layers');
        }
      } catch (error) {
        // Layer or source may not exist, ignore cleanup errors
      }
    };
  }, [map]);

  return <MapIntegration map={map} providers={providers} />;
}

function HotProjectCardDemo() {
  return (
    <FixtureMapContainer>
      {(map: Map) => <HotProjectIntegration map={map} />}
    </FixtureMapContainer>
  );
}

export default {
  DefaultDemo: (
    <MapPopoverProvider registry={mapPopoverRegistry}>
      <DefaultDemo />
    </MapPopoverProvider>
  ),
  DebugProviderDemo: (
    <MapPopoverProvider registry={mapPopoverRegistry}>
      <DebugProviderDemo />
    </MapPopoverProvider>
  ),
  HotProjectCardDemo: (
    <MapPopoverProvider registry={mapPopoverRegistry}>
      <HotProjectCardDemo />
    </MapPopoverProvider>
  ),
};
