import { ChevronDown24, ChevronUp24 } from '@konturio/default-icons';
import { useCallback, useMemo, useState } from 'react';

export type PanelState = 'full' | 'short' | 'closed';

interface UseShortPanelStateProps {
  initialState?: PanelState | null;
  skipShortState?: boolean;
  isMobile?: boolean;
  /** Optional id used to generate test ids for panel controls */
  panelId?: string;
}

export const useShortPanelState = (props?: UseShortPanelStateProps) => {
  const initialState = props?.initialState ?? 'full';
  const skipShortState = props?.skipShortState ?? false;
  const isMobile = props?.isMobile ?? false;
  const collapseTestId = props?.panelId ? `${props.panelId}-collapse` : undefined;
  const expandTestId = props?.panelId ? `${props.panelId}-expand` : undefined;
  const [panelState, setPanelState] = useState<PanelState>(initialState);

  const panelControls = useMemo(() => {
    if (isMobile) {
      if (!skipShortState && initialState !== 'closed') {
        return [
          {
            icon:
              panelState === 'full' ? (
                <ChevronDown24 data-testid={collapseTestId} />
              ) : (
                <ChevronUp24 data-testid={expandTestId} />
              ),
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
          icon:
            panelState === 'closed' ? (
              <ChevronDown24 data-testid={expandTestId} />
            ) : (
              <ChevronUp24 data-testid={collapseTestId} />
            ),
          onWrapperClick: () => {
            const nextState = initialState === 'closed' ? 'full' : initialState;
            setPanelState((prevState) => (prevState === 'closed' ? nextState : 'closed'));
          },
        },
      ];
    }

    return [
      {
        icon: <ChevronDown24 data-testid={collapseTestId} />,
        onWrapperClick: (e) => {
          e.stopPropagation();
          setPanelState((prevState) => (prevState === 'closed' ? 'short' : 'full'));
        },
        disabled: panelState === 'full',
      },
      {
        icon: <ChevronUp24 data-testid={expandTestId} />,
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
