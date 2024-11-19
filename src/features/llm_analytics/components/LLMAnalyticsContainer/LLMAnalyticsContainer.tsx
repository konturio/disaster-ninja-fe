import { useAtom } from '@reatom/npm-react';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { PagesDocument } from '~core/pages';
import { llmAnalyticsAtom } from '~features/llm_analytics/atoms/llmAnalyticsResource';
import { LLMAnalyticsEmptyState } from '../LLMAnalyticsEmptyState/LLMAnalyticsEmptyState';
import { MarkdownWrapper } from '../MarkdownWrapper/MarkdownWrapper';
import { LLMAnalyticsPlaceholder } from '../LLMAnalyticsPlaceholder/LLMAnalyticsPlaceholder';

export const LLMAnalyticsContainer = () => {
  const [{ error, loading, data }] = useAtom(llmAnalyticsAtom);
  const [focusedGeometry] = useAtom(focusedGeometryAtom.v3atom);

  const statesToComponents = createStateMap({
    error,
    loading,
    data,
  });

  return statesToComponents({
    init: <LLMAnalyticsEmptyState />,
    loading: <LoadingSpinner marginTop="10%" />,
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
        <>
          <LLMAnalyticsPlaceholder />
          <PagesDocument
            doc={[
              {
                type: 'md',
                data: data.data,
              },
            ]}
            wrapperComponent={MarkdownWrapper}
          />
        </>
      );
    },
  });
};
