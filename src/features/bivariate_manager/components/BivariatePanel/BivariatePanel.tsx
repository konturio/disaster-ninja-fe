import { Panel, PanelIcon } from '@konturio/ui-kit';
import { lazy, useCallback, useState } from 'react';
import clsx from 'clsx';
import { BivariateMatrix24 } from '@konturio/default-icons';
import ReactDOM from 'react-dom';
import { PanelWrap } from '~components/Panel/Wrap/PanelWrap';
import { PanelCloseButton } from '~components/Panel/CloseButton/CloseButton';
import { PanelHeader } from '~components/Panel/Header/Header';
import { i18n } from '~core/localization';
import { INTERCOM_ELEMENT_ID } from '../../constants';
import styles from './BivariatePanel.module.css';

const classes = { header: styles.header, closeBtn: styles.customCloseBtn };

const LazyLoadedBivariateMatrixContainer = lazy(
  () => import('../BivariateMatrixContainer/BivariateMatrixContainer'),
);

const intercomButton = () => {
  const setStyleDisplay = (displayValue) => {
    const intercomApp = document.getElementsByClassName(INTERCOM_ELEMENT_ID);
    if (intercomApp && intercomApp.length) {
      (intercomApp[0] as HTMLDivElement).style.display = displayValue;
    }
  };
  return {
    show: () => setStyleDisplay('block'),
    hide: () => setStyleDisplay('none'),
  };
};

export function BivariatePanel({
  iconsContainerRef,
}: {
  iconsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
    intercomButton().show();
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
    // need this to temporary hide intercom when showing bivariate
    intercomButton().hide();
  }, [setIsOpen]);

  const togglePanel = useCallback(() => {
    setIsOpen((wasOpen) => {
      if (wasOpen) intercomButton().show();
      else intercomButton().hide();
      return !wasOpen;
    });
  }, [setIsOpen]);

  return (
    <>
      <PanelWrap onPanelClose={onPanelClose} isPanelOpen={isOpen}>
        <Panel
          onClose={togglePanel}
          className={clsx(
            styles.bivariatePanel,
            isOpen && styles.show,
            !isOpen && styles.collapse,
          )}
          classes={classes}
          customCloseBtn={<PanelCloseButton isOpen={isOpen} />}
          header={
            <PanelHeader
              icon={<BivariateMatrix24 />}
              title={i18n.t('bivariate.panel.header')}
            />
          }
        >
          <div className={styles.panelBody}>
            {isOpen && <LazyLoadedBivariateMatrixContainer />}
          </div>
        </Panel>
      </PanelWrap>

      {iconsContainerRef.current &&
        ReactDOM.createPortal(
          <PanelIcon
            clickHandler={onPanelOpen}
            className={clsx(
              styles.panelIcon,
              isOpen && styles.hide,
              !isOpen && styles.show,
            )}
            icon={<BivariateMatrix24 />}
          />,
          iconsContainerRef.current,
        )}
    </>
  );
}
