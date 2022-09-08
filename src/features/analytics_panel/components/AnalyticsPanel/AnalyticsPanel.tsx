import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { lazy, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Analytics24 } from '@konturio/default-icons';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
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

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <div className={styles.panelContainer}>
      {isOpen && (
        <Panel
          header={<Text type="heading-m">{i18n.t('analytics_panel.header_title')}</Text>}
          onClose={onPanelClose}
          className={clsx(
            styles.sidePanel,
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
      )}
      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(styles.panelIcon, isOpen && styles.hide, !isOpen && styles.show)}
        icon={<Analytics24 />}
      />
    </div>
  );
}
