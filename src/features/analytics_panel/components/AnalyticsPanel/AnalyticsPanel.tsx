import { Modal, Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { lazy, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Analytics24 } from '@konturio/default-icons';
import {
  COLLAPSE_PANEL_QUERY,
  IS_MOBILE_QUERY,
  useMediaQuery,
} from '~utils/hooks/useMediaQuery';
import { i18n } from '~core/localization';
import styles from './AnalyticsPanel.module.css';

const LazyLoadedAnalyticsContainer = lazy(
  () => import('../AnalyticsContainer/AnalyticsContainer'),
);
const LazyLoadedAnalyticsPanelHeader = lazy(
  () => import('../AnalyticsPanelHeaderContainer/AnalyticsPanelHeaderContainer'),
);

export function AnalyticsPanel() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const shouldCollapse = useMediaQuery(COLLAPSE_PANEL_QUERY);

  useEffect(() => {
    if (shouldCollapse) {
      setIsOpen(false);
    }
  }, [shouldCollapse]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const panel = (
    <Panel
      header={<Text type="heading-m">{i18n.t('analytics_panel.header_title')}</Text>}
      onClose={onPanelClose}
      className={clsx(
        styles.analyticsPanel,
        isOpen && styles.show,
        !isOpen && styles.hide,
      )}
      classes={{
        header: styles.header,
      }}
    >
      <div className={styles.panelBody}>
        <LazyLoadedAnalyticsPanelHeader />
        <LazyLoadedAnalyticsContainer />
      </div>
    </Panel>
  );

  return (
    <div className={styles.panelContainer}>
      {isOpen && isMobile ? (
        <Modal
          onModalCloseCallback={() => setIsOpen(false)}
          className={styles.modalCover}
        >
          {panel}
        </Modal>
      ) : (
        panel
      )}

      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(styles.panelIcon, isOpen && styles.hide, !isOpen && styles.show)}
        icon={<Analytics24 />}
      />
    </div>
  );
}
