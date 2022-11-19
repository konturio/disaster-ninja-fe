import { Panel, PanelIcon } from '@konturio/ui-kit';
import { lazy, useCallback, useState } from 'react';
import clsx from 'clsx';
import { Analytics24 } from '@konturio/default-icons';
import core from '~core/index';
import { panelClasses } from '~components/Panel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import {
  useSmartColumnContentResizer,
  useAutoCollapsePanel,
} from '~components/SmartColumn';
import { MIN_HEIGHT } from '../../constants';
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
  const contentRef = useSmartColumnContentResizer(setIsOpen, isOpen, MIN_HEIGHT);

  const togglePanel = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useAutoCollapsePanel(isOpen, onPanelClose);
  return (
    <div className={clsx(styles.panelContainer, isOpen && styles.isOpen)}>
      <Panel
        header={String(core.i18n.t('analytics_panel.header_title'))}
        headerIcon={<Analytics24 />}
        onHeaderClick={togglePanel}
        className={clsx(
          styles.analyticsPanel,
          isOpen && styles.show,
          !isOpen && styles.collapse,
        )}
        classes={{ ...panelClasses, modal: styles.analyticsModal }}
        isOpen={isOpen}
        modal={{
          onModalClick: onPanelClose,
          showInModal: isMobile,
        }}
        minContentHeightPx={MIN_HEIGHT}
        resize="vertical"
        contentClassName={styles.contentWrap}
        contentContainerRef={contentRef}
      >
        <div className={styles.panelBody}>
          <LazyLoadedAnalyticsPanelHeader />
          <LazyLoadedAnalyticsContainer />
        </div>
      </Panel>

      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(styles.panelIcon, isOpen && styles.hide, !isOpen && styles.show)}
        icon={<Analytics24 />}
      />
    </div>
  );
}
