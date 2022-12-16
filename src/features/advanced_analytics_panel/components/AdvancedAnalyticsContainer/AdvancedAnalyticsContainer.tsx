import { useAtom } from '@reatom/react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@konturio/ui-kit';
import { AnalyticsEmptyState } from '~features/analytics_panel/components/AnalyticsEmptyState/AnalyticsEmptyState';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/shared_state';
import { advancedAnalyticsResourceAtom } from '~features/advanced_analytics_panel/atoms/advancedAnalyticsResource';
import { AdvancedAnalyticsEmptyState } from '~features/advanced_analytics_panel/components/AdvancedAnalyticsEmptyState/AdvancedAnalyticsEmptyState';
import { AdvancedAnalyticsDataList } from '~features/advanced_analytics_panel/components/AdvancedAnalyticsDataList/AdvancedAnalyticsDataList';
import { i18n } from '~core/localization';

export const AdvancedAnalyticsContainer = () => {
  const [{ error, loading, data }] = useAtom(advancedAnalyticsResourceAtom);
  const [focusedGeometry] = useAtom(focusedGeometryAtom);

  const statesToComponents = createStateMap({
    error,
    loading,
    data,
  });

  return statesToComponents({
    init: <AdvancedAnalyticsEmptyState />,
    loading: <LoadingSpinner />,
    error: (errorMessage) => <ErrorMessage message={errorMessage} />,
    ready: (dataList) => {
      const geometry = focusedGeometry?.geometry as GeoJSON.FeatureCollection;
      if (geometry.features && geometry.features.length == 0) {
        return <AnalyticsEmptyState />;
      }
      if (dataList?.length == 0) {
        return <AdvancedAnalyticsEmptyState />;
      }
      return (
        <Tabs>
          <TabList style={{ display: 'none' }}>
            <Tab>{i18n.t('advanced_analytics_panel.analytics_tab')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AdvancedAnalyticsDataList data={dataList} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      );
    },
  }) as JSX.Element;
};
