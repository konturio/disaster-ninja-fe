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
    for (const provider of this.providers) {
      try {
        const content = provider.renderContent(mapEvent);
        if (content) {
          return {
            content,
            options: provider.getPopoverOptions?.(mapEvent),
          };
        }
      } catch (error) {
        console.error('Error in content provider:', error);
        // Continue to next provider on error
      }
    }
    return null;
  }

  get providerCount(): number {
    return this.providers.length;
  }

  clear(): void {
    this.providers = [];
  }
}
