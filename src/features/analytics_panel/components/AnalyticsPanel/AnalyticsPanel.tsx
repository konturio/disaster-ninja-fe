import { Panel, PanelIcon } from '@konturio/ui-kit';
import { lazy, useCallback, useState } from 'react';
import clsx from 'clsx';
import { Analytics24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { PanelWrap } from '~components/Panel/Wrap/PanelWrap';
import { PanelHeader } from '~components/Panel/Header/Header';
import { PanelCloseButton } from '~components/Panel/CloseButton/CloseButton';
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

  const togglePanel = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <div className={styles.panelContainer}>
      <PanelWrap onPanelClose={() => setIsOpen(false)} isPanelOpen={isOpen}>
        <Panel
          header={
            <PanelHeader
              icon={<Analytics24 />}
              title={i18n.t('analytics_panel.header_title')}
            />
          }
          onClose={togglePanel}
          className={clsx(
            styles.analyticsPanel,
            isOpen && styles.show,
            !isOpen && styles.collapse,
          )}
          classes={classes}
          customCloseBtn={<PanelCloseButton isOpen={isOpen} />}
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
