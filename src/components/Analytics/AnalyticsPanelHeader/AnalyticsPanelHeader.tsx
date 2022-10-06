import { useAtom } from '@reatom/react';
import { Text } from '@konturio/ui-kit';
import { focusedGeometryAtom } from '~core/shared_state';
import { createStateMap } from '~utils/atoms';
import { i18n } from '~core/localization';
import { SeverityIndicator } from '~components/SeverityIndicator/SeverityIndicator';
import styles from './AnalyticsPanelHeader.module.css';
import type { AdvancedAnalyticsData, AnalyticsData, Severity } from '~core/types';
import type { AsyncAtomState } from '~utils/atoms/createAsyncAtom/types';
import type { FocusedGeometry } from '~core/shared_state/focusedGeometry';
import type { Atom } from '@reatom/core';

interface PanelHeadingProps {
  event: {
    eventName: string;
    severity: Severity;
    externalUrls: string[];
  };
}

function PanelHeading({ event }: PanelHeadingProps) {
  return (
    <div className={styles.head}>
      <Text type="heading-m">{event.eventName}</Text>
      <SeverityIndicator severity={event.severity} />
    </div>
  );
}

interface AnalyticsPanelHeaderParams {
  resourceAtom:
    Atom<AsyncAtomState<FocusedGeometry | null, AnalyticsData[] | null>>
    | Atom<AsyncAtomState<FocusedGeometry | null, AdvancedAnalyticsData[] | null>>;
  loadingMessage: string;
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
          event: <PanelHeading event={(focusedGeometry?.source as any).meta} />,
          boundaries: (
            <Text type="heading-m">{(focusedGeometry?.source as any).meta}</Text>
          ),
        }[sourceType]),
    }) || <></>
  );
};

export default AnalyticsPanelHeader;
