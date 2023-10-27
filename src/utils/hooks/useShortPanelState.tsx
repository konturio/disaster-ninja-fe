import { ChevronDown24, ChevronUp24 } from '@konturio/default-icons';
import { useState } from 'react';
import type { PanelCustomControl } from '@konturio/ui-kit';

export type PanelState = 'full' | 'short' | 'closed';

interface UseShortPanelStateProps {
  initialState?: PanelState | null;
  skipShortState?: boolean;
}

export const useShortPanelState = (props?: UseShortPanelStateProps) => {
  const initialState = props?.initialState ?? 'full';
  const skipShortState = props?.skipShortState ?? false;
  const [panelState, setPanelState] = useState<PanelState>(initialState);

  const openControl: PanelCustomControl = {
    icon: <ChevronDown24 />,
    onWrapperClick: (e) => {
      e.stopPropagation();
      setPanelState((prevState) => (prevState === 'closed' ? 'short' : 'full'));
    },
    disabled: panelState === 'full',
  };
  const closeControl: PanelCustomControl = {
    icon: <ChevronUp24 />,
    onWrapperClick: (e) => {
      e.stopPropagation();
      setPanelState((prevState) => (prevState === 'full' ? 'short' : 'closed'));
    },
    disabled: panelState === 'closed',
  };

  const panelControls = [openControl, closeControl];

  if (skipShortState) {
    const singleControl: PanelCustomControl[] = [
      {
        icon: panelState === 'closed' ? <ChevronDown24 /> : <ChevronUp24 />,
        onWrapperClick: () => {
          const nextState = initialState === 'closed' ? 'full' : initialState;
          setPanelState((prevState) => (prevState === 'closed' ? nextState : 'closed'));
        },
      },
    ];
    // hooks must not be skipped - therefore it's late return
    return { panelState, panelControls: singleControl, setPanelState };
  }

  return { panelState, panelControls, setPanelState };
};
