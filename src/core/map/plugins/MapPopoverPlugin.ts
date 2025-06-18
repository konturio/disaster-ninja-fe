import { useMapPopoverService } from '~core/map/popover/MapPopoverProvider';
import { useMapEvents } from '../hooks/useMapEvents';
import type { MapPlugin } from '../types';
import type { IMap } from '../providers/IMapProvider';
import type { IMapPopoverContentRegistry } from '~core/map/types';
import type { MapMouseEvent } from 'maplibre-gl';

interface MapPopoverPluginOptions {
  priority?: number;
}

export function createMapPopoverPlugin(
  registry: IMapPopoverContentRegistry,
  options: MapPopoverPluginOptions = {},
): MapPlugin {
  return function useMapPopoverPlugin<TMap extends IMap>(map: TMap): void {
    const popoverService = useMapPopoverService();
    const { priority = 55 } = options;

    useMapEvents(map, [
      {
        event: 'click',
        handler: (event: MapMouseEvent) => {
          if (popoverService.isOpen()) {
            popoverService.close();
            return false;
          }

          const hasContent = popoverService.showWithEvent(event);
          return !hasContent;
        },
        priority,
      },
      {
        event: 'drag',
        handler: () => {
          if (popoverService.isOpen()) {
            popoverService.close();
          }
          return true;
        },
        priority: 1, // High priority to close early
      },
    ]);
  };
}
