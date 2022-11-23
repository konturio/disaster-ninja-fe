import { useAtom } from '@reatom/react';
import { Text } from '@konturio/ui-kit';
import { createStateMap } from '~core/store/atoms';
import core from '~core/index';
import { SeverityIndicator } from '~components/SeverityIndicator/SeverityIndicator';
import styles from './AnalyticsPanelHeader.module.css';
import type { AdvancedAnalyticsData, AnalyticsData, Severity } from '~core/types';
import type { AsyncAtomState } from '~core/store/atoms/createAsyncAtom/types';
import type { FocusedGeometry, GeometrySource } from '~core/shared_state/focusedGeometry';
import type { Atom } from '@reatom/core';

function PanelHeading({ source }: { source?: GeometrySource }) {
  if (source?.type !== 'event') return null;
  return (
    <div className={styles.head}>
      <Text type="heading-m">{source.meta.eventName}</Text>
      <SeverityIndicator severity={source.meta.severity} />
    </div>
  );
}

interface AnalyticsPanelHeaderParams {
  resourceAtom:
    | Atom<AsyncAtomState<FocusedGeometry | null, AnalyticsData[] | null>>
    | Atom<AsyncAtomState<FocusedGeometry | null, AdvancedAnalyticsData[] | null>>;
  loadingMessage: string;
}

function getBoundaryName(source?: GeometrySource) {
  if (!source || source.type !== 'boundaries') return '';
  if (source.type === 'boundaries') return source.meta.name;
  return '';
}

const AnalyticsPanelHeader = ({
  resourceAtom,
  loadingMessage,
}: AnalyticsPanelHeaderParams) => {
  const [{ error, loading, data }] = useAtom(resourceAtom);
  const [focusedGeometry] = useAtom(core.sharedState.focusedGeometryAtom);

  const statesToComponents = createStateMap({
    error,
    loading,
    data,
  });

  const sourceType =
    focusedGeometry?.source.type === 'event'
      ? 'event'
      : focusedGeometry?.source.type === 'boundaries'
      ? 'boundaries'
      : 'other';

  return (
    statesToComponents({
      loading: () => <Text type="heading-m">{loadingMessage}</Text>,
      error: () => null,
      ready: () =>
        ({
          event: <PanelHeading source={focusedGeometry?.source} />,
          boundaries: (
            <Text type="heading-m">{getBoundaryName(focusedGeometry?.source)}</Text>
          ),
        }[sourceType]),
    }) || <></>
  );
};

export default AnalyticsPanelHeader;
