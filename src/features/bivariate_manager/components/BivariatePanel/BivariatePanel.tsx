import { Panel, PanelIcon } from '@konturio/ui-kit';
import { lazy, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { BivariateMatrix24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { panelClasses } from '~components/Panel';
import { INTERCOM_ELEMENT_ID } from '../../constants';
import styles from './BivariatePanel.module.css';

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

export function BivariatePanel() {
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
    setIsOpen((prevState) => !prevState);
  }, [setIsOpen]);

  useEffect(() => {
    isOpen ? intercomButton().show() : intercomButton().hide();
  }, [isOpen]);

  return (
    <>
      <Panel
        onHeaderClick={togglePanel}
        classes={{ ...panelClasses }}
        className={clsx(
          styles.bivariatePanel,
          isOpen && styles.show,
          !isOpen && styles.collapse,
        )}
        header={String(i18n.t('bivariate.panel.header'))}
        headerIcon={<BivariateMatrix24 />}
        modal={{
          onModalClick: onPanelClose,
          showInModal: true,
        }}
        isOpen={isOpen}
      >
        <div className={styles.panelBody}>
          {isOpen && <LazyLoadedBivariateMatrixContainer />}
        </div>
      </Panel>

      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(styles.panelIcon, isOpen && styles.hide, !isOpen && styles.show)}
        icon={<BivariateMatrix24 />}
      />
    </>
  );
}
