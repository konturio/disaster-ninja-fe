import { useAtom } from '@reatom/react';
import { Text } from '@konturio/ui-kit';
import { focusedGeometryAtom } from '~core/shared_state';
import { createStateMap } from '~utils/atoms';
import { i18n } from '~core/localization';
import { SeverityIndicator } from '~components/SeverityIndicator/SeverityIndicator';
import styles from './AnalyticsPanelHeader.module.css';
import type { Severity } from '~core/types';
import type { ResourceAtomType } from '~utils/atoms/createResourceAtom';

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
  resourceAtom: ResourceAtomType<any, any>;
  messages: {
    init: string;
    loading: string;
    error: string;
    other: string;
  };
}

const AnalyticsPanelHeader = ({
  resourceAtom,
  messages,
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

  return statesToComponents({
    init: () => <Text type="heading-m">{i18n.t(messages.init)}</Text>,
    loading: () => <Text type="heading-m">{i18n.t(messages.loading)}</Text>,
    error: () => <Text type="heading-m">{i18n.t(messages.error)}</Text>,
    ready: () =>
      ({
        event: <PanelHeading event={(focusedGeometry?.source as any).meta} />,
        boundaries: (
          <Text type="heading-m">{(focusedGeometry?.source as any).meta}</Text>
        ),
        other: <Text type="heading-m">{i18n.t(messages.other)}</Text>,
      }[sourceType]),
  }) as JSX.Element;
};

export default AnalyticsPanelHeader;
