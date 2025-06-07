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
import { DefaultMapPopoverPositionCalculator } from './MapPopoverPositionCalculator';
import { MapPopoverContentRegistry } from './MapPopoverContentRegistry';
import { useMapPopoverIntegration } from '../hooks/useMapPopoverIntegration';
import { useMapPositionTracker } from '../hooks/useMapPositionTracker';
import {
  UniLayoutContext,
  useUniLayoutContextValue,
} from '~components/Uni/Layout/UniLayoutContext';
import { UniLayoutRenderer } from '~components/Uni/Layout/UniLayoutRenderer';
import { hotProjectLayoutTemplate } from '~components/Uni/__mocks__/_hotLayout.js';
import { hotData } from '~core/api/__mocks__/_hotSampleData';
import type {
  MapClickContext,
  RenderPopoverContentFn,
  IMapPopoverContentProvider,
  MapPopoverOptions,
} from '../types';
import type { MapMouseEvent, MapGeoJSONFeature } from 'maplibre-gl';

interface FeatureInfoDisplayProps {
  features: MapGeoJSONFeature[];
  title?: string;
}

const FeatureInfoDisplay: React.FC<FeatureInfoDisplayProps> = ({ features, title }) => {
  if (!features || features.length === 0) {
    return <div>No features found.</div>;
  }

  return (
    <div>
      {title && <h4>{title}</h4>}
      <table cellSpacing={16}>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Type</th>
            <th>Properties</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index}>
              <td>{feature.layer.id}</td>
              <td>{feature.geometry.type}</td>
              <td>
                <pre>{JSON.stringify(feature.properties, null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

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
            paramName: 'name', // Use 'name' property from features
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

// DEPRECATED: This custom position tracking hook is no longer needed.
// Use useMapPopoverIntegration instead to eliminate duplication.

// Simple content rendering function
const defaultRenderContent = (context: MapClickContext) => {
  if (context.features && context.features.length > 0) {
    return <FeatureInfoDisplay features={context.features} title="Feature Info" />;
  }

  return (
    <div>
      <p>
        Clicked at: {context.lngLat.lng.toFixed(5)}, {context.lngLat.lat.toFixed(5)}
      </p>
      <p> No features found at this location </p>
    </div>
  );
};

const customRenderContent = (context: MapClickContext) => {
  return (
    <div>
      <h3>Custom Popover</h3>
      <p>
        Coordinates: {context.lngLat.lng.toFixed(4)}, {context.lngLat.lat.toFixed(4)}
      </p>
      <FeatureInfoDisplay features={context.features || []} title="Features" />
    </div>
  );
};

// Error handler example
const handlePopoverError = (errorInfo: { error: Error; context: MapClickContext }) => {
  console.error('Popover rendering error:', errorInfo.error);
  return (
    <div>
      <h4>Rendering Error</h4>
      <p>Failed to render popover content: {errorInfo.error.message}</p>
    </div>
  );
};

function DefaultDemo() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMapInstance(mapRef);
  const popoverService = useMapPopoverService();

  // Simplified integration using new hook - eliminates ~40 lines of boilerplate
  const { close } = useMapPopoverIntegration({
    map,
    popoverService,
    renderContent: defaultRenderContent,
  });

  return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
}

function EnhancedDemo() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMapInstance(mapRef);
  const popoverService = useMapPopoverService();
  const { startTracking, stopTracking } = useMapPositionTracker(map, {
    onPositionChange: (point) => popoverService.updatePosition(point),
  });

  // Service-based delegation with custom options
  useEffect(() => {
    if (!map) return;

    const handleMapClick = (event: MapMouseEvent) => {
      // Close existing popover
      if (popoverService.isOpen()) {
        popoverService.close();
        stopTracking();
      }

      try {
        const context: MapClickContext = {
          map,
          lngLat: event.lngLat,
          point: event.point,
          originalEvent: event,
          features: event.target.queryRenderedFeatures(event.point),
        };

        const content = customRenderContent(context);

        if (content) {
          // Convert map-relative coordinates to page coordinates
          const container = map.getContainer();
          const rect = container.getBoundingClientRect();
          const pagePoint = { x: rect.left + event.point.x, y: rect.top + event.point.y };

          popoverService.showWithContent(pagePoint, content, {
            placement: 'bottom',
            className: 'enhanced-demo-popover',
          });
          startTracking([event.lngLat.lng, event.lngLat.lat]);
        }
      } catch (error) {
        const errorContent = handlePopoverError({
          error: error as Error,
          context: {
            map,
            lngLat: event.lngLat,
            point: event.point,
            originalEvent: event,
            features: [],
          },
        });
        // Convert map-relative coordinates to page coordinates
        const container = map.getContainer();
        const rect = container.getBoundingClientRect();
        const pagePoint = { x: rect.left + event.point.x, y: rect.top + event.point.y };
        popoverService.showWithContent(pagePoint, errorContent);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
      stopTracking();
    };
  }, [map, popoverService, startTracking, stopTracking]);

  const handleClose = () => {
    popoverService.close();
    stopTracking();
  };

  return (
    <div style={{ margin: 32 }}>
      <h4>Enhanced Features: Custom Style + Error Handling</h4>
      <div ref={mapRef} style={{ width: '100%', height: '60vh' }} />
      <div>
        <button onClick={handleClose}>Close Popover</button>
      </div>
    </div>
  );
}

function Map1Component() {
  const map1Ref = useRef<HTMLDivElement>(null);
  const map1 = useMapInstance(map1Ref);
  const popoverService = useMapPopoverService();
  const { startTracking, stopTracking } = useMapPositionTracker(map1, {
    onPositionChange: (point) => popoverService.updatePosition(point),
  });

  useEffect(() => {
    if (!map1) return;

    const handleMapClick = (event: MapMouseEvent) => {
      if (popoverService.isOpen()) {
        popoverService.close();
        stopTracking();
      }

      const context: MapClickContext = {
        map: map1,
        lngLat: event.lngLat,
        point: event.point,
        originalEvent: event,
        features: event.target.queryRenderedFeatures(event.point),
      };

      const content = defaultRenderContent(context);
      if (content) {
        // Convert map-relative coordinates to page coordinates
        const container = map1.getContainer();
        const rect = container.getBoundingClientRect();
        const pagePoint = { x: rect.left + event.point.x, y: rect.top + event.point.y };
        popoverService.showWithContent(pagePoint, content);
        startTracking([event.lngLat.lng, event.lngLat.lat]);
      }
    };

    map1.on('click', handleMapClick);
    return () => {
      map1.off('click', handleMapClick);
      stopTracking();
    };
  }, [map1, popoverService, startTracking, stopTracking]);

  return <div ref={map1Ref} style={{ width: '100%', height: '30vh' }} />;
}

function Map2Component() {
  const map2Ref = useRef<HTMLDivElement>(null);
  const map2 = useMapInstance(map2Ref);
  const popoverService = useMapPopoverService();
  const { startTracking, stopTracking } = useMapPositionTracker(map2, {
    onPositionChange: (point) => popoverService.updatePosition(point),
  });

  useEffect(() => {
    if (!map2) return;

    const handleMapClick = (event: MapMouseEvent) => {
      if (popoverService.isOpen()) {
        popoverService.close();
        stopTracking();
      }

      const context: MapClickContext = {
        map: map2,
        lngLat: event.lngLat,
        point: event.point,
        originalEvent: event,
        features: event.target.queryRenderedFeatures(event.point),
      };

      const content = customRenderContent(context);
      if (content) {
        // Convert map-relative coordinates to page coordinates
        const container = map2.getContainer();
        const rect = container.getBoundingClientRect();
        const pagePoint = { x: rect.left + event.point.x, y: rect.top + event.point.y };
        popoverService.showWithContent(pagePoint, content);
        startTracking([event.lngLat.lng, event.lngLat.lat]);
      }
    };

    map2.on('click', handleMapClick);
    return () => {
      map2.off('click', handleMapClick);
      stopTracking();
    };
  }, [map2, popoverService, startTracking, stopTracking]);

  return <div ref={map2Ref} style={{ width: '100%', height: '30vh' }} />;
}

function MultiMapDemo() {
  return (
    <div style={{ margin: 32 }}>
      <h4>Multi-Map Support - Isolated Systems</h4>
      <div>
        <h5>Map 1 (Default Style) - Independent Popover</h5>
        <MapPopoverProvider>
          <Map1Component />
        </MapPopoverProvider>
      </div>
      <div>
        <h5>Map 2 (Custom Style) - Independent Popover</h5>
        <MapPopoverProvider>
          <Map2Component />
        </MapPopoverProvider>
      </div>
    </div>
  );
}

// Content Provider Demo using service-based delegation
class DemoContentProvider implements IMapPopoverContentProvider {
  renderContent(mapEvent: MapMouseEvent): React.ReactNode | null {
    const features = mapEvent.target.queryRenderedFeatures(mapEvent.point);

    if (!features || features.length === 0) {
      return <div>No features found</div>;
    }

    return <FeatureInfoDisplay features={features} title="Content Provider Demo" />;
  }

  getPopoverOptions(): MapPopoverOptions {
    return {
      placement: 'bottom',
      closeOnMove: true,
      className: 'demo-provider',
    };
  }
}

function ContentProviderDemo() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMapInstance(mapRef);
  const popoverService = useMapPopoverService();
  const { startTracking, stopTracking } = useMapPositionTracker(map, {
    onPositionChange: (point) => popoverService.updatePosition(point),
  });

  const registry = useMemo(() => {
    const reg = new MapPopoverContentRegistry();
    reg.register(new DemoContentProvider());
    return reg;
  }, []);

  // Service-based delegation with registry
  useEffect(() => {
    if (!map) return;

    const handleMapClick = (event: MapMouseEvent) => {
      if (popoverService.isOpen()) {
        popoverService.close();
        stopTracking();
      }

      // Use service's registry-based API
      const hasContent = popoverService.showWithEvent(event);

      if (hasContent) {
        startTracking([event.lngLat.lng, event.lngLat.lat]);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
      stopTracking();
    };
  }, [map, popoverService, startTracking, stopTracking]);

  return (
    <div>
      <h4>Content Provider Architecture Demo</h4>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '400px', border: '1px solid #ddd' }}
      />
      <p>Click on the red dots to see provider-generated content</p>
    </div>
  );
}

