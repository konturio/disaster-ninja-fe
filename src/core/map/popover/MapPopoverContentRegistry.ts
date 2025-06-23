import React from 'react';
import type {
  IMapPopoverContentProvider,
  IMapPopoverContentRegistry,
  IMapPopoverProviderContext,
  ProviderRegistration,
} from '../types';
import type { MapMouseEvent, MapGeoJSONFeature } from 'maplibre-gl';

export class MapPopoverContentRegistry implements IMapPopoverContentRegistry {
  private providers = new Map<string, ProviderRegistration>();
  private orderedProviderIds: string[] = [];
  private currentToolState: { activeToolId?: string; isExclusive: boolean } = {
    activeToolId: undefined,
    isExclusive: false,
  };
  private exclusiveProviderId: string | null = null;
  private registrationCounter = 0;
  private currentMapEvent: MapMouseEvent | null = null;
  private cachedFeatures: MapGeoJSONFeature[] | null = null;
  private onCloseCallback: (() => void) | null = null;

  register(id: string, provider: IMapPopoverContentProvider): void {
    if (this.providers.has(id)) {
      console.warn(`MapPopover provider "${id}" already registered, replacing`);
    }

    const registration: ProviderRegistration = {
      provider,
      priority: provider.priority,
      registrationOrder: this.registrationCounter++,
      isActive: true,
      toolId: provider.toolId,
    };

    this.providers.set(id, registration);
    this.sortProviders();

    // Close existing popover when exclusive tool is registered
    if (provider.isExclusive && this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  unregister(id: string): void {
    this.providers.delete(id);
    this.sortProviders();

    // Clear exclusive mode if the exclusive provider was removed
    if (this.exclusiveProviderId === id) {
      this.clearExclusiveMode();
    }
  }

  setCloseCallback(callback: (() => void) | null): void {
    this.onCloseCallback = callback;
  }

  setExclusiveMode(providerId: string, toolId?: string): void {
    this.exclusiveProviderId = providerId;
    this.currentToolState = {
      activeToolId: toolId,
      isExclusive: true,
    };
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  clearExclusiveMode(): void {
    this.exclusiveProviderId = null;
    this.currentToolState = {
      activeToolId: undefined,
      isExclusive: false,
    };
  }

  updateToolState(toolState: { activeToolId?: string; isExclusive: boolean }): void {
    this.currentToolState = { ...toolState };
  }

  renderContent(mapEvent: MapMouseEvent, onClose: () => void): React.ReactNode | null {
    // Prepare lazy feature loading for this render cycle
    this.currentMapEvent = mapEvent;
    this.cachedFeatures = null;

    // Exclusive mode: execute only the exclusive provider or no one
    if (this.currentToolState.isExclusive) {
      if (this.exclusiveProviderId) {
        const registration = this.providers.get(this.exclusiveProviderId);
        if (registration) {
          const context = this.createProviderContext(
            mapEvent,
            onClose,
            this.exclusiveProviderId,
            registration,
          );
          const content = this.executeProvider(registration, context);
          // Clear render cycle state
          this.clearRenderCycleState();
          return content;
        }
      }
      // In exclusive mode, but no matching provider found.
      // Return null and do not process other providers.
      this.clearRenderCycleState();
      return null;
    }

    // Normal mode: execute all providers in priority order
    const contentElements: React.ReactNode[] = [];

    for (const providerId of this.orderedProviderIds) {
      const registration = this.providers.get(providerId);
      if (registration?.isActive) {
        const context = this.createProviderContext(
          mapEvent,
          onClose,
          providerId,
          registration,
        );
        const content = this.executeProvider(registration, context);
        if (content) {
          contentElements.push(
            React.createElement(
              'div',
              { key: providerId, title: providerId, className: 'mappopover-provider' },
              content,
            ),
          );
        }
      }
    }

    // Clear render cycle state
    this.clearRenderCycleState();

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
    this.orderedProviderIds = [];
    this.clearExclusiveMode();
    this.registrationCounter = 0;
    this.clearRenderCycleState();
  }

  private clearRenderCycleState(): void {
    this.currentMapEvent = null;
    this.cachedFeatures = null;
  }

  private sortProviders(): void {
    this.orderedProviderIds = Array.from(this.providers.entries())
      .sort(([, a], [, b]) => {
        // Primary: Higher priority first
        if (a.priority !== b.priority) return b.priority - a.priority;
        // Secondary: Earlier registration first
        return a.registrationOrder - b.registrationOrder;
      })
      .map(([id]) => id);
  }

  private createProviderContext(
    mapEvent: MapMouseEvent,
    onClose: () => void,
    providerId: string,
    registration: ProviderRegistration,
  ): IMapPopoverProviderContext {
    return {
      getFeatures: () => {
        if (this.cachedFeatures === null && this.currentMapEvent) {
          this.cachedFeatures = this.currentMapEvent.target.queryRenderedFeatures(
            this.currentMapEvent.point,
          );
        }
        return this.cachedFeatures || [];
      },
      getToolState: () => ({ ...this.currentToolState }),
      getProviderInfo: () => ({
        priority: registration.priority,
        mode:
          this.currentToolState.isExclusive && this.exclusiveProviderId === providerId
            ? 'exclusive'
            : 'shared',
        id: providerId,
      }),
      mapEvent,
      onClose,
    };
  }

  private executeProvider(
    registration: ProviderRegistration,
    context: IMapPopoverProviderContext,
  ): React.ReactNode | null {
    try {
      return registration.provider.renderContent(context);
    } catch (error) {
      console.error(
        `Error in MapPopover provider "${context.getProviderInfo().id}":`,
        error,
      );
      return null;
    }
  }
}
