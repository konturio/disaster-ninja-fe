import React from 'react';
import type { IMapPopoverContentProvider, IMapPopoverContentRegistry } from '../types';
import type { MapMouseEvent } from 'maplibre-gl';

export class MapPopoverContentRegistry implements IMapPopoverContentRegistry {
  private providers = new Map<string, IMapPopoverContentProvider>();

  register(id: string, provider: IMapPopoverContentProvider): void {
    if (this.providers.has(id)) {
      console.warn(`MapPopover provider "${id}" already registered, replacing`);
    }
    this.providers.set(id, provider);
  }

  unregister(id: string): void {
    this.providers.delete(id);
  }

  renderContent(mapEvent: MapMouseEvent, onClose: () => void): React.ReactNode | null {
    const contentElements: React.ReactNode[] = [];

    for (const [id, provider] of this.providers) {
      try {
        const providerContent = provider.renderContent(mapEvent, onClose);
        if (providerContent) {
          contentElements.push(
            React.createElement('div', { key: id, title: id }, providerContent),
          );
        }
      } catch (error) {
        console.error(`Error in MapPopover provider "${id}":`, error);
      }
    }

    // Return null if no content (not empty array)
    if (contentElements.length === 0) {
      return null;
    }

    return React.createElement(React.Fragment, {}, ...contentElements);
  }

  get providerCount(): number {
    return this.providers.size;
  }

  clear(): void {
    this.providers.clear();
  }
}
