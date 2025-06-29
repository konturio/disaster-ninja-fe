import { ChevronDown24, ChevronUp24 } from '@konturio/default-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { localStorage } from '~utils/storage';

export type PanelState = 'full' | 'short' | 'closed';

interface UseShortPanelStateProps {
  initialState?: PanelState | null;
  skipShortState?: boolean;
  isMobile?: boolean;
  persistKey?: string;
}

export const useShortPanelState = (props?: UseShortPanelStateProps) => {
  const initialState = props?.initialState ?? 'full';
  const skipShortState = props?.skipShortState ?? false;
  const isMobile = props?.isMobile ?? false;
  const persistKey = props?.persistKey;
  const [panelState, setPanelState] = useState<PanelState>(() => {
    if (persistKey) {
      const stored = localStorage.getItem(persistKey) as PanelState | null;
      if (stored === 'full' || stored === 'short' || stored === 'closed') {
        return stored;
      }
    }
    return initialState;
  });

  useEffect(() => {
    if (persistKey) {
      localStorage.setItem(persistKey, panelState);
    }
  }, [persistKey, panelState]);

  const panelControls = useMemo(() => {
    if (isMobile) {
      if (!skipShortState && initialState !== 'closed') {
        return [
          {
            icon: panelState === 'full' ? <ChevronDown24 /> : <ChevronUp24 />,
            onWrapperClick: (e) => {
              e.stopPropagation();
              setPanelState((prevState) => (prevState === 'full' ? 'short' : 'full'));
            },
          },
        ];
      }
      return [];
    }

    if (skipShortState) {
      return [
        {
          icon: panelState === 'closed' ? <ChevronDown24 /> : <ChevronUp24 />,
          onWrapperClick: () => {
            const nextState = initialState === 'closed' ? 'full' : initialState;
            setPanelState((prevState) => (prevState === 'closed' ? nextState : 'closed'));
          },
        },
      ];
    }

    return [
      {
        icon: <ChevronDown24 />,
        onWrapperClick: (e) => {
          e.stopPropagation();
          setPanelState((prevState) => (prevState === 'closed' ? 'short' : 'full'));
        },
        disabled: panelState === 'full',
      },
      {
        icon: <ChevronUp24 />,
        onWrapperClick: (e) => {
          e.stopPropagation();
          setPanelState((prevState) => (prevState === 'full' ? 'short' : 'closed'));
        },
        disabled: panelState === 'closed',
      },
    ];
  }, [panelState, skipShortState, initialState, isMobile]);

  const openFullState = useCallback(() => {
    setPanelState('full');
  }, [setPanelState]);

  const closePanel = useCallback(() => {
    setPanelState('closed');
  }, [setPanelState]);

  const togglePanel = useCallback(() => {
    setPanelState(panelState === 'closed' ? 'full' : 'closed');
  }, [panelState, setPanelState]);

  const result = {
    panelState,
    panelControls,
    setPanelState,
    openFullState,
    closePanel,
    togglePanel,
    isOpen: panelState !== 'closed',
    isShort: panelState === 'short',
  };

  return result;
};
