import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Popover, PopoverContent } from '~components/Overlays/Popover';
import {
  mapContainerToPageCoords,
  getMapContainerRect,
} from '../utils/maplibreCoordinateUtils';
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

  const showWithContent = useCallback(
    (point: ScreenPoint, content: React.ReactNode, options?: MapPopoverOptions) => {
      const placement = options?.placement ?? 'top';
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

  const close = useCallback(() => {
    setGlobalPopover(null);
  }, []);

  const showWithEvent = useCallback(
    (mapEvent: MapMouseEvent, options?: MapPopoverOptions): boolean => {
      if (!registry) {
        return false;
      }

      const content = registry.renderContent(mapEvent, close);
      if (content) {
        const placement = options?.placement ?? 'top';

        const containerRect = getMapContainerRect(mapEvent.target);
        const pagePoint = mapContainerToPageCoords(mapEvent.point, containerRect);

        setGlobalPopover({
          id: 'global',
          isOpen: true,
          content,
          placement,
          screenPoint: pagePoint,
        });
        return true;
      }
      return false;
    },
    [registry, close],
  );

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

  const isOpen = useCallback(() => {
    return globalPopover?.isOpen || false;
  }, [globalPopover]);

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
      showWithContent,
      showWithEvent,
      updatePosition,
      isOpen,
      close,
      showWithId,
      closeById,
    }),
    [
      showWithContent,
      showWithEvent,
      updatePosition,
      isOpen,
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
