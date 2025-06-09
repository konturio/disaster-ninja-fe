import { useMapEffect } from './useMapEffect';
import type { IMap } from '../providers/IMapProvider';

export interface MapEventHandler {
  event: string;
  handler: (event: any) => boolean | void;
  priority?: number;
}

export function useMapEvents<TMap extends IMap>(
  map: TMap,
  handlers: MapEventHandler[],
): void {
  useMapEffect(
    map,
    (map) => {
      const handlersByEvent = handlers.reduce(
        (acc, handler) => {
          if (!acc[handler.event]) {
            acc[handler.event] = [];
          }
          acc[handler.event].push(handler);
          return acc;
        },
        {} as Record<string, MapEventHandler[]>,
      );

      const cleanupFunctions: (() => void)[] = [];

      Object.entries(handlersByEvent).forEach(([eventType, eventHandlers]) => {
        const sortedHandlers = eventHandlers.sort(
          (a, b) => (a.priority || 100) - (b.priority || 100),
        );

        const compositeHandler = (event: any) => {
          for (const { handler } of sortedHandlers) {
            const continueChain = handler(event);
            if (continueChain === false) break;
          }
        };

        map.on(eventType, compositeHandler);
        cleanupFunctions.push(() => map.off(eventType, compositeHandler));
      });

      return () => {
        cleanupFunctions.forEach((cleanup) => cleanup());
      };
    },
    [handlers],
  );
}
