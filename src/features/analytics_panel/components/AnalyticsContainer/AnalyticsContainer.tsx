import { useAtom } from '@reatom/react-v2';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { AnalyticsEmptyState } from '../AnalyticsEmptyState/AnalyticsEmptyState';
import { analyticsResourceAtom } from '../../atoms/analyticsResource';
import { AnalyticsDataList } from '../AnalyticsDataList/AnalyticsDataList';

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
      return <AnalyticsDataList data={dataList} />;
    },
  });
};
