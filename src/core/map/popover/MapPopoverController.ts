import type { Map, MapMouseEvent, MapGeoJSONFeature } from 'maplibre-gl';
import type {
  MapPopoverService,
  MapPositionTracker,
  MapClickHandler,
  MapClickEvent,
  MapPopoverPositionCalculator,
  RenderPopoverContentFn,
  MapClickContext,
  MapPopoverErrorHandler,
  MapPopoverErrorInfo,
} from '../types';

export interface MapPopoverControllerConfig {
  map: Map;
  popoverService: MapPopoverService;
  positionTracker: MapPositionTracker;
  positionCalculator: MapPopoverPositionCalculator;
  renderContent: RenderPopoverContentFn;
  onError?: MapPopoverErrorHandler;
}

export class MapPopoverController implements MapClickHandler<MapGeoJSONFeature> {
  private readonly config: MapPopoverControllerConfig;
  private isDestroyed = false;

  constructor(config: MapPopoverControllerConfig) {
    this.config = config;
  }

  handleClick(event: MapClickEvent<MapGeoJSONFeature>): void {
    if (this.isDestroyed) return;

    const {
      map,
      popoverService,
      positionTracker,
      positionCalculator,
      renderContent,
      onError,
    } = this.config;

    popoverService.close();

    const mapClickContext: MapClickContext = {
      map: map,
      lngLat: event.lngLat,
      point: event.point,
      features: event.features,
      originalEvent: event.originalEvent,
    };

    let content: React.ReactNode;

    try {
      content = renderContent(mapClickContext);
    } catch (error) {
      console.error('Error rendering popover content:', error);

      if (onError) {
        const errorInfo: MapPopoverErrorInfo = {
          error: error as Error,
          context: mapClickContext,
        };
        content = onError(errorInfo);
      } else {
        content = null;
      }
    }

    if (content === null || content === undefined) {
      positionTracker.stopTracking();
      return;
    }

    try {
      const container = map.getContainer();
      const rect = container.getBoundingClientRect();

      const { pageX, pageY, placement } = positionCalculator.calculate(
        rect,
        event.point.x,
        event.point.y,
      );

      popoverService.show({ x: pageX, y: pageY }, content, placement);
      positionTracker.startTracking([event.lngLat.lng, event.lngLat.lat]);
    } catch (error) {
      console.error('Error showing popover:', error);
      positionTracker.stopTracking();
    }
  }

  close(): void {
    if (this.isDestroyed) return;

    this.config.popoverService.close();
    this.config.positionTracker.stopTracking();
  }

  destroy(): void {
    if (this.isDestroyed) return;

    this.close();
    this.config.positionTracker.cleanup();
    this.isDestroyed = true;
  }
}
