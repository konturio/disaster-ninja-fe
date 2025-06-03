import type { Map, MapMouseEvent, MapGeoJSONFeature } from 'maplibre-gl';
import type {
  MapPopoverService,
  MapPositionTracker,
  MapClickHandler,
  MapClickEvent,
  PopoverPositionCalculator,
  RenderPopoverContentFn,
  MapClickContext,
} from '../types';

export interface MapPopoverControllerConfig {
  map: Map;
  popoverService: MapPopoverService;
  positionTracker: MapPositionTracker;
  positionCalculator: PopoverPositionCalculator;
  renderContent: RenderPopoverContentFn;
}

export class MapPopoverController implements MapClickHandler<MapGeoJSONFeature> {
  private readonly config: MapPopoverControllerConfig;

  constructor(config: MapPopoverControllerConfig) {
    this.config = config;
  }

  handleClick(event: MapClickEvent<MapGeoJSONFeature>): void {
    const { map, popoverService, positionTracker, positionCalculator, renderContent } =
      this.config;

    popoverService.close();

    const mapClickContext: MapClickContext = {
      map: map,
      lngLat: event.lngLat,
      point: event.point,
      features: event.features,
      originalEvent: event.originalEvent,
    };

    const content = renderContent(mapClickContext);

    if (content === null || content === undefined) {
      positionTracker.stopTracking();
      return;
    }

    const container = map.getContainer();
    const rect = container.getBoundingClientRect();
    const { pageX, pageY, placement } = positionCalculator.calculate(
      rect,
      event.point.x,
      event.point.y,
    );

    popoverService.show({ x: pageX, y: pageY }, content, placement);

    positionTracker.startTracking([event.lngLat.lng, event.lngLat.lat]);
  }

  close(): void {
    this.config.popoverService.close();
    this.config.positionTracker.stopTracking();
  }
}
