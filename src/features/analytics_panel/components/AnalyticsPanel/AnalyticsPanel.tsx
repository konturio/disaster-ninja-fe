import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { lazy, useCallback, useState } from 'react';
import clsx from 'clsx';
import { Analytics24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { PanelWrap } from '~components/Panel/Wrap/PanelWrap';
import styles from './AnalyticsPanel.module.css';

const LazyLoadedAnalyticsContainer = lazy(
  () => import('../AnalyticsContainer/AnalyticsContainer'),
);
const LazyLoadedAnalyticsPanelHeader = lazy(
  () => import('../AnalyticsPanelHeaderContainer/AnalyticsPanelHeaderContainer'),
);

export function AnalyticsPanel() {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <div className={styles.panelContainer}>
      <PanelWrap onPanelClose={onPanelClose} isPanelOpen={isOpen}>
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
      </PanelWrap>

      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(styles.panelIcon, isOpen && styles.hide, !isOpen && styles.show)}
        icon={<Analytics24 />}
      />
    </div>
  );
}
