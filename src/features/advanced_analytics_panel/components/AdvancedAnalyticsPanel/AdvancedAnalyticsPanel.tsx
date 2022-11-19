import { Panel, PanelIcon } from '@konturio/ui-kit';
import { lazy, useCallback, useState } from 'react';
import clsx from 'clsx';
import { AdvancedAnalytics24 } from '@konturio/default-icons';
import core from '~core/index';
import { panelClasses } from '~components/Panel';
import { useAutoCollapsePanel } from '~components/SmartColumn';
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
    <div className={s.panelContainer}>
      <Panel
        header={String(core.i18n.t('advanced_analytics_panel.header_title'))}
        headerIcon={<AdvancedAnalytics24 />}
        onHeaderClick={togglePanel}
        className={clsx(s.panel, isOpen && s.show, !isOpen && s.collapse)}
        classes={panelClasses}
        modal={{
          onModalClick: onPanelClose,
          showInModal: true,
        }}
        isOpen={isOpen}
      >
        <div className={s.panelBody}>
          <LazyLoadedAdvancedAnalyticsPanelHeader />
          <LazyLoadedAdvancedAnalyticsContainer />
        </div>
      </Panel>

      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={<AdvancedAnalytics24 />}
      />
    </div>
  );
}
