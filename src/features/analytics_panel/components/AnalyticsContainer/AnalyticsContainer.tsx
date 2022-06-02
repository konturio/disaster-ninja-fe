import { AnalyticsEmptyState } from '~features/analytics_panel/components/AnalyticsEmptyState/AnalyticsEmptyState';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { AnalyticsDataList } from '~features/analytics_panel/components/AnalyticsDataList/AnalyticsDataList';
import { createStateMap } from '~utils/atoms';
import { useAtom } from '@reatom/react';
import { analyticsResourceAtom } from '~features/analytics_panel/atoms/analyticsResource';
import { useCallback, useState } from 'react';
import { focusedGeometryAtom } from '~core/shared_state';
import { Tabs } from '@konturio/ui-kit';
import { Tab } from '@konturio/ui-kit/tslib/Tabs';

const AnalyticsContainer = () => {
  const [{ error, loading, data }] = useAtom(analyticsResourceAtom);
  const [focusedGeometry] = useAtom(focusedGeometryAtom);

  const statesToComponents = createStateMap({
    error,
    loading,
    data,
  });

  const [currentTab, setCurrentTab] = useState<string>('data');

  const setTab = useCallback(
    (tabId: string) => {
      setCurrentTab(tabId);
    },
    [setCurrentTab],
  );

  return statesToComponents({
    init: <AnalyticsEmptyState />,
    loading: <LoadingSpinner />,
    error: (errorMessage) => <ErrorMessage message={errorMessage} />,
    ready: (dataList) => {
      const geometry = focusedGeometry?.geometry as GeoJSON.FeatureCollection;
      if (geometry.features && geometry.features.length == 0) {
        return <AnalyticsEmptyState />;
      }
      return (
        <Tabs onTabChange={setTab} current={currentTab}>
          <Tab name="INFO" id="data">
            <AnalyticsDataList
              data={dataList}
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
  }}) as JSX.Element;
}

export default AnalyticsContainer;
