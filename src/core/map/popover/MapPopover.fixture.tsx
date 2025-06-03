import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import mapLibre, { type Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapPopoverInteraction } from '../hooks/useMapPopoverInteraction';
import { useMapPopoverService, MapPopoverProvider } from './MapPopoverProvider';
import { MapPopoverServiceAdapter } from './MapPopoverServiceAdapter';
import { DefaultPopoverPositionCalculator } from '..';
import type { MapClickContext } from '../types';

// Shared Hook to initialize the map
function useMap(ref: React.RefObject<HTMLDivElement>) {
  const [map, setMap] = useState<Map | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const mapInstance = new mapLibre.Map({
      container: ref.current,
      style: 'https://demotiles.maplibre.org/styles/osm-bright-gl-style/style.json',
      center: [11.4, 47.25],
      zoom: 11,
    });

    mapInstance.on('load', () => {
      // Add a sample GeoJSON source and layer to make features clickable
      mapInstance.addSource('sample-geojson', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Null island', value: 123 },
              geometry: { type: 'Point', coordinates: [11.41, 47.25] },
            },
            {
              type: 'Feature',
              properties: { name: 'Another Point', value: 456, type: 'Important' },
              geometry: { type: 'Point', coordinates: [11.4, 47.252] },
            },
          ],
        },
      });
      mapInstance.addLayer({
        id: 'sample-geojson-points',
        type: 'circle',
        source: 'sample-geojson',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222',
        },
      });
      setMap(mapInstance);
    });

    return () => {
      mapInstance.remove();
    };
  }, [ref]);

  return map;
}

function formatFeatureDataForDefaultDemo(
  featureProperties: Record<string, any> | undefined,
): string {
  const properties = featureProperties || {};
  try {
    let str = JSON.stringify(properties);
    str = str.substring(1, Math.min(str.length - 1, 80)); // Avoid negative length if stringify is short
    return str.replaceAll('\","', '\n').replaceAll(/[\"}]/g, '');
  } catch (e) {
    return 'Error formatting properties';
  }
}

const defaultRenderContentCallback = (context: MapClickContext): React.ReactNode => {
  if (!context.features || context.features.length === 0) {
    return (
      <div style={{ padding: '10px', maxWidth: '250px' }}>
        <p>No features found at this location.</p>
        <p style={{ fontSize: '0.8em', marginTop: '5px' }}>
          Clicked at: {context.lngLat.lng.toFixed(4)}, {context.lngLat.lat.toFixed(4)}
        </p>
      </div>
    );
  }

  const featuresByLayer: Record<string, any[]> = {};
  context.features.forEach((feature) => {
    const layerId = feature.layer.id || 'unknown_layer';
    if (!featuresByLayer[layerId]) {
      featuresByLayer[layerId] = [];
    }
    featuresByLayer[layerId].push(feature);
  });

  return (
    <div style={{ padding: '10px', maxWidth: '250px' }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Map Features</h4>
      {Object.entries(featuresByLayer).map(([layerId, featuresInLayer], index) => (
        <dl key={layerId + '-' + index} style={{ marginBottom: '10px' }}>
          <dt style={{ backgroundColor: '#eee', padding: '2px 4px', fontWeight: 'bold' }}>
            Layer: {layerId}
          </dt>
          {featuresInLayer.map((feature, featureIndex) => (
            <dd
              key={featureIndex}
              style={{
                margin: '0 0 0 10px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                fontSize: '0.9em',
              }}
            >
              {formatFeatureDataForDefaultDemo(feature.properties)}
            </dd>
          ))}
        </dl>
      ))}
      <p
        style={{
          fontSize: '0.8em',
          marginTop: '10px',
          borderTop: '1px solid #eee',
          paddingTop: '5px',
        }}
      >
        Clicked at: {context.lngLat.lng.toFixed(4)}, {context.lngLat.lat.toFixed(4)}
      </p>
    </div>
  );
};

const customRenderContentCallback = (context: MapClickContext): React.ReactNode => {
  const features = context.features || [];

  return (
    <div
      style={{
        padding: '10px',
        maxWidth: '280px',
        border: '1px solid #ccc',
        background: '#fff',
      }}
    >
      <h3 style={{ margin: '0 0 5px 0', fontSize: '1em' }}>
        Custom Features ({features.length})
      </h3>
      {features.length === 0 ? (
        <p style={{ margin: 0, fontSize: '0.9em' }}>No features here.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {features.slice(0, 3).map((feature, index) => (
            <div
              key={feature.id || `feature-${index}`} // Use feature.id if available
              style={{
                padding: '5px',
                backgroundColor: '#f9f9f9',
                border: '1px solid #eee',
                fontSize: '0.8em',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>
                {feature.layer.id || 'Unknown Layer'}
              </div>
              <div>{Object.keys(feature.properties || {}).length} properties</div>
            </div>
          ))}
          {features.length > 3 && (
            <div style={{ textAlign: 'center', fontSize: '0.8em' }}>
              + {features.length - 3} more
            </div>
          )}
        </div>
      )}
      <p style={{ fontSize: '0.8em', marginTop: '5px' }}>
        Clicked at: {context.lngLat.lng.toFixed(4)}, {context.lngLat.lat.toFixed(4)}
      </p>
    </div>
  );
};

class CustomPositionCalculator extends DefaultPopoverPositionCalculator {
  constructor() {
    super({
      arrowWidth: 16,
      placementThreshold: 24,
      edgePadding: 10,
    });
  }
}

function CustomDemoContent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapRef);
  const popoverService = useMapPopoverService();

  const adaptedPopoverService = useMemo(
    () => new MapPopoverServiceAdapter(popoverService),
    [popoverService],
  );
  const positionCalculator = useMemo(() => new CustomPositionCalculator(), []);

  const { close } = useMapPopoverInteraction({
    map,
    popoverService: adaptedPopoverService,
    renderContent: customRenderContentCallback,
    positionCalculator,
    enabled: true,
    trackingDebounceMs: 32,
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        marginBottom: '20px',
      }}
    >
      <h4>Custom Popover Demo</h4>
      <div ref={mapRef} style={{ width: '100%', height: 'calc(100% - 30px)' }} />
      <button
        onClick={close}
        style={{ position: 'absolute', top: 5, right: 5, zIndex: 1 }}
      >
        Close Custom Popover
      </button>
    </div>
  );
}

function DefaultDemoContent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapRef);
  const popoverService = useMapPopoverService();

  const adaptedPopoverService = useMemo(
    () => new MapPopoverServiceAdapter(popoverService),
    [popoverService],
  );
  const positionCalculator = useMemo(() => new DefaultPopoverPositionCalculator(), []);

  const { close } = useMapPopoverInteraction({
    map,
    popoverService: adaptedPopoverService,
    renderContent: defaultRenderContentCallback,
    positionCalculator,
    enabled: true,
    trackingDebounceMs: 16,
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <h4>Default Popover Demo</h4>
      <div ref={mapRef} style={{ width: '100%', height: 'calc(100% - 30px)' }} />
      <button
        onClick={close}
        style={{ position: 'absolute', top: 5, right: 5, zIndex: 1 }}
      >
        Close Default Popover
      </button>
    </div>
  );
}

export default function MapDemos() {
  return (
    <MapPopoverProvider>
      <div style={{ padding: '20px' }}>
        <h1>Map Popover Demos</h1>
        <CustomDemoContent />
        <DefaultDemoContent />
      </div>
    </MapPopoverProvider>
  );
}
