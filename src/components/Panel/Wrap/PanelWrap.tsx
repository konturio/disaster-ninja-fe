import { Modal } from '@konturio/ui-kit';
import { useEffect, useState } from 'react';
import {
  COLLAPSE_PANEL_QUERY,
  IS_MOBILE_QUERY,
  useMediaQuery,
} from '~utils/hooks/useMediaQuery';
import style from './PanelWrap.module.css';

type PanelWrap = {
  isPanelOpen: boolean;
  onPanelClose: () => void;
  onAutoCollapse?: () => void;
  restrictAutoCollapsing?: boolean;
};

export function PanelWrap({
  isPanelOpen,
  children,
  onPanelClose,
  onAutoCollapse,
  restrictAutoCollapsing,
}: React.PropsWithChildren<PanelWrap>): JSX.Element {
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const shouldCollapse = useMediaQuery(COLLAPSE_PANEL_QUERY);
  const [wasCollapsed, setWasCollapsed] = useState(false);

  useEffect(() => {
    if (isPanelOpen && shouldCollapse && !restrictAutoCollapsing && !wasCollapsed) {
      onPanelClose();
      onAutoCollapse?.();
      setWasCollapsed(true);
    }
  }, [
    shouldCollapse,
    restrictAutoCollapsing,
    onPanelClose,
    onAutoCollapse,
    isPanelOpen,
    wasCollapsed,
  ]);

  if (isPanelOpen && isMobile)
    return (
      <Modal onModalCloseCallback={onPanelClose} className={style.modalCover}>
        {children}
      </Modal>
    );
  return <>{children}</>;
}