// Generic tooltip demo provider
class GenericTooltipDemoProvider implements IMapPopoverContentProvider {
  renderContent(mapEvent: MapMouseEvent): React.ReactNode | null {
    const features = mapEvent.target.queryRenderedFeatures(mapEvent.point);
    const demoFeatures = features.filter((f) => f.source === 'sample-features');

    if (demoFeatures.length === 0) {
      return null;
    }

    return (
      <div>
        <FeatureInfoDisplay features={demoFeatures} title="Generic Tooltip Demo" />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          This tooltip is rendered by the registry-based provider system
        </div>
      </div>
    );
  }

  getPopoverOptions(): MapPopoverOptions {
    return {
      placement: 'top',
      closeOnMove: false,
      className: 'generic-tooltip-demo',
    };
  }
}

function GenericTooltipDemo() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMapInstance(mapRef);
  const popoverService = useMapPopoverService();
  const { startTracking, stopTracking } = useMapPositionTracker(map, {
    onPositionChange: (point) => popoverService.updatePosition(point),
  });

  const registry = useMemo(() => {
    const reg = new MapPopoverContentRegistry();
    reg.register(new GenericTooltipDemoProvider());
    return reg;
  }, []);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (event: MapMouseEvent) => {
      if (popoverService.isOpen()) {
        popoverService.close();
        stopTracking();
      }

      const hasContent = popoverService.showWithEvent(event);
      if (hasContent) {
        startTracking([event.lngLat.lng, event.lngLat.lat]);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
      stopTracking();
    };
  }, [map, popoverService, startTracking, stopTracking]);

  return (
    <div>
      <h4>Generic Tooltip Content Provider Demo</h4>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '400px', border: '1px solid #ddd' }}
      />
      <p>Click on the red dots to see tooltip provider content (using layer metadata)</p>
      <div
        style={{
          marginTop: '10px',
          padding: '8px',
          backgroundColor: '#f0f8ff',
          borderRadius: '4px',
        }}
      >
        Generic tooltips use content provider architecture. This provider reads layer
        metadata tooltip configuration and renders markdown content.
      </div>
    </div>
  );
}

