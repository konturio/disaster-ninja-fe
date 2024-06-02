import { useAtom } from '@reatom/react-v2';
import { AnalyticsEmptyState } from '~features/analytics_panel/components/AnalyticsEmptyState/AnalyticsEmptyState';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { advancedAnalyticsResourceAtom } from '~features/advanced_analytics_panel/atoms/advancedAnalyticsResource';
import { AdvancedAnalyticsEmptyState } from '~features/advanced_analytics_panel/components/AdvancedAnalyticsEmptyState/AdvancedAnalyticsEmptyState';
import { AdvancedAnalyticsDataList } from '~features/advanced_analytics_panel/components/AdvancedAnalyticsDataList/AdvancedAnalyticsDataList';
import s from './AdvancedAnalyticsContainer.module.css';

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
    error: (errorMessage) => (
      <ErrorMessage message={errorMessage} containerClass={s.errorContainer} />
    ),
    ready: (dataList) => {
      const geometry = focusedGeometry?.geometry as GeoJSON.FeatureCollection;
      if (geometry.features && geometry.features.length === 0) {
        return <AnalyticsEmptyState />;
      }
      if (dataList?.length === 0) {
        return <AdvancedAnalyticsEmptyState />;
      }
      return <AdvancedAnalyticsDataList data={dataList} />;
    },
  }) as JSX.Element;
};
