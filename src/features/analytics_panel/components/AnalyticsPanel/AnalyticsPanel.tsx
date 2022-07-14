import { Panel, PanelIcon } from '@konturio/ui-kit';
import { lazy, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Analytics24 } from '@konturio/default-icons';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { featureStatus } from '~core/featureStatus';
import { AppFeature } from '~core/auth/types';
import styles from './AnalyticsPanel.module.css';

const LazyLoadedAnalyticsContainer = lazy(
  () => import('../AnalyticsContainer/AnalyticsContainer'),
);
const LazyLoadedAnalyticsPanelHeader = lazy(
  () =>
    import('../AnalyticsPanelHeaderContainer/AnalyticsPanelHeaderContainer'),
);

export function AnalyticsPanel({ reportReady }: { reportReady: () => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  useEffect(() => reportReady(), []);

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
      <Panel
        header={isOpen ? <LazyLoadedAnalyticsPanelHeader /> : undefined}
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
          {isOpen && <LazyLoadedAnalyticsContainer />}
        </div>
      </Panel>
      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(
          styles.panelIcon,
          isOpen && styles.hide,
          !isOpen && styles.show,
        )}
        icon={<Analytics24 />}
      />
    </div>
  );
}
