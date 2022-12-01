import {
  ChevronDown24,
  ChevronUp24,
  DoubleChevronDown24,
  DoubleChevronUp24,
} from '@konturio/default-icons';
import { useEffect, useState } from 'react';
import type { PanelCustomControl } from '@konturio/ui-kit';

export const useShortPanelState = () => {
  const [panelState, setPanelState] = useState<'full' | 'short' | 'closed'>('full');
  const [panelControls, setPanelControls] = useState<PanelCustomControl[]>([]);

  const openFullControl: PanelCustomControl = {
    icon: <DoubleChevronDown24 />,
    onWrapperClick: () => setPanelState('full'),
  };
  const openHalfwayControl: PanelCustomControl = {
    icon: <ChevronDown24 />,
    onWrapperClick: () =>
      setPanelState((prevState) => (prevState === 'closed' ? 'short' : 'full')),
  };
  const closeHalfwayControl: PanelCustomControl = {
    icon: <ChevronUp24 />,
    onWrapperClick: () =>
      setPanelState((prevState) => (prevState === 'full' ? 'short' : 'closed')),
  };
  const closeControl: PanelCustomControl = {
    icon: <DoubleChevronUp24 />,
    onWrapperClick: () => setPanelState('closed'),
  };

  useEffect(() => {
    panelState === 'full' && setPanelControls([closeHalfwayControl, closeControl]);
    panelState === 'short' && setPanelControls([closeHalfwayControl, openHalfwayControl]);
    panelState === 'closed' && setPanelControls([openFullControl, openHalfwayControl]);
  }, [panelState]);

  return { panelState, panelControls, setPanelState };
};
