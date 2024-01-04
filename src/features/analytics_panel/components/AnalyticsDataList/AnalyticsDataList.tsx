import { nanoid } from 'nanoid';
import { Text } from '@konturio/ui-kit';
import { InfoErrorOutline16 } from '@konturio/default-icons';
import { Trans } from 'react-i18next';
import { useAtom } from '@reatom/react-v2';
import { analyticsResourceAtom } from '../../atoms/analyticsResource';
import s from './AnalyticsData.module.css';
import type { AnalyticsData } from '~core/types';

interface AnalyticsDataListProps {
  data?: AnalyticsData[] | null;
}

/**
 * `undefined` locale means - delegate detection to browser
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument
 */
const intl = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

export function AnalyticsDataList({ data }: AnalyticsDataListProps) {
  const [analytics] = useAtom(analyticsResourceAtom);
  return (
    <>
      {analytics.data && (
        <>
          <div className={s.info}>
            <InfoErrorOutline16 />
            <Text type="caption">
              <span>
                <Trans i18nKey={'analytics_panel.info_short'} />
              </span>
            </Text>
          </div>

          {analytics.data.map(({ value, unit, prefix, xlabel, ylabel }) => (
            <div key={nanoid(5)} className={s.stat}>
              <div className={s.labels}>
                <Text type="long-m">{xlabel}</Text>
                <Text type="caption">
                  {prefix} {ylabel}
                </Text>
              </div>
              <div className={s.values}>
                <Text type="long-m">{intl.format(value)}</Text>
                <Text type="caption">
                  <span className={s.unitLabel}>{unit.shortName}</span>
                </Text>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
