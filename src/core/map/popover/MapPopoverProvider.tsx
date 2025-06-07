import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Popover, PopoverContent } from '~components/Overlays/Popover';
import type { Placement } from '@floating-ui/react';
import type {
  ScreenPoint,
  MapPopoverService,
  MapPopoverOptions,
  IMapPopoverContentRegistry,
} from '../types';
import type { MapMouseEvent } from 'maplibre-gl';

interface PopoverState {
  id: string;
  isOpen: boolean;
  content: React.ReactNode;
  placement: Placement;
  screenPoint: ScreenPoint;
}

interface MultiPopoverService extends MapPopoverService {
  showWithId: (
    id: string,
    point: ScreenPoint,
    content: React.ReactNode,
    placement?: Placement,
  ) => void;
  closeById: (id: string) => void;
}

const MapPopoverContext = createContext<MultiPopoverService | undefined>(undefined);

export function useMapPopoverService(): MapPopoverService {
  const context = useContext(MapPopoverContext);
  if (!context) {
    throw new Error('useMapPopoverService must be used within MapPopoverProvider');
  }
  return context;
}

export function MapPopoverProvider({
  children,
  registry,
}: {
  children: React.ReactNode;
  registry?: IMapPopoverContentRegistry;
}) {
  const [popovers, setPopovers] = useState<Map<string, PopoverState>>(new Map());
  const [globalPopover, setGlobalPopover] = useState<PopoverState | null>(null);

  // Enhanced API method: showWithContent
  const showWithContent = useCallback(
    (point: ScreenPoint, content: React.ReactNode, options?: MapPopoverOptions) => {
      const placement = options?.placement ?? 'top';
      // Note: point should already be in page coordinates when passed to this method
      // If called with map-relative coordinates, caller should convert first
      setGlobalPopover({
        id: 'global',
        isOpen: true,
        content,
        placement,
        screenPoint: point,
      });
    },
    [],
  );

  // Enhanced API method: showWithEvent
  const showWithEvent = useCallback(
    (mapEvent: MapMouseEvent, options?: MapPopoverOptions): boolean => {
      if (!registry) {
        return false;
      }

      const result = registry.renderContent(mapEvent);
      if (result) {
        const mergedOptions = { ...options, ...result.options };
        const placement = mergedOptions.placement ?? 'top';

        // Convert map-relative coordinates to page coordinates
        const container = mapEvent.target.getContainer();
        const rect = container.getBoundingClientRect();
        const pageX = rect.left + mapEvent.point.x;
        const pageY = rect.top + mapEvent.point.y;

        setGlobalPopover({
          id: 'global',
          isOpen: true,
          content: result.content,
          placement,
          screenPoint: { x: pageX, y: pageY },
        });
        return true;
      }
      return false;
    },
    [registry],
  );

  // Enhanced API method: updatePosition
  const updatePosition = useCallback((point: ScreenPoint, placement?: Placement) => {
    setGlobalPopover((prev) => {
      if (!prev) {
        return null;
      }

      return {
        ...prev,
        screenPoint: point,
        placement: placement ?? prev.placement,
      };
    });
  }, []);

  // Enhanced API method: isOpen
  const isOpen = useCallback(() => {
    return globalPopover?.isOpen || false;
  }, [globalPopover]);

  // Legacy API methods for backward compatibility
  const show = useCallback(
    (point: ScreenPoint, content: React.ReactNode, placement: Placement = 'top') => {
      setGlobalPopover({
        id: 'global',
        isOpen: true,
        content,
        placement,
        screenPoint: point,
      });
    },
    [],
  );

  const move = useCallback((point: ScreenPoint, placement?: Placement) => {
    setGlobalPopover((prev) => {
      if (!prev) {
        return null;
      }

      const updated = {
        ...prev,
        screenPoint: point,
        placement: placement ?? prev.placement,
      };
      return updated;
    });
  }, []);

  const close = useCallback(() => {
    setGlobalPopover(null);
  }, []);

  const showWithId = useCallback(
    (
      id: string,
      point: ScreenPoint,
      content: React.ReactNode,
      placement: Placement = 'top',
    ) => {
      setPopovers((prev) => {
        const next = new Map(prev);
        next.set(id, {
          id,
          isOpen: true,
          content,
          placement,
          screenPoint: point,
        });
        return next;
      });
    },
    [],
  );

  const closeById = useCallback((id: string) => {
    setPopovers((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      // Enhanced API
      showWithContent,
      showWithEvent,
      updatePosition,
      isOpen,
      // Legacy API
      show,
      move,
      close,
      showWithId,
      closeById,
    }),
    [
      showWithContent,
      showWithEvent,
      updatePosition,
      isOpen,
      show,
      move,
      close,
      showWithId,
      closeById,
    ],
  );

  return (
    <MapPopoverContext.Provider value={contextValue}>
      {children}
      {globalPopover && (
        <Popover
          open={globalPopover.isOpen}
          onOpenChange={(open) => !open && close()}
          virtualReference={globalPopover.screenPoint}
          placement={globalPopover.placement}
        >
          <PopoverContent>{globalPopover.content}</PopoverContent>
        </Popover>
      )}
      {Array.from(popovers.values()).map((popover) => (
        <Popover
          key={popover.id}
          open={popover.isOpen}
          onOpenChange={(open) => !open && closeById(popover.id)}
          virtualReference={popover.screenPoint}
          placement={popover.placement}
        >
          <PopoverContent>{popover.content}</PopoverContent>
        </Popover>
      ))}
    </MapPopoverContext.Provider>
  );
}
