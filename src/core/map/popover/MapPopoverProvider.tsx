import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Popover, PopoverContent } from '~components/Overlays/Popover';
import type { Placement } from '@floating-ui/react';

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface PopoverService {
  show: (point: ScreenPoint, content: React.ReactNode, placement?: Placement) => void;
  move: (point: ScreenPoint, placement?: Placement) => void;
  close: () => void;
}

const MapPopoverContext = createContext<PopoverService | undefined>(undefined);

export function useMapPopoverService(): PopoverService {
  const context = useContext(MapPopoverContext);
  if (!context) {
    throw new Error('useMapPopoverService must be used within MapPopoverProvider');
  }
  return context;
}

export function MapPopoverProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [placement, setPlacement] = useState<Placement>('top');
  const [screenPoint, setScreenPoint] = useState<ScreenPoint>({ x: 0, y: 0 });

  const show = useCallback(
    (point: ScreenPoint, newContent: React.ReactNode, newPlacement?: Placement) => {
      setContent(newContent);
      setScreenPoint(point);
      if (newPlacement) {
        setPlacement(newPlacement);
      }
      setIsOpen(true);
    },
    [],
  );

  const move = useCallback((point: ScreenPoint, newPlacement?: Placement) => {
    setScreenPoint(point);
    if (newPlacement) {
      setPlacement(newPlacement);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const contextValue = useMemo(() => ({ show, move, close }), [show, move, close]);

  return (
    <MapPopoverContext.Provider value={contextValue}>
      {children}
      <Popover
        open={isOpen}
        onOpenChange={setIsOpen}
        virtualReference={screenPoint}
        placement={placement}
      >
        <PopoverContent>{content}</PopoverContent>
      </Popover>
    </MapPopoverContext.Provider>
  );
}
