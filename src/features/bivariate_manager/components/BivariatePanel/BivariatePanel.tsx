import { Panel, PanelIcon, Text } from '@k2-packages/ui-kit';
import s from './BivariatePanel.module.css';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { BivariatePanelIcon, LegendPanelIcon } from '@k2-packages/default-icons';
import ReactDOM from 'react-dom';

const CustomClosePanelBtn = () => (
  <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
    <path d="M1 1L7 7L1 13" stroke="white" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="bevel"/>
  </svg>
);

export function BivariatePanel({ iconsContainerId }: { iconsContainerId: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [childIconContainer, setChildIconContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const iconsContainer = document.getElementById(iconsContainerId);
    if (iconsContainer !== null) {
      const cont = iconsContainer.appendChild(document.createElement('div'));
      setChildIconContainer(cont);
      cont.className = s.iconContainerShown;
    }
  }, []);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
    if (childIconContainer) {
      childIconContainer.className = s.iconContainerShown;
    }
  }, [setIsOpen, childIconContainer]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
    if (childIconContainer) {
      childIconContainer.className = s.iconContainerShown;
    }
  }, [setIsOpen, childIconContainer]);

  return (
    <>
      <Panel
        onClose={onPanelClose}
        className={clsx(s.sidePannel, isOpen && s.show, !isOpen && s.hide)}
        classes={{
          closeBtn: s.customCloseBtn
        }}
        customCloseBtn={<CustomClosePanelBtn/>}
      >
        <div className={s.panelBody}>
          Panel Body
        </div>
      </Panel>

      {childIconContainer &&
        ReactDOM.createPortal(
          <PanelIcon
            clickHandler={onPanelOpen}
            className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
            icon={<BivariatePanelIcon />}
          />,
          childIconContainer)
      }

    </>
  );
}
