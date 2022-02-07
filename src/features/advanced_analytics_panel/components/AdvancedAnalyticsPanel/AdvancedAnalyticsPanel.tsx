import { TranslationService as i18n } from '~core/localization';
import { AdvancedAnalyticsData, Severity } from '~core/types';
import { Panel, PanelIcon, Tabs, Text } from '@k2-packages/ui-kit';
import { createStateMap } from '~utils/atoms/createStateMap';
import s from './AdvancedAnalyticsPanel.module.css';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { ReactElement, useCallback, useState } from 'react';
import clsx from 'clsx';
import { Tab } from '@k2-packages/ui-kit/tslib/Tabs';
import { AdvancedAnalyticsDataList } from '~features/advanced_analytics_panel/components/AdvancedAnalyticsDataList/AdvancedAnalyticsDataList';
import { useAtom } from '@reatom/react';
import { SeverityIndicator } from '~components/SeverityIndicator/SeverityIndicator';
import { AnalyticsEmptyState } from '~features/analytics_panel/components/AnalyticsEmptyState/AnalyticsEmptyState';
import { AnalyticsPanelIcon } from '@k2-packages/default-icons';
import { focusedGeometryAtom } from '~core/shared_state';

interface PanelHeadingProps {
  event: {
    eventName: string;
    severity: Severity;
    externalUrls: string[];
  };
}

function PanelHeading({ event }: PanelHeadingProps) {
  return (
    <div className={s.head}>
      <Text type="heading-m">{event.eventName}</Text>
      <SeverityIndicator severity={event.severity} />
    </div>
  );
}

interface AdvancedAnalyticsPanelProps {
  error: string | null;
  loading: boolean;
  advancedAnalyticsDataList?: AdvancedAnalyticsData[] | null;
}

export function AdvancedAnalyticsPanel({
  error,
  loading,
  advancedAnalyticsDataList,
}: AdvancedAnalyticsPanelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('data');
  const [focusedGeometry] = useAtom(focusedGeometryAtom);

  let panelHeading: ReactElement;
  if (loading) {
    panelHeading = (
      <Text type="heading-m">{i18n.t('Loading analytics...')}</Text>
    );
  } else if (error) {
    panelHeading = <Text type="heading-m">{i18n.t('Error')}</Text>;
  } else if (advancedAnalyticsDataList) {
    if (focusedGeometry?.source.type === 'event') {
      panelHeading = <PanelHeading event={focusedGeometry.source.meta} />;
    } else if (focusedGeometry?.source.type === 'boundaries') {
      panelHeading = (
        <Text type="heading-m">{focusedGeometry.source.meta}</Text>
      );
    } else {
      panelHeading = <Text type="heading-m">{i18n.t('Analytics')}</Text>;
    }
  } else {
    panelHeading = <Text type="heading-m">{i18n.t('Select Geometry')}</Text>;
  }

  const statesToComponents = createStateMap({
    error,
    loading,
    data: advancedAnalyticsDataList,
  });

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const setTab = useCallback(
    (tabId: string) => {
      setCurrentTab(tabId);
    },
    [setCurrentTab],
  );

  return (
    <div className={s.panelContainer}>
      <Panel
        header={panelHeading}
        onClose={onPanelClose}
        className={clsx(s.sidePannel, isOpen && s.show, !isOpen && s.hide)}
        classes={{
          header: s.header,
        }}
      >
        <div className={s.panelBody}>
          {statesToComponents({
            init: <AnalyticsEmptyState />,
            loading: <LoadingSpinner />,
            error: (errorMessage) => <ErrorMessage message={errorMessage} />,
            ready: (dataList) => {
              return (
                <Tabs onTabChange={setTab} current={currentTab}>
                  <Tab name="INFO" id="data">
                    <AdvancedAnalyticsDataList
                      data={advancedAnalyticsDataList}
                      links={
                        (focusedGeometry?.source as any)?.meta?.externalUrls ??
                        undefined
                      }
                    />
                  </Tab>
                  {/*<Tab name="COMMUNITIES" id="communities">*/}
                  {/*  <AnalyticsCommunities />*/}
                  {/*</Tab>*/}
                </Tabs>
              );
            },
          })}
        </div>
      </Panel>
      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={<AnalyticsPanelIcon />}
      />
    </div>
  );
}
