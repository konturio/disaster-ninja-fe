import React from 'react';
import type { IMapPopoverContentProvider, MapPopoverOptions } from '../types';
import type { MapMouseEvent } from 'maplibre-gl';

/**
 * Debug content provider that dumps all found features properties.
 */
export class DebugMapPopoverProvider implements IMapPopoverContentProvider {
  renderContent(mapEvent: MapMouseEvent): React.ReactNode | null {
    const features = mapEvent.target?.queryRenderedFeatures?.(mapEvent.point) || [];

    if (features.length === 0) {
      return (
        <div>
          <h4>Features Inspector: No features found</h4>
          <p>
            <strong>Coordinates:</strong> {mapEvent.lngLat.lng.toFixed(6)},{' '}
            {mapEvent.lngLat.lat.toFixed(6)}
          </p>
          <p>
            <strong>Screen Point:</strong> x: {mapEvent.point.x}, y: {mapEvent.point.y}
          </p>
        </div>
      );
    }

    return (
      <div>
        <h4>Features Inspector: Found {features.length} feature(s)</h4>
        <p>
          <strong>Coordinates:</strong> {mapEvent.lngLat.lng.toFixed(6)},{' '}
          {mapEvent.lngLat.lat.toFixed(6)}
        </p>

        {features.map((feature, index) => (
          <div
            key={index}
            style={{ margin: '8px 0', padding: 8, backgroundColor: '#eee' }}
          >
            <details>
              <summary>
                #{index + 1} <strong>Source Layer:</strong> {feature?.sourceLayer}
              </summary>
              <ul>
                <li>
                  <strong>Layer:</strong> {feature.layer?.id || 'unknown'}
                </li>
                <li>
                  <strong>Source:</strong> {feature.source || 'unknown'}
                </li>
                <li>
                  <strong>Geometry Type:</strong> {feature.geometry?.type || 'unknown'}
                </li>
              </ul>
              <pre>{JSON.stringify(feature?.properties, null, 2)}</pre>
            </details>
          </div>
        ))}
      </div>
    );
  }

  getPopoverOptions?(mapEvent: MapMouseEvent): MapPopoverOptions {
    return {
      placement: 'top',
      closeOnMove: false,
    };
  }
}
