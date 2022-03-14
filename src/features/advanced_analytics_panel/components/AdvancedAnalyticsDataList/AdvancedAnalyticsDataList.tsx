import { useState } from 'react';
import s from './AnalyticsData.module.css';
import { AdvancedAnalyticsData } from '~core/types';

interface AdvancedAnalyticsDataListProps {
  data?: AdvancedAnalyticsData[] | null;
}

const calculations = [
  'Numerator',
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

const qualityWithColor = (_quality, _color) => (
  <span style={{ color: _color }}>{_quality?.toFixed(decimal)}</span>
);

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
    const numerator = e.target.value.toLowerCase();
    const filteredData = data?.filter(function (values) {
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
    const denominator = e.target.value.toLowerCase();
    const filteredData = data?.filter(function (values) {
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
        <tbody>
          <tr>
            {calculations.map((item, index) => (
              <th key={`${item}_${index}`} align="left">
                {item}
              </th>
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
            state.listData.map((dataItem, index) => (
              <tr key={`${dataItem.numerator}_${index}`}>
                <td className={s.numerator}>
                  <div>{dataItem.numeratorLabel}</div>
                  <br></br>
                </td>
                <td className={s.denominator}>
                  <div>{dataItem.denominatorLabel}</div>
                  <br></br>
                </td>
                {dataItem.analytics &&
                  dataItem.analytics.map((values, index) => (
                    <td key={index}>
                      <div>{values.value.toFixed(decimal)}</div>
                      <div>{qualityFromatter(values.quality)}</div>
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
