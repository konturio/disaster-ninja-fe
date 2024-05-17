import { useAtom } from '@reatom/react-v2';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { PagesDocument } from '~core/pages';
import { LLMAnalyticsEmptyState } from '../LLMAnalyticsEmptyState/LLMAnalyticsEmptyState';
import { llmAnalyticsResourceAtom } from '../../atoms/llmAnalyticsResource';
import type { PropsWithChildren } from 'react';

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
              data: data.data,
            },
          ]}
          wrapperComponent={SimpleWrapper}
        />
      );
    },
  });
};

function SimpleWrapper({ children }: PropsWithChildren) {
  return (
    <div>
      <article>{children}</article>
    </div>
  );
}
