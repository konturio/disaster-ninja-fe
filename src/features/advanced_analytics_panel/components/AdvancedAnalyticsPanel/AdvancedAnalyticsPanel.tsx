import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { lazy, useCallback, useState } from 'react';
import clsx from 'clsx';
import { AdvancedAnalytics24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { PanelWrap } from '~components/Panel/Wrap/PanelWrap';
import { PanelHeader } from '~components/Panel/Header/Header';
import { PanelCloseButton } from '~components/Panel/CloseButton/CloseButton';
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
const classes = { header: s.header };

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

  return (
    <div className={s.panelContainer}>
      <PanelWrap onPanelClose={onPanelClose} isPanelOpen={isOpen}>
        <Panel
          header={
            <PanelHeader
              icon={<AdvancedAnalytics24 />}
              title={i18n.t('advanced_analytics_panel.header_title')}
            />
          }
          onClose={togglePanel}
          className={clsx(s.panel, isOpen && s.show, !isOpen && s.collapse)}
          classes={classes}
          customCloseBtn={<PanelCloseButton isOpen={isOpen} />}
        >
          <div className={s.panelBody}>
            <LazyLoadedAdvancedAnalyticsPanelHeader />
            <LazyLoadedAdvancedAnalyticsContainer />
          </div>
        </Panel>
      </PanelWrap>

      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={<AdvancedAnalytics24 />}
      />
    </div>
  );
}
