import { TranslationService as i18n } from '~core/localization';
import { AnalyticsData, Severity } from '~core/types';
import { Panel, PanelIcon, Tabs, Text } from '@k2-packages/ui-kit';
import { createStateMap } from '~utils/atoms/createStateMap';
import s from './AnalyticsPanel.module.css';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { ReactElement, useCallback, useState } from 'react';
import clsx from 'clsx';
import { Tab } from '@k2-packages/ui-kit/tslib/Tabs';
import { AnalyticsDataList } from '~features/analytics_panel/components/AnalyticsDataList/AnalyticsDataList';
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

interface AnalyticsPanelProps {
  error: string | null;
  loading: boolean;
  analyticsDataList?: AnalyticsData[] | null;
}

export function AnalyticsPanel({
  error,
  loading,
  analyticsDataList,
}: AnalyticsPanelProps) {
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
  } else if (analyticsDataList) {
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
    data: analyticsDataList,
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
        className={clsx(s.sidePanel, isOpen && s.show, !isOpen && s.hide)}
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
              const geometry =
                focusedGeometry?.geometry as GeoJSON.FeatureCollection;
              if (geometry.features && geometry.features.length == 0) {
                return <AnalyticsEmptyState />;
              }
              return (
                <Tabs onTabChange={setTab} current={currentTab}>
                  <Tab name="INFO" id="data">
                    <AnalyticsDataList
                      data={analyticsDataList}
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
