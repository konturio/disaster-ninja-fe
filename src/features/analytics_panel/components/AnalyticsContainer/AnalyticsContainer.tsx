import { useAtom } from '@reatom/react-v2';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@konturio/ui-kit';
import { AnalyticsEmptyState } from '~features/analytics_panel/components/AnalyticsEmptyState/AnalyticsEmptyState';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms';
import { analyticsResourceAtom } from '~features/analytics_panel/atoms/analyticsResource';
import { i18n } from '~core/localization';
import { AnalyticsDataList } from '~features/analytics_panel/components/AnalyticsDataList/AnalyticsDataList';
import { focusedGeometryAtom } from '~core/focused_geometry/model';

export const AnalyticsContainer = () => {
  const [{ error, loading, data }] = useAtom(analyticsResourceAtom);
  const [focusedGeometry] = useAtom(focusedGeometryAtom);

  const statesToComponents = createStateMap({
    error,
    loading,
    data,
  });

  return statesToComponents({
    init: <AnalyticsEmptyState />,
    loading: <LoadingSpinner />,
    error: (errorMessage) => <ErrorMessage message={errorMessage} />,
    ready: (dataList) => {
      const geometry = focusedGeometry?.geometry;
      if (
        geometry === undefined ||
        ('features' in geometry && geometry.features.length == 0)
      ) {
        return <AnalyticsEmptyState />;
      }
      return (
        <Tabs>
          <TabList style={{ display: 'none' }}>
            <Tab>{i18n.t('analytics_panel.info_tab')}</Tab>
            {/*<Tab>*/}
            {/*  COMMUNITIES */}
            {/*</Tab>*/}
          </TabList>
          <TabPanels>
            <TabPanel>
              <AnalyticsDataList data={dataList} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      );
    },
  });
};
