import React from 'react';
import { ProviderPriority } from '../types';
import type { IMapPopoverContentProvider, IMapPopoverProviderContext } from '../types';

// type: "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon" | "GeometryCollection"
const GeometryTypeIcon = {
  Point: '📍',
  MultiPoint: '[📍]',
  LineString: '📏',
  MultiLineString: '[📏]',
  Polygon: '⭔',
  MultiPolygon: '[⭔]',
  GeometryCollection: '🗺️',
};

/**
 * Debug content provider that dumps all found features properties.
 */
export class DebugMapPopoverProvider implements IMapPopoverContentProvider {
  readonly priority = ProviderPriority.DEBUG;

  renderContent(context: IMapPopoverProviderContext): React.ReactNode | null {
    const features = context.getFeatures();
    const { mapEvent } = context;

    return (
      <div>
        <h4>Features Inspector: Found {features.length} feature(s)</h4>
        <p>
          <strong>Coordinates:</strong> {mapEvent.lngLat.lng.toFixed(6)},{' '}
          {mapEvent.lngLat.lat.toFixed(6)} <br />
          <strong>Screen Point:</strong> x: {mapEvent.point.x}, y: {mapEvent.point.y}
        </p>

        {features.map((feature, index) => (
          <div
            key={index}
            style={{ margin: '8px 0', padding: 8, backgroundColor: '#eee' }}
          >
            <details>
              <summary>
                <b title={feature.geometry?.type}>
                  {GeometryTypeIcon[feature.geometry?.type] ||
                    feature.geometry?.type ||
                    '?'}
                </b>
                <strong> Source Layer:</strong> {feature?.sourceLayer}
              </summary>
              <ul>
                <li>
                  <strong>Layer:</strong> {feature.layer?.id || 'unknown'}
                </li>
                <li>
                  <strong>Source:</strong> {feature.source || 'unknown'}
                </li>
              </ul>
              <pre>{JSON.stringify(feature?.properties, null, 2)}</pre>
            </details>
          </div>
        ))}
      </div>
    );
  }
}
