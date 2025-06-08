import React from 'react';
import Markdown from 'markdown-to-jsx';
import { parseLinksAsTags } from '~utils/markdown/parser';
import { LinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import s from '~components/Overlays/Overlays.module.css';
import type { IMapPopoverContentProvider } from '~core/map/types';
import type { MapMouseEvent } from 'maplibre-gl';

export class GenericRendererPopoverProvider implements IMapPopoverContentProvider {
  constructor(
    private sourceId: string,
    private paramName: string,
    private tooltipType: string,
  ) {}

  renderContent(mapEvent: MapMouseEvent): React.ReactNode | null {
    const allFeatures = mapEvent.target.queryRenderedFeatures(mapEvent.point);
    const thisLayersFeatures = allFeatures.filter((f) => f.source === this.sourceId);

    const featureProperties = thisLayersFeatures.find(
      (feature) => feature.properties?.[this.paramName],
    )?.properties;

    if (!featureProperties?.[this.paramName]) return null;

    const content = featureProperties[this.paramName];

    if (this.tooltipType === 'markdown') {
      // Simple markdown rendering - can be enhanced with proper markdown library later
      return (
        <Markdown options={{ overrides: { a: LinkRenderer } }} className={s.markdown}>
          {parseLinksAsTags(content)}
        </Markdown>
      );
    }

    return <div>{content}</div>;
  }
}