function HotProjectCardDemo() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMapInstance(mapRef);
  const popoverService = useMapPopoverService();
  const { startTracking, stopTracking } = useMapPositionTracker(map, {
    onPositionChange: (point) => popoverService.updatePosition(point),
  });

  const handleAction = (action: string, payload: any) => {
    console.info('HOT Project Card action triggered:', action, payload);
    alert(`Action triggered: ${action}\nPayload: ${JSON.stringify(payload)}`);
  };

  const contextValue = useUniLayoutContextValue({
    layout: hotProjectLayoutTemplate,
    actionHandler: handleAction,
  });

  const renderHotProjectCard = (context: MapClickContext) => {
    if (context.features && context.features.length > 0) {
      const projectData = Array.isArray(hotData) ? hotData[0] : hotData;

      return (
        <UniLayoutContext.Provider value={contextValue}>
          <div style={{ maxWidth: '400px', minWidth: '300px' }}>
            <h3>HOT Projects provider:</h3>
            <UniLayoutRenderer node={hotProjectLayoutTemplate} data={projectData} />
          </div>
          <hr />
          <FeatureInfoDisplay
            features={context.features}
            title="Layers Features provider:"
          />
          <h5>
            Features ({context.features?.length || 0}) in [{context.lngLat.lng.toFixed(4)}
            ,{context.lngLat.lat.toFixed(4)}]
          </h5>
        </UniLayoutContext.Provider>
      );
    }

    return null;
  };

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (event: MapMouseEvent) => {
      if (popoverService.isOpen()) {
        popoverService.close();
        stopTracking();
      }

      const context: MapClickContext = {
        map,
        lngLat: event.lngLat,
        point: event.point,
        originalEvent: event,
        features: event.target.queryRenderedFeatures(event.point),
      };

      const content = renderHotProjectCard(context);
      if (content) {
        // Convert map-relative coordinates to page coordinates
        const container = map.getContainer();
        const rect = container.getBoundingClientRect();
        const pagePoint = { x: rect.left + event.point.x, y: rect.top + event.point.y };
        popoverService.showWithContent(pagePoint, content);
        startTracking([event.lngLat.lng, event.lngLat.lat]);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
      stopTracking();
    };
  }, [map, popoverService, startTracking, stopTracking]);

  return (
    <div>
      <h4>HOT Project Card in Popover Demo</h4>
      <div ref={mapRef} style={{ width: '100%', height: '60vh' }} />
      <div>
        This demo shows how Uni layout cards can be rendered inside map popovers. The
        cards are fully interactive with action handlers.
      </div>
    </div>
  );
}

