import { useAtom } from '@reatom/react-v2';
import { Heading } from '@konturio/ui-kit';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { createStateMap } from '~utils/atoms';
import { SeverityIndicator } from '~components/SeverityIndicator/SeverityIndicator';
import styles from './AnalyticsPanelHeader.module.css';
import type { AdvancedAnalyticsData, AnalyticsData, Severity } from '~core/types';
import type { AsyncAtomState } from '~utils/atoms/createAsyncAtom/types';
import type { FocusedGeometry, GeometrySource } from '~core/focused_geometry/types';
import type { Atom } from '@reatom/core-v2';

function PanelHeading({ source }: { source?: GeometrySource }) {
  if (source?.type !== 'event') return null;
  return (
    <div className={styles.head}>
      <Heading type="heading-05">{source.meta.eventName}</Heading>
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
      loading: () => <Heading type="heading-05">{loadingMessage}</Heading>,
      error: () => null,
      ready: () =>
        ({
          event: <PanelHeading source={focusedGeometry?.source} />,
          boundaries: (
            <Heading type="heading-05">
              {getBoundaryName(focusedGeometry?.source)}
            </Heading>
          ),
        })[sourceType],
    }) || <></>
  );
};

export default AnalyticsPanelHeader;
