import React from 'react';
import type {
  IMapPopoverContentProvider,
  IMapPopoverContentRegistry,
  MapPopoverOptions,
} from '../types';
import type { MapMouseEvent } from 'maplibre-gl';

export class MapPopoverContentRegistry implements IMapPopoverContentRegistry {
  private providers: IMapPopoverContentProvider[] = [];

  register(provider: IMapPopoverContentProvider): void {
    if (!this.providers.includes(provider)) {
      this.providers.push(provider);
    }
  }

  unregister(provider: IMapPopoverContentProvider): void {
    const index = this.providers.indexOf(provider);
    if (index > -1) {
      this.providers.splice(index, 1);
    }
  }

  renderContent(mapEvent: MapMouseEvent): {
    content: React.ReactNode;
    options?: MapPopoverOptions;
  } | null {
    const content: React.ReactNode[] = [];
    for (const provider of this.providers) {
      try {
        const providerContent = provider.renderContent(mapEvent);
        if (providerContent) {
          content.push(
            React.createElement('div', { key: content.length }, providerContent),
          );
        }
      } catch (error) {
        console.error('Error in content provider:', error);
        // Continue to next provider on error
      }
    }
    return { content };
  }

  get providerCount(): number {
    return this.providers.length;
  }

  clear(): void {
    this.providers = [];
  }
}