// Debug demo to showcase KONTUR_DEBUG functionality
function DebugDemo() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMapInstance(mapRef);
  const popoverService = useMapPopoverService();
  const { startTracking, stopTracking } = useMapPositionTracker(map, {
    onPositionChange: (point) => popoverService.updatePosition(point),
  });
  const [debugEnabled, setDebugEnabled] = useState(() => {
    return localStorage.getItem('KONTUR_DEBUG') === 'true';
  });

  const toggleDebug = () => {
    const newValue = !debugEnabled;
    if (newValue) {
      localStorage.setItem('KONTUR_DEBUG', 'true');
    } else {
      localStorage.removeItem('KONTUR_DEBUG');
    }
    setDebugEnabled(newValue);
    // Force page reload to activate/deactivate debug provider
    window.location.reload();
  };

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (event: MapMouseEvent) => {
      if (popoverService.isOpen()) {
        popoverService.close();
        stopTracking();
      }

      // When debug is enabled, the DebugMapPopoverProvider should be auto-registered
      // and handle content via showWithEvent
      const hasContent = popoverService.showWithEvent(event);

      if (hasContent) {
        startTracking([event.lngLat.lng, event.lngLat.lat]);
      } else if (!debugEnabled) {
        // Fallback content when debug is not enabled
        const context: MapClickContext = {
          map,
          lngLat: event.lngLat,
          point: event.point,
          originalEvent: event,
          features: event.target.queryRenderedFeatures(event.point),
        };
        const content = defaultRenderContent(context);
        // Convert map-relative coordinates to page coordinates
        const container = map.getContainer();
        const rect = container.getBoundingClientRect();
        const pagePoint = { x: rect.left + event.point.x, y: rect.top + event.point.y };
        popoverService.showWithContent(pagePoint, content);
        startTracking([event.lngLat.lng, event.lngLat.lat]);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
      stopTracking();
    };
  }, [map, popoverService, startTracking, stopTracking, debugEnabled]);

  return (
    <div>
      <h4>Debug MapPopover Demo</h4>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={toggleDebug}>
          {debugEnabled ? 'Disable' : 'Enable'} Debug Mode (KONTUR_DEBUG)
        </button>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Current state: {debugEnabled ? 'ENABLED' : 'DISABLED'}
          {debugEnabled && ' - Debug provider should show comprehensive feature info'}
        </div>
      </div>
      <div ref={mapRef} style={{ width: '100%', height: '60vh' }} />
      <div
        style={{
          marginTop: '10px',
          padding: '8px',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
        }}
      >
        <strong>Debug Mode:</strong> When enabled, clicking on the map will show detailed
        feature information including layer details, source information, geometry type,
        and all properties in a structured format. This uses the DebugMapPopoverProvider
        that activates when KONTUR_DEBUG is set to 'true'.
      </div>
    </div>
  );
}

export default {
  'Service-Based API': () => (
    <MapPopoverProvider>
      <DefaultDemo />
    </MapPopoverProvider>
  ),
  'Enhanced Features': () => (
    <MapPopoverProvider>
      <EnhancedDemo />
    </MapPopoverProvider>
  ),
  'Multi-Map Support': () => <MultiMapDemo />,
  'Content Provider': () => (
    <MapPopoverProvider>
      <ContentProviderDemo />
    </MapPopoverProvider>
  ),
  'Generic Tooltip Content Provider': () => (
    <MapPopoverProvider>
      <GenericTooltipDemo />
    </MapPopoverProvider>
  ),
  'HOT Project Card Popover': () => (
    <MapPopoverProvider>
      <HotProjectCardDemo />
    </MapPopoverProvider>
  ),
  'Debug MapPopover': () => (
    <MapPopoverProvider>
      <DebugDemo />
    </MapPopoverProvider>
  ),
};
