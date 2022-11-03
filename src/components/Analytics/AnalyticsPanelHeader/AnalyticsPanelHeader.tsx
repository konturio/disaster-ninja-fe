import { useAtom } from '@reatom/react';
import { Text } from '@konturio/ui-kit';
import { focusedGeometryAtom } from '~core/shared_state';
import { createStateMap } from '~utils/atoms';
import { i18n } from '~core/localization';
import { SeverityIndicator } from '~components/SeverityIndicator/SeverityIndicator';
import styles from './AnalyticsPanelHeader.module.css';
import type { AdvancedAnalyticsData, AnalyticsData, Severity } from '~core/types';
import type { AsyncAtomState } from '~utils/atoms/createAsyncAtom/types';
import type { FocusedGeometry, GeometrySource } from '~core/shared_state/focusedGeometry';
import type { Atom } from '@reatom/core';

interface PanelHeadingProps {
  event: {
    eventName: string;
    severity: Severity;
    externalUrls: string[];
  };
}

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
  if (!source) return '';
  if (source.type === 'boundaries') return source.meta.name;
  if (source.type === 'event') return source.meta.eventName;
  if (source.type === 'episode') return source.meta.name;
  return '';
}

const AnalyticsPanelHeader = ({
  resourceAtom,
  loadingMessage,
}: AnalyticsPanelHeaderParams) => {
  const [{ error, loading, data }] = useAtom(resourceAtom);
  const [focusedGeometry] = useAtom(focusedGeometryAtom);

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
      loading: () => <Text type="heading-m">{i18n.t(loadingMessage)}</Text>,
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
