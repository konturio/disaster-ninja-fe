import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Popover, PopoverContent } from '~components/Overlays/Popover';
import type { Placement } from '@floating-ui/react';
import type { ScreenPoint, MapPopoverService } from '../types';

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

export function MapPopoverProvider({ children }: { children: React.ReactNode }) {
  const [popovers, setPopovers] = useState<Map<string, PopoverState>>(new Map());
  const [globalPopover, setGlobalPopover] = useState<PopoverState | null>(null);

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
      show,
      move,
      close,
      showWithId,
      closeById,
    }),
    [show, move, close, showWithId, closeById],
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
