import { ChevronDown24, ChevronUp24 } from '@konturio/default-icons';
import { useCallback, useMemo, useState } from 'react';

export type PanelState = 'full' | 'short' | 'closed';

interface UseShortPanelStateProps {
  initialState?: PanelState | null;
  skipShortState?: boolean;
  isMobile?: boolean;
}

export const useShortPanelState = (props?: UseShortPanelStateProps) => {
  const initialState = props?.initialState ?? 'full';
  const skipShortState = props?.skipShortState ?? false;
  const isMobile = props?.isMobile ?? false;
  const [panelState, setPanelState] = useState<PanelState>(initialState);

  const panelControls = useMemo(() => {
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

    if (isMobile) {
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
