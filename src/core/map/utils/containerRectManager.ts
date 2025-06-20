/**
 * Interface for container rectangle management with caching and invalidation.
 */
export interface IContainerRectManager {
  /**
   * Gets the current container rect, using cached value if available.
   */
  getRect(): DOMRect;

  /**
   * Invalidates the cached rect and forces recalculation.
   */
  invalidate(): void;

  /**
   * Subscribes to rect change notifications.
   * @param callback Function called when rect changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (rect: DOMRect) => void): () => void;

  /**
   * Cleanup resources and stop observing.
   */
  dispose(): void;
}

/**
 * Container rect manager for MapLibre GL map containers.
 * Provides cached access to container bounds with automatic invalidation.
 */
export class MapContainerRectManager implements IContainerRectManager {
  private cachedRect: DOMRect | null = null;
  private container: HTMLElement;
  private resizeObserver: ResizeObserver;
  private callbacks = new Set<(rect: DOMRect) => void>();
  private isDisposed = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.resizeObserver = new ResizeObserver(() => {
      if (!this.isDisposed) {
        this.invalidate();
      }
    });
    this.resizeObserver.observe(container);
  }

  getRect(): DOMRect {
    if (!this.cachedRect && !this.isDisposed) {
      this.cachedRect = this.container.getBoundingClientRect();
    }
    return this.cachedRect || new DOMRect();
  }

  invalidate(): void {
    if (this.isDisposed) return;

    this.cachedRect = null;
    const rect = this.getRect();
    this.callbacks.forEach((callback) => {
      try {
        callback(rect);
      } catch (error) {
        console.error('Error in container rect callback:', error);
      }
    });
  }

  subscribe(callback: (rect: DOMRect) => void): () => void {
    if (this.isDisposed) {
      console.warn('Cannot subscribe to disposed container rect manager');
      return () => {};
    }

    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  dispose(): void {
    if (this.isDisposed) return;

    this.isDisposed = true;
    this.resizeObserver.disconnect();
    this.callbacks.clear();
    this.cachedRect = null;
  }
}
