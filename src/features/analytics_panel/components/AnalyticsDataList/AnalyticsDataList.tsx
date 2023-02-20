import { nanoid } from 'nanoid';
import { Text } from '@konturio/ui-kit';
import { InfoErrorOutline16 } from '@konturio/default-icons';
import s from './AnalyticsData.module.css';
import type { AnalyticsData } from '~core/types';
import type { PropsWithChildren } from 'react';

interface AnalyticsDataListProps {
  data?: AnalyticsData[] | null;
}

const Sub = ({ children }: PropsWithChildren) => (
  <span style={{ fontSize: '.7em', verticalAlign: 'super' }}>{children}</span>
);

function textFormatter(txt: string) {
  const km2Ind = txt.indexOf('km2');
  if (km2Ind !== -1) {
    const strLeft = txt.substring(0, km2Ind - 1);
    const strRight = txt.substring(km2Ind + 3);
    return (
      <>
        {strLeft} km<Sub>2</Sub>
        {strRight}
      </>
    );
  }
}

// TODO: need to replace with new endpoint call
const fakeData = [
  {
    formula: 'sumX',
    value: 240.0,
    unit: {
      id: 'ppl',
      shortName: 'ppl',
      longName: 'people',
    },
    prefix: 'Total',
    xlabel: 'Population',
  },
  {
    formula: 'sumX',
    value: 8.010919519578934,
    unit: {
      id: 'km2',
      shortName: 'km²',
      longName: 'square kilometers',
    },
    prefix: 'Total',
    xlabel: 'Populated area',
  },
  {
    formula: 'percentageXWhereNoY',
    value: 0.0,
    unit: {
      id: 'perc',
      shortName: '%',
      longName: 'percentage',
    },
    prefix: 'Percent with no',
    xlabel: 'Populated area',
    ylabel: 'OSM: objects count',
  },
  {
    formula: 'sumXWhereNoY',
    value: 0.0,
    unit: {
      id: 'km2',
      shortName: 'km²',
      longName: 'square kilometers',
    },
    prefix: 'Total with no',
    xlabel: 'Populated area',
    ylabel: 'OSM: objects count',
  },
  {
    formula: 'sumXWhereNoY',
    value: 0.667717288253069,
    unit: {
      id: 'km2',
      shortName: 'km²',
      longName: 'square kilometers',
    },
    prefix: 'Total with no',
    xlabel: 'Populated area',
    ylabel: 'OSM: buildings count',
  },
  {
    formula: 'sumXWhereNoY',
    value: 0.6675538724308014,
    unit: {
      id: 'km2',
      shortName: 'km²',
      longName: 'square kilometers',
    },
    prefix: 'Total with no',
    xlabel: 'Populated area',
    ylabel: 'OSM: road length',
  },
];

const formatFractionalNumbers = (num: number) =>
  Number.isInteger(num) ? num : num.toFixed(2);

export const AnalyticsDataList = ({ data }: AnalyticsDataListProps) => {
  return (
    <>
      {fakeData && (
        <>
          <div className={s.info}>
            <InfoErrorOutline16 />
            <Text type="caption">Calculations are made for the selected area.</Text>
          </div>

          {fakeData.map(({ value, unit, prefix, xlabel, ylabel }) => (
            <div key={nanoid(5)} className={s.stat}>
              <div className={s.labels}>
                <Text type="long-m">{xlabel}</Text>
                <Text type="caption">
                  {prefix} {ylabel}
                </Text>
              </div>
              <div className={s.values}>
                <Text type="long-m">{formatFractionalNumbers(value)}</Text>
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
};
