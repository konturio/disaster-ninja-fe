import React from 'react';
import { MarkdownContent } from '~components/Overlays';
import { ProviderPriority } from '~core/map/types';
import type {
  IMapPopoverContentProvider,
  IMapPopoverProviderContext,
} from '~core/map/types';

export class GenericRendererPopoverProvider implements IMapPopoverContentProvider {
  readonly priority = ProviderPriority.NORMAL;

  constructor(
    private sourceId: string,
    private paramName: string,
    private tooltipType: string,
  ) {}

  renderContent(context: IMapPopoverProviderContext): React.ReactNode | null {
    const allFeatures = context.getFeatures();
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
