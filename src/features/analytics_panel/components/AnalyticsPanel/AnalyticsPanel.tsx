import { Panel, PanelIcon } from '@konturio/ui-kit';
import { lazy, useCallback, useState } from 'react';
import clsx from 'clsx';
import { Analytics24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { PanelWrap } from '~components/Panel/Wrap/PanelWrap';
import { PanelHeader } from '~components/Panel/Header/Header';
import styles from './AnalyticsPanel.module.css';

const LazyLoadedAnalyticsContainer = lazy(
  () => import('../AnalyticsContainer/AnalyticsContainer'),
);
const LazyLoadedAnalyticsPanelHeader = lazy(
  () => import('../AnalyticsPanelHeaderContainer/AnalyticsPanelHeaderContainer'),
);
const classes = { header: styles.header };

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
          header={
            <PanelHeader
              icon={<Analytics24 />}
              title={i18n.t('analytics_panel.header_title')}
            />
          }
          onClose={onPanelClose}
          className={clsx(
            styles.analyticsPanel,
            isOpen && styles.show,
            !isOpen && styles.hide,
          )}
          classes={classes}
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
