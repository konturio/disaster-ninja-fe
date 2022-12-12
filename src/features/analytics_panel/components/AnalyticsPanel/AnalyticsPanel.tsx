import { Panel, PanelIcon } from '@konturio/ui-kit';
import { lazy, useCallback, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Analytics24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { panelClasses } from '~components/Panel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { MIN_HEIGHT } from '../../constants';
import styles from './AnalyticsPanel.module.css';

const LazyLoadedAnalyticsContainer = lazy(
  () => import('../AnalyticsContainer/AnalyticsContainer'),
);

export function AnalyticsPanel() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const contentRef = useRef<null | HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(MIN_HEIGHT);

  const handleRefChange = useHeightResizer(setIsOpen, isOpen, contentHeight, 'analytics');

  useLayoutEffect(() => {
    contentRef.current && setContentHeight(contentRef.current.scrollHeight);
  }, [contentRef]);

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
    <>
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
        <div className={styles.panelBody} ref={contentRef}>
          <LazyLoadedAnalyticsContainer />
        </div>
      </Panel>

      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(
          styles.panelIcon,
          isOpen && styles.hide,
          !isOpen && styles.show,
          isMobile ? styles.mobile : styles.desktop,
        )}
        icon={<Analytics24 />}
      />
    </>
  );
}
