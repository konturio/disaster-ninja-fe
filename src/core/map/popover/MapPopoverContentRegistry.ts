import type {
  IMapPopoverContentProvider,
  IMapPopoverContentRegistry,
  MapPopoverOptions,
} from '../types';
import type { MapMouseEvent } from 'maplibre-gl';

/**
 * Registry for coordinating multiple map popover content providers.
 *
 * This class maintains a list of registered providers and attempts to render
 * content by calling each provider in registration order until one returns content.
 */
export class MapPopoverContentRegistry implements IMapPopoverContentRegistry {
  private providers: IMapPopoverContentProvider[] = [];

  /**
   * Registers a content provider with the registry.
   * Providers are called in registration order when rendering content.
   */
  register(provider: IMapPopoverContentProvider): void {
    if (!this.providers.includes(provider)) {
      this.providers.push(provider);
    }
  }

  /**
   * Unregisters a content provider from the registry.
   */
  unregister(provider: IMapPopoverContentProvider): void {
    const index = this.providers.indexOf(provider);
    if (index > -1) {
      this.providers.splice(index, 1);
    }
  }

  /**
   * Attempts to render content using registered providers.
   * Returns the first provider's content that is not null.
   */
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

  /**
   * Returns the number of registered providers.
   */
  get providerCount(): number {
    return this.providers.length;
  }

  /**
   * Clears all registered providers.
   */
  clear(): void {
    this.providers = [];
  }
}
