import { useAtom } from '@reatom/npm-react';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { PagesDocument } from '~core/pages';
import { i18n } from '~core/localization';
import { llmAnalyticsAtom } from '~features/llm_analytics/atoms/llmAnalyticsResource';
import { LLMAnalyticsEmptyState } from '../LLMAnalyticsEmptyState/LLMAnalyticsEmptyState';
import { MarkdownWrapper } from '../MarkdownWrapper/MarkdownWrapper';

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
            wrapperComponent={MarkdownWrapper}
            id="llm_analytics"
          />
        </>
      );
    },
  });
};
