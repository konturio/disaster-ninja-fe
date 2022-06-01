import { Panel, PanelIcon } from '@k2-packages/ui-kit';
import s from './BivariatePanel.module.css';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Bi24 as BivariatePanelIcon } from '@konturio/default-icons';
import ReactDOM from 'react-dom';
import BivariateMatrixContainer from '~features/bivariate_manager/components/BivariateMatrixContainer/BivariateMatrixContainer';
import { INTERCOM_ELEMENT_ID } from '../../constants';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';

const CustomClosePanelBtn = () => (
  <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
    <path
      d="M1 1L7 7L1 13"
      stroke="white"
      strokeWidth="1.3"
      strokeLinecap="square"
      strokeLinejoin="bevel"
    />
  </svg>
);

export function BivariatePanel({
  iconsContainerRef,
}: {
  iconsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
    const intercomApp = document.getElementsByClassName(INTERCOM_ELEMENT_ID);
    if (intercomApp && intercomApp.length) {
      (intercomApp[0] as HTMLDivElement).style.display = '';
    }
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
    // need this to temporary hide intercom when showing bivariate
    const intercomApp = document.getElementsByClassName(INTERCOM_ELEMENT_ID);
    if (intercomApp && intercomApp.length) {
      (intercomApp[0] as HTMLDivElement).style.display = 'none';
    }
  }, [setIsOpen]);

  return (
    <>
      <Panel
        onClose={onPanelClose}
        className={clsx(s.sidePanel, isOpen && s.show, !isOpen && s.hide)}
        classes={{
          closeBtn: s.customCloseBtn,
        }}
        customCloseBtn={<CustomClosePanelBtn />}
      >
        <div className={s.panelBody}>
          {isOpen && <BivariateMatrixContainer />}
        </div>
      </Panel>

      {iconsContainerRef.current &&
        ReactDOM.createPortal(
          <PanelIcon
            clickHandler={onPanelOpen}
            className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
            icon={<BivariatePanelIcon />}
          />,
          iconsContainerRef.current,
        )}
    </>
  );
}
