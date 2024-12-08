import { useAtom } from '@reatom/react-v2';
import { Heading } from '@konturio/ui-kit';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { createStateMap } from '~utils/atoms';
import { SeverityIndicator } from '~components/SeverityIndicator/SeverityIndicator';
import {
  isEventGeometry,
  isBoundaryGeometry,
  getEventName,
  getEventSeverity,
  getBoundaryName,
} from '~core/focused_geometry/utils';
import styles from './AnalyticsPanelHeader.module.css';
import type { AdvancedAnalyticsData, AnalyticsData } from '~core/types';
import type { AsyncAtomState } from '~utils/atoms/createAsyncAtom/types';
import type { FocusedGeometry, GeometrySource } from '~core/focused_geometry/types';
import type { Atom } from '@reatom/core-v2';

function PanelHeading({ source }: { source?: GeometrySource }) {
  if (source.type !== 'event') return null;
  const severity = getEventSeverity({ source } as FocusedGeometry);
  const name = getEventName({ source } as FocusedGeometry);
  if (!severity || !name) return null;

  return (
    <div className={styles.head}>
      <Heading type="heading-05">{name}</Heading>
      <SeverityIndicator severity={severity} />
    </div>
  );
}

interface AnalyticsPanelHeaderParams {
  resourceAtom:
    | Atom<AsyncAtomState<FocusedGeometry | null, AnalyticsData[] | null>>
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

  const sourceType = isEventGeometry(focusedGeometry)
    ? 'event'
    : isBoundaryGeometry(focusedGeometry)
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
            <Heading type="heading-05">{getBoundaryName(focusedGeometry)}</Heading>
          ),
        })[sourceType],
    }) || <></>
  );
};

export default AnalyticsPanelHeader;
