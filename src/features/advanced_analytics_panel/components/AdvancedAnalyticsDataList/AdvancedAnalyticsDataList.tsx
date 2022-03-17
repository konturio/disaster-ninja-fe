import { useState, useEffect } from 'react';
import { useAtom } from '@reatom/react';
import { LocaleNumber } from '~core/localization';
import s from './AdvancedAnalyticsData.module.css';
import { AdvancedAnalyticsData } from '~core/types';
import { worldAnalyticsResource } from '~features/advanced_analytics_panel/atoms/advancedAnalyticsWorldResource';

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

function qualityWithColor(_quality, _color) {
  _quality = Number.isInteger(_quality) ? _quality : _quality.toFixed(decimal);
  return <span style={{ color: _color }}>{_quality}</span>;
}

function qualityFromatter(_values) {
  if (_values.quality != undefined) {
    const _quality = _values.quality;
    return _quality < maxQuality && _quality > minQuality
      ? qualityWithColor(_quality, goodQualityColor)
      : qualityWithColor(_quality, badQualityColor);
  } else return <br />;
}

function valueFormatter(_value) {
  _value = Number.isInteger(_value) ? _value : _value.toFixed(decimal);
  return <LocaleNumber>{parseFloat(_value)}</LocaleNumber>;
}

export const AdvancedAnalyticsDataList = ({
  data,
}: AdvancedAnalyticsDataListProps) => {
  const [listData, setList] = useState(data);
  const [stateNumerator, setNumerator] = useState('');
  const [stateDenominator, setDenominator] = useState('');
  const [worldList, setWorldList] = useAtom(worldAnalyticsResource);
  const [seeWorld, setSeeWorld] = useState(false);

  function onNominatorFilterChange(e) {
    const numerator = e.target.value.toLowerCase();
    const filteredData = data?.filter(function (values) {
      return (
        values.numeratorLabel.toLowerCase().includes(numerator) &&
        values.denominatorLabel.toLowerCase().includes(stateDenominator)
      );
    });

    setList(filteredData);
    setNumerator(numerator);
  }

  function onDenominatorFilterChange(e) {
    const denominator = e.target.value.toLowerCase();
    const filteredData = data?.filter(function (values) {
      return (
        values.numeratorLabel.toLowerCase().includes(stateNumerator) &&
        values.denominatorLabel.toLowerCase().includes(denominator)
      );
    });

    setList(filteredData);
    setDenominator(denominator);
  }

  function getWorlData() {
    setSeeWorld(true);
    if (!worldList.data) {
      setWorldList.getWorld();
    } else {
      loadWorldDataList();
    }
  }

  useEffect(() => {
    if (seeWorld) {
      loadWorldDataList();
    }
  }, [worldList.data]);

  function loadWorldDataList() {
    setList(worldList.data);
    setSeeWorld(false);
  }

  return (
    <div className={s.table_scroll}>
      <a href="#" onClick={getWorlData}>
        Load World Data
      </a>
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

          {listData &&
            listData.map((dataItem, index) => (
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
                      <div>{valueFormatter(values.value)}</div>
                      <div>{qualityFromatter(values)}</div>
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
