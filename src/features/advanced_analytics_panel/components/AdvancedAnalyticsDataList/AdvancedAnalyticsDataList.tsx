import s from './AnalyticsData.module.css';
import { AdvancedAnalyticsData } from '~core/types';
import { TranslationService as t } from '~core/localization';
import { Tooltip } from '~components/Tooltip/Tooltip';

interface AdvancedAnalyticsDataListProps {
  data?: AdvancedAnalyticsData[] | null;
}

// is there table on k2? may need table sort
// solve min - max width height | use screen width, heights
// make it work with local be
// TODO may get this from data, use translate
const calculations = [
  'Nominator',
  'Normalized By',
  'Sum',
  'Min',
  'Max',
  'Mean',
  'Stddev',
  'Median',
];

export const AdvancedAnalyticsDataList = ({
  data,
}: AdvancedAnalyticsDataListProps) => {
  return (
    <div className={s.table_scroll}>
      <table className={s.table_width}>
        <tr>
          {calculations.map((item, index) => (
            <th align="left">{item}</th>
          ))}
        </tr>
        {data &&
          data.map((dataItem, index) => (
            <tr>
              <td>
                <div>{dataItem.numeratorLabel}</div>
              </td>
              <td>
                <div>{dataItem.denominatorLabel}</div>
              </td>
              {dataItem.analytics &&
                dataItem.analytics.map((values, index) => (
                  <>
                    <td>
                      <div>{Number(values.value.toFixed(1))}</div>
                      <div>{Number(values.quality.toFixed(1))}</div>
                    </td>
                  </>
                ))}
            </tr>
          ))}
      </table>
    </div>
  );
};
