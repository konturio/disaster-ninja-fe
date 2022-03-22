import { Panel, PanelIcon } from '@k2-packages/ui-kit';
import s from './BivariatePanel.module.css';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { BivariatePanelIcon } from '@k2-packages/default-icons';
import ReactDOM from 'react-dom';
import BivariateMatrixContainer from '~features/bivariate_manager/components/BivariateMatrixContainer/BivariateMatrixContainer';
import { INTERCOM_ELEMENT_ID } from '../../constants';
import { bivariateMatrixSelectionAtom } from '../../atoms/bivariateMatrixSelection';
import { useAction } from '@reatom/react';

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
  iconsContainerId,
}: {
  iconsContainerId: string;
}) {
  const disableBivariateLayer = useAction(
    bivariateMatrixSelectionAtom.disableBivariateLayer,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [childIconContainer, setChildIconContainer] =
    useState<HTMLDivElement | null>(null);

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
    const intercomApp = document.getElementsByClassName(INTERCOM_ELEMENT_ID);
    if (intercomApp && intercomApp.length) {
      (intercomApp[0] as HTMLDivElement).style.display = '';
    }
  }, [setIsOpen, childIconContainer]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
    if (childIconContainer) {
      childIconContainer.className = s.iconContainerShown;
    }
    // need this to temporary hide intercom when showing bivariate
    const intercomApp = document.getElementsByClassName(INTERCOM_ELEMENT_ID);
    if (intercomApp && intercomApp.length) {
      (intercomApp[0] as HTMLDivElement).style.display = 'none';
    }
  }, [setIsOpen, childIconContainer]);

  useEffect(() => {
    if (!isOpen) {
      disableBivariateLayer();
    }
  }, [isOpen, disableBivariateLayer]);

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

      {childIconContainer &&
        ReactDOM.createPortal(
          <PanelIcon
            clickHandler={onPanelOpen}
            className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
            icon={<BivariatePanelIcon />}
          />,
          childIconContainer,
        )}
    </>
  );
}
