import { Panel, PanelIcon } from '@konturio/ui-kit';
import { lazy, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { BivariateMatrix24, Close24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { panelClasses } from '~components/Panel';
import { INTERCOM_ELEMENT_ID } from '../../constants';
import BivariateMatrixContainer from '../BivariateMatrixContainer/BivariateMatrixContainer';
import s from './BivariatePanel.module.css';

// const styles = {};

// const LazyLoadedBivariateMatrixContainer = lazy(
//   () => import('../BivariateMatrixContainer/BivariateMatrixContainer'),
// );

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

export function BivariatePanel({ onConfirm }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

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
    <Panel
      // onHeaderClick={togglePanel}
      className={s.bivariatePanel}
      // classes={{ ...panelClasses }}
      header={String(i18n.t('bivariate.panel.header'))}
      headerIcon={<BivariateMatrix24 />}
      customControls={[{ icon: <Close24 />, onWrapperClick: () => onConfirm(false) }]}
    >
      <div className={s.panelBody}>{isOpen && <BivariateMatrixContainer />}</div>
    </Panel>
  );
}

export default BivariatePanel;
