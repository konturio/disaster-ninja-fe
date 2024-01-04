import { Autocomplete, Checkbox, Select } from '@konturio/ui-kit';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useAtom } from '@reatom/react-v2';
import { Plus16 } from '@konturio/default-icons';
import { nanoid } from 'nanoid';
import cn from 'clsx';
import { i18n } from '~core/localization';
import { bivariateColorManagerResourceAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import { bivariateColorManagerDataAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerData';
import { capitalize } from '~utils/common';
import style from './ColorLegendFilters.module.css';
import type { SelectItemType } from '@konturio/ui-kit';

const SentimentFiltersClasses = {
  noValue: style.NoValue,
};

const LayerFilterClasses = {
  menu: style.AutocompleteMenu,
};

type FilterValueType = { key: string; value: string[] };

export const ColorLegendFilters = () => {
  const [
    { indicators, layersFilter, notDefinedFilter },
    { setLayersFilter, setSentimentsFilter, setNotDefinedSentimentsFilter },
  ] = useAtom(bivariateColorManagerDataAtom, (state) => ({
    indicators: state.indicators,
    layersFilter: state.filters.layers,
    notDefinedFilter: state.filters.notDefined,
  }));

  const [loading] = useAtom(bivariateColorManagerResourceAtom, (state) => state.loading);

  const selectIndicatorsData: SelectItemType[] = useMemo(() => {
    return (
      indicators?.map((indicator) => ({
        title: indicator.label,
        value: indicator.name,
      })) || []
    );
  }, [indicators]);

  // calculate unique direction items that are available in indicators list
  const selectDirectionsData: SelectItemType[] = useMemo(() => {
    const uniqueDirectionsSet = new Set<string>();

    indicators?.forEach((indicator) => {
      const {
        direction: [startDirection, endDirection],
      } = indicator;
      startDirection.forEach((di) => uniqueDirectionsSet.add(di));
      endDirection.forEach((di) => uniqueDirectionsSet.add(di));
    });

    return Array.from(uniqueDirectionsSet).map((directionItem) => ({
      title: capitalize(directionItem),
      value: directionItem,
    }));
  }, [indicators]);

  const [sentimentFiltersCount, setSentimentFiltersCount] = useState<number>(1);
  const sentimentFilterValues = useRef<FilterValueType[]>([
    { key: nanoid(4), value: [] },
  ]);

  const onResetSentiments = useCallback(
    (index: number) => {
      if (sentimentFilterValues.current[index]?.value?.length) {
        if (index !== 0) {
          // when clearing not first filter, just remove it's value from values array and reduce filters count
          sentimentFilterValues.current.splice(index, 1);
          setSentimentFiltersCount(sentimentFiltersCount - 1);
        } else {
          // when resetting first filter.
          // if sentiment filters count is 2 (actual filter and plus button (which is also a filter but without a
          // selected value)). Then set filters count to 1 and reset it's value, so plus button/filter will be removed,
          // only first actual filter without value will be shown
          if (sentimentFiltersCount === 2) {
            setSentimentFiltersCount(1);
            sentimentFilterValues.current[0].value = [];
          } else {
            // if amount of filters is more than 2. remove first filter and shift values
            sentimentFilterValues.current.shift();
            setSentimentFiltersCount(sentimentFiltersCount - 1);
          }
        }
        setSentimentsFilter(
          sentimentFilterValues.current.reduce((acc, sf) => {
            if (sf.value.length) {
              acc.push(sf.value);
            }
            return acc;
          }, [] as string[][]),
        );
      }
    },
    [sentimentFiltersCount, setSentimentFiltersCount, setSentimentsFilter],
  );

  const onSelectSentiment = useCallback(
    (selection: SelectItemType | SelectItemType[] | null | undefined, index: number) => {
      if (selection && Array.isArray(selection) && selection?.length) {
        if (!sentimentFilterValues.current[index]?.value?.length) {
          sentimentFilterValues.current.push({ key: nanoid(4), value: [] });
          setSentimentFiltersCount(sentimentFiltersCount + 1);
        }
        sentimentFilterValues.current[index].value = selection?.map((itm) =>
          itm.value.toString(),
        );
        setSentimentsFilter(
          sentimentFilterValues.current.reduce((acc, sf) => {
            if (sf.value.length) {
              acc.push(sf.value);
            }
            return acc;
          }, [] as string[][]),
        );

        setLayersFilter();
      } else {
        onResetSentiments(index);
      }
    },
    [
      sentimentFiltersCount,
      setSentimentFiltersCount,
      onResetSentiments,
      setLayersFilter,
      setSentimentsFilter,
    ],
  );

  const onChangeLayer = useCallback(
    (item) => {
      if (item.selectedItem && sentimentFilterValues.current[0].value?.length) {
        if (sentimentFiltersCount > 1) {
          setSentimentFiltersCount(1);
        }
        sentimentFilterValues.current.length = 1;
        sentimentFilterValues.current[0].value = [];
        setSentimentsFilter();
      }
      setLayersFilter(item.selectedItem?.value || undefined);
    },
    [
      setLayersFilter,
      sentimentFiltersCount,
      setSentimentFiltersCount,
      setSentimentsFilter,
    ],
  );

  const onSelectNotDefinedSentimentsFilter = useCallback(
    (isSelected: boolean) => {
      setNotDefinedSentimentsFilter(isSelected);
    },
    [setNotDefinedSentimentsFilter],
  );

  return (
    <div className={style.ListFilters}>
      {!loading && (
        <div className={style.FiltersContainer}>
          <Checkbox
            id="not_defined_sentiments_filter"
            label={i18n.t('bivariate.color_manager.not_defined') as string}
            className={style.NotDefinedCheckbox}
            onChange={onSelectNotDefinedSentimentsFilter}
            checked={notDefinedFilter}
          />
          {[...Array(sentimentFiltersCount)].map((item, index) => (
            <Select
              onClose={(changes) => {
                onSelectSentiment(changes, index);
              }}
              onReset={() => {
                onResetSentiments(index);
              }}
              key={
                index < sentimentFilterValues.current.length
                  ? sentimentFilterValues.current[index].key
                  : 'add_filter'
              }
              classes={SentimentFiltersClasses}
              className={cn(
                style.SentimentsFilters,
                index === sentimentFiltersCount - 1 && style.LastFilter,
                sentimentFiltersCount !== 1 && index === sentimentFiltersCount - 1
                  ? style.SentimentsAddButton
                  : undefined,
              )}
              value={sentimentFilterValues.current[index].value}
              items={selectDirectionsData}
              multiselect="aggregate"
            >
              {index === 0 ? (
                i18n.t('bivariate.color_manager.sentiments_combinations_filter')
              ) : (
                <Plus16 />
              )}
            </Select>
          ))}
          <Autocomplete
            onChange={onChangeLayer}
            className={style.LayersFilters}
            classes={LayerFilterClasses}
            items={selectIndicatorsData}
            value={layersFilter}
          >
            {i18n.t('bivariate.color_manager.layers_filter')}
          </Autocomplete>
        </div>
      )}
    </div>
  );
};
