import { useState, useEffect } from 'react';
import { useAtom } from '@reatom/react';
import core from '~core/index';
import { worldAnalyticsResource } from '~features/advanced_analytics_panel/atoms/advancedAnalyticsWorldResource';
import { LocaleNumber } from '~components/LocaleNumber/LocaleNumber';
import s from './AdvancedAnalyticsData.module.css';
import type { AdvancedAnalyticsData } from '~core/types';

interface AdvancedAnalyticsDataListProps {
  data?: AdvancedAnalyticsData[] | null;
}

const sum = 'sum',
  min = 'min',
  max = 'max',
  mean = 'mean',
  stddev = 'stddev',
  median = 'median';

const calculations = [
  core.i18n.t('advanced_analytics_data_list.numerator'),
  core.i18n.t('advanced_analytics_data_list.normalized_by'),
  core.i18n.t('advanced_analytics_data_list.sum'),
  core.i18n.t('advanced_analytics_data_list.min'),
  core.i18n.t('advanced_analytics_data_list.max'),
  core.i18n.t('advanced_analytics_data_list.mean'),
  core.i18n.t('advanced_analytics_data_list.stddev'),
  core.i18n.t('advanced_analytics_data_list.median'),
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

function qualityFromatter(_quality) {
  if (_quality != undefined) {
    return _quality < maxQuality && _quality > minQuality
      ? qualityWithColor(_quality, goodQualityColor)
      : qualityWithColor(_quality, badQualityColor);
  } else return <br />;
}

function valueFormatter(_value) {
  if (_value != undefined) {
    _value = Number.isInteger(_value) ? _value : _value.toFixed(decimal);
    return <LocaleNumber>{parseFloat(_value)}</LocaleNumber>;
  } else return <br />;
}

export const AdvancedAnalyticsDataList = ({ data }: AdvancedAnalyticsDataListProps) => {
  const [listData, setList] = useState(data);
  //used to aware all world data being watched
  const [activeList, setActiveList] = useState(data);
  const [stateNumerator, setNumerator] = useState('');
  const [stateDenominator, setDenominator] = useState('');
  const [worldList, setWorldList] = useAtom(worldAnalyticsResource);
  const [seeWorld, setSeeWorld] = useState(false);
  const [checkFilter, setCheckFilter] = useState([
    { checked: false, value: sum },
    { checked: false, value: min },
    { checked: false, value: max },
    { checked: false, value: mean },
    { checked: false, value: stddev },
    { checked: false, value: median },
  ]);

  const onNominatorFilterChange = (e) => {
    //check if all world loaded
    let filteredData;
    if (data === activeList) {
      filteredData = data;
    } else {
      filteredData = worldList.data;
    }
    const numerator = e.target.value.toLowerCase();
    filteredData = filteredData?.filter(function (values) {
      return (
        values.numeratorLabel.toLowerCase().includes(numerator) &&
        values.denominatorLabel.toLowerCase().includes(stateDenominator)
      );
    });

    setList(filteredData);
    setNumerator(numerator);
  };

  const onDenominatorFilterChange = (e) => {
    //check if all world loaded
    let filteredData;
    if (data === activeList) {
      filteredData = data;
    } else {
      filteredData = worldList.data;
    }
    const denominator = e.target.value.toLowerCase();
    filteredData = filteredData?.filter(function (values) {
      return (
        values.numeratorLabel.toLowerCase().includes(stateNumerator) &&
        values.denominatorLabel.toLowerCase().includes(denominator)
      );
    });

    setList(filteredData);
    setDenominator(denominator);
  };

  function doCheckFilter() {
    setList(data);
    let filteredData = data;
    checkFilter.forEach(function (item) {
      if (item.checked) {
        filteredData = filteredData?.filter((obj) =>
          obj.analytics.some(
            (cat) =>
              cat.calculation === item.value &&
              cat.quality != null &&
              cat.quality > minQuality &&
              cat.quality < maxQuality,
          ),
        );
        setList(filteredData);
      }
    });
  }

  function setFilterChecked(_clicked, _calculation) {
    checkFilter.forEach(function (item) {
      if (item.value == _calculation) {
        return (item.checked = _clicked);
      }
    });
    setCheckFilter(checkFilter);
    doCheckFilter();
  }

  const sumClick = (e) => {
    setFilterChecked(e.target.checked, sum);
  };

  const minClick = (e) => {
    setFilterChecked(e.target.checked, min);
  };

  const maxClick = (e) => {
    setFilterChecked(e.target.checked, max);
  };

  const meanClick = (e) => {
    setFilterChecked(e.target.checked, mean);
  };

  const stddevClick = (e) => {
    setFilterChecked(e.target.checked, stddev);
  };

  const medianClick = (e) => {
    setFilterChecked(e.target.checked, median);
  };

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
    //set to know active list
    setActiveList(worldList.data);
    setSeeWorld(false);
  }

  return (
    <div className={s.table_scroll}>
      <a href="#" onClick={getWorlData}>
        {core.i18n.t('advanced_analytics_data_list.load_world_data')}
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
                placeholder={core.i18n.t('advanced_analytics_data_list.filter_nominator')}
                type="text"
                onChange={onNominatorFilterChange}
              />
            </td>
            <td>
              <input
                className={s.filter_text}
                placeholder={core.i18n.t(
                  'advanced_analytics_data_list.filter_denominator',
                )}
                type="text"
                onChange={onDenominatorFilterChange}
              />
            </td>
            <td>
              <input className={s.switch} type="checkbox" onClick={sumClick} />
            </td>

            <td>
              <input className={s.switch} type="checkbox" onClick={minClick} />
            </td>

            <td>
              <input className={s.switch} type="checkbox" onClick={maxClick} />
            </td>

            <td>
              <input className={s.switch} type="checkbox" onClick={meanClick} />
            </td>

            <td>
              <input className={s.switch} type="checkbox" onClick={stddevClick} />
            </td>

            <td>
              <input className={s.switch} type="checkbox" onClick={medianClick} />
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
