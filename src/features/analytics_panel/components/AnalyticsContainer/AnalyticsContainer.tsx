import { useAtom } from '@reatom/react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@konturio/ui-kit';
import { AnalyticsEmptyState } from '~features/analytics_panel/components/AnalyticsEmptyState/AnalyticsEmptyState';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms';
import { analyticsResourceAtom } from '~features/analytics_panel/atoms/analyticsResource';
import { focusedGeometryAtom } from '~core/shared_state';
import { i18n } from '~core/localization';
import { AnalyticsDataList } from '~features/analytics_panel/components/AnalyticsDataList/AnalyticsDataList';

const AnalyticsContainer = () => {
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
      const geometry = focusedGeometry?.geometry as GeoJSON.FeatureCollection;
      if (geometry.features && geometry.features.length == 0) {
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
              <AnalyticsDataList
                data={dataList}
                links={(focusedGeometry?.source as any)?.meta?.externalUrls ?? undefined}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      );
    },
  }) as JSX.Element;
};

export default AnalyticsContainer;
