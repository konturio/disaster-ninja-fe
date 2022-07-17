import { useAtom } from '@reatom/react';
import { useCallback, useState } from 'react';
import { Tabs } from '@konturio/ui-kit';
import { Tab } from '@konturio/ui-kit/tslib/Tabs';
import { AnalyticsEmptyState } from '~features/analytics_panel/components/AnalyticsEmptyState/AnalyticsEmptyState';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/shared_state';
import { advancedAnalyticsResourceAtom } from '~features/advanced_analytics_panel/atoms/advancedAnalyticsResource';
import { AdvancedAnalyticsEmptyState } from '~features/advanced_analytics_panel/components/AdvancedAnalyticsEmptyState/AdvancedAnalyticsEmptyState';
import { AdvancedAnalyticsDataList } from '~features/advanced_analytics_panel/components/AdvancedAnalyticsDataList/AdvancedAnalyticsDataList';

const AdvancedAnalyticsContainer = () => {
  const [{ error, loading, data }] = useAtom(advancedAnalyticsResourceAtom);
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
    init: <AdvancedAnalyticsEmptyState />,
    loading: <LoadingSpinner />,
    error: (errorMessage) => {
      return <ErrorMessage message={errorMessage} />;
    },
    ready: (dataList) => {
      const geometry = focusedGeometry?.geometry as GeoJSON.FeatureCollection;
      if (geometry.features && geometry.features.length == 0) {
        return <AnalyticsEmptyState />;
      }
      if (dataList?.length == 0) {
        return <AdvancedAnalyticsEmptyState />;
      }
      return (
        <Tabs onTabChange={setTab} current={currentTab}>
          <Tab name="Advanced Analytics" id="data">
            <AdvancedAnalyticsDataList data={dataList} />
          </Tab>
        </Tabs>
      );
    },
  }) as JSX.Element;
};

export default AdvancedAnalyticsContainer;
