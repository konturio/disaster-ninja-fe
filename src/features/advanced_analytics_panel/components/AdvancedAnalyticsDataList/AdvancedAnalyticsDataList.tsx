import { useState } from 'react';
import s from './AnalyticsData.module.css';
import { AdvancedAnalyticsData } from '~core/types';
import { TranslationService as t } from '~core/localization';
import { Tooltip } from '~components/Tooltip/Tooltip';
import { stateFlagsSystem } from 'react-virtuoso/dist/stateFlagsSystem';

interface AdvancedAnalyticsDataListProps {
  data?: AdvancedAnalyticsData[] | null;
}

// is there table on k2? may need table sort
// solve min - max width height | use screen width, heights
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

const badQualityColor = '#ff453b',
  goodQualityColor = '#00b221',
  decimal = 3,
  maxQuality = 1.7,
  minQuality = -1.7;

function qualityWithColor(_quality, _color) {
  _quality = _quality.toFixed(decimal);
  return <span style={{ color: _color }}>{_quality}</span>;
}

function qualityFromatter(_quality: number) {
  return _quality < maxQuality && _quality > minQuality
    ? qualityWithColor(_quality, goodQualityColor)
    : qualityWithColor(_quality, badQualityColor);
}

export const AdvancedAnalyticsDataList = ({
  data,
}: AdvancedAnalyticsDataListProps) => {
  const [state, setState] = useState({
    listData: data,
    numerator: '',
    denominator: '',
  });

  function onNominatorFilterChange(e) {
    let numerator = e.target.value.toLowerCase();
    let filteredData = data?.filter(function (values) {
      return (
        values.numeratorLabel.toLowerCase().includes(numerator) &&
        values.denominatorLabel.toLowerCase().includes(state.denominator)
      );
    });
    setState({
      listData: filteredData,
      numerator: numerator,
      denominator: state.denominator,
    });
  }

  function onDenominatorFilterChange(e) {
    let denominator = e.target.value.toLowerCase();
    let filteredData = data?.filter(function (values) {
      return (
        values.numeratorLabel.toLowerCase().includes(state.numerator) &&
        values.denominatorLabel.toLowerCase().includes(denominator)
      );
    });
    setState({
      listData: filteredData,
      numerator: state.numerator,
      denominator: denominator,
    });
  }

  return (
    <div className={s.table_scroll}>
      <table className={s.table_in_panel}>
        <tr>
          {calculations.map((item) => (
            <th align="left">{item}</th>
          ))}
        </tr>

        <tr className={s.table_filter}>
          <td>
            <input
              className={s.filter_text}
              placeholder="Filter Nominator"
              type="text"
              onChange={onNominatorFilterChange.bind(this)}
            />
          </td>
          <td>
            <input
              className={s.filter_text}
              placeholder="Filter Denominator"
              type="text"
              onChange={onDenominatorFilterChange.bind(this)}
            />
          </td>
        </tr>

        {state.listData &&
          state.listData.map((dataItem) => (
            <tr>
              <td className={s.numerator}>
                <div>{dataItem.numeratorLabel}</div>
                <br></br>
              </td>
              <td className={s.denominator}>
                <div>{dataItem.denominatorLabel}</div>
                <br></br>
              </td>
              {dataItem.analytics &&
                dataItem.analytics.map((values) => (
                  <td>
                    <div>{values.value.toFixed(decimal)}</div>
                    <div>{qualityFromatter(values.quality)}</div>
                  </td>
                ))}
            </tr>
          ))}
      </table>
    </div>
  );
};
