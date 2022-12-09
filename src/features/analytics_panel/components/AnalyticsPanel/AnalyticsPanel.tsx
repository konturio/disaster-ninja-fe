import { Panel, PanelIcon } from '@konturio/ui-kit';
import { lazy, useCallback, useState } from 'react';
import clsx from 'clsx';
import { Analytics24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { panelClasses } from '~components/Panel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { DESIRED_HEIGHT, MIN_HEIGHT } from '../../constants';
import styles from './AnalyticsPanel.module.css';

const LazyLoadedAnalyticsContainer = lazy(
  () => import('../AnalyticsContainer/AnalyticsContainer'),
);

export function AnalyticsPanel() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const handleRefChange = useHeightResizer(
    setIsOpen,
    isOpen,
    DESIRED_HEIGHT,
    'analytics',
  );

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
        header={String(i18n.t('analytics_panel.header_title'))}
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
        minContentHeight={MIN_HEIGHT}
        resize="vertical"
        contentClassName={styles.contentWrap}
        contentContainerRef={handleRefChange}
      >
        <div className={styles.panelBody}>
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
