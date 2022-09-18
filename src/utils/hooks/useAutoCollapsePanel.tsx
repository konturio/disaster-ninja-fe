import { useState, useEffect } from 'react';
import { COLLAPSE_PANEL_QUERY, useMediaQuery } from './useMediaQuery';

export const useAutoCollapsePanel = (isOpen: boolean, onPanelClose: () => void) => {
  const shouldCollapse = useMediaQuery(COLLAPSE_PANEL_QUERY);
  const [wasCollapsed, setWasCollapsed] = useState(false);

  useEffect(() => {
    if (isOpen && shouldCollapse && !wasCollapsed) {
      onPanelClose();
      setWasCollapsed(true);
    } else if (shouldCollapse && !wasCollapsed) {
      setWasCollapsed(true);
    }
  }, [shouldCollapse, isOpen, onPanelClose, wasCollapsed]);
};
