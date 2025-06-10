import React from 'react';
import { MarkdownContent } from '~components/Overlays';
import type { IMapPopoverContentProvider } from '~core/map/types';
import type { MapMouseEvent } from 'maplibre-gl';

export class GenericRendererPopoverProvider implements IMapPopoverContentProvider {
  constructor(
    private sourceId: string,
    private paramName: string,
    private tooltipType: string,
  ) {}

  renderContent(mapEvent: MapMouseEvent, onClose: () => void): React.ReactNode | null {
    const allFeatures = mapEvent.target.queryRenderedFeatures(mapEvent.point);
    const thisLayersFeatures = allFeatures.filter((f) => f.source === this.sourceId);

    const featureProperties = thisLayersFeatures.find(
      (feature) => feature.properties?.[this.paramName],
    )?.properties;

    if (!featureProperties?.[this.paramName]) return null;

    const content = featureProperties[this.paramName];

    if (this.tooltipType === 'markdown') {
      return <MarkdownContent content={content} />;
    }

    return <div>{content}</div>;
  }
}
