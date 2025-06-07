import React from 'react';
import type { IMapPopoverContentProvider, MapPopoverOptions } from '~core/map/types';
import type { MapMouseEvent } from 'maplibre-gl';

export class GenericRendererPopoverProvider implements IMapPopoverContentProvider {
  constructor(
    private sourceId: string,
    private paramName: string,
    private tooltipType: string,
  ) {}

  renderContent(mapEvent: MapMouseEvent): React.ReactNode | null {
    const allFeatures = mapEvent.target.queryRenderedFeatures(mapEvent.point);
    const thisLayersFeatures = allFeatures.filter((f) =>
      f.source.includes(this.sourceId),
    );

    const featureProperties = thisLayersFeatures.find(
      (feature) => feature.properties?.[this.paramName],
    )?.properties;

    if (!featureProperties?.[this.paramName]) return null;

    const content = featureProperties[this.paramName];

    if (this.tooltipType === 'markdown') {
      // Simple markdown rendering - can be enhanced with proper markdown library later
      return (
        <div
          style={{ maxWidth: '300px' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    return <div>{content}</div>;
  }

  getPopoverOptions(): MapPopoverOptions {
    return {
      placement: 'top',
      closeOnMove: false,
      className: 'generic-renderer-tooltip',
    };
  }
}
