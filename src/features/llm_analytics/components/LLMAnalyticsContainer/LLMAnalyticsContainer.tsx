import { useAtom } from '@reatom/react-v2';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { PagesDocument } from '~core/pages';
import { i18n } from '~core/localization';
import { LLMAnalyticsEmptyState } from '../LLMAnalyticsEmptyState/LLMAnalyticsEmptyState';
import { llmAnalyticsResourceAtom } from '../../atoms/llmAnalyticsResource';
import { SimpleWrapper } from '../SimpleWrapper/SimpleWrapper';

export const LLMAnalyticsContainer = () => {
  const [{ error, loading, data }] = useAtom(llmAnalyticsResourceAtom);
  const [focusedGeometry] = useAtom(focusedGeometryAtom);

  const statesToComponents = createStateMap({
    error,
    loading,
    data,
  });

  return statesToComponents({
    init: <LLMAnalyticsEmptyState />,
    loading: <LoadingSpinner />,
    error: (errorMessage) => <ErrorMessage message={errorMessage} />,
    ready: (data) => {
      const geometry = focusedGeometry?.geometry;
      if (
        geometry === undefined ||
        ('features' in geometry && geometry.features.length == 0)
      ) {
        return <LLMAnalyticsEmptyState />;
      }
      return (
        <PagesDocument
          doc={[
            {
              type: 'md',
              data: i18n.t('llm_analytics.header_info'),
            },
            {
              type: 'md',
              data: data.data,
            },
          ]}
          wrapperComponent={SimpleWrapper}
        />
      );
    },
  });
};
