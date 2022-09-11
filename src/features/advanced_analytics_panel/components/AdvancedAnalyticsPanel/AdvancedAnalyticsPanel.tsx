import { Modal, Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { lazy, useCallback, useState } from 'react';
import clsx from 'clsx';
import { AdvancedAnalytics24, Bi24 as BivariatePanelIcon } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import s from './AdvancedAnalyticsPanel.module.css';

const LazyLoadedAdvancedAnalyticsContainer = lazy(
  () => import('../AdvancedAnalyticsContainer/AdvancedAnalyticsContainer'),
);
const LazyLoadedAdvancedAnalyticsPanelHeader = lazy(
  () =>
    import(
      '../AdvancedAnalyticsPanelHeaderContainer/AdvancedAnalyticsPanelHeaderContainer'
    ),
);

export function AdvancedAnalyticsPanel() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const panel = (
    <Panel
      header={
        <Text type="heading-m">{i18n.t('advanced_analytics_panel.header_title')}</Text>
      }
      onClose={onPanelClose}
      className={clsx(s.panel, isOpen && s.show, !isOpen && s.hide)}
      classes={{
        header: s.header,
      }}
    >
      <div className={s.panelBody}>
        <LazyLoadedAdvancedAnalyticsPanelHeader />
        <LazyLoadedAdvancedAnalyticsContainer />
      </div>
    </Panel>
  );

  return (
    <div className={s.panelContainer}>
      {isOpen && isMobile ? (
        <Modal onModalCloseCallback={onPanelClose} className={s.modalCover}>
          {panel}
        </Modal>
      ) : (
        panel
      )}
      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={<AdvancedAnalytics24 />}
      />
    </div>
  );
}
