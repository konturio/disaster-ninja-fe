import { Select } from '@konturio/ui-kit';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useAtom } from '@reatom/react';
import { Plus16 } from '@konturio/default-icons';
import { nanoid } from 'nanoid';
import cn from 'clsx';
import { i18n } from '~core/localization';
import { bivariateColorManagerAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManager';
import { bivariateColorManagerResourceAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import { capitalize } from '~utils/common';
import style from './ColorLegendFilters.module.css';
import type { SelectItemType } from '@konturio/ui-kit/tslib/Select/types';

const LayersFilterMenuClasses = {
  menu: style.LayersFilterMenu,
  noValue: style.NoValue,
};

type FilterValueType = { key: string; value: SelectItemType['value'][] };

export const ColorLegendFilters = () => {
  const [indicators, { setLayersFilter }] = useAtom(
    bivariateColorManagerAtom,
    (state) => state.indicators,
  );

  const [loading] = useAtom(
    bivariateColorManagerResourceAtom,
    (state) => state.loading,
  );

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
    const directionsData: SelectItemType[] = [];

    function processDirectionItem(directionItem: string) {
      if (!uniqueDirectionsSet.has(directionItem)) {
        uniqueDirectionsSet.add(directionItem);
        directionsData.push({
          title: capitalize(directionItem),
          value: directionItem,
        });
      }
    }

    indicators?.forEach((indicator) => {
      const {
        direction: [startDirection, endDirection],
      } = indicator;
      startDirection.forEach(processDirectionItem);
      endDirection.forEach(processDirectionItem);
    });

    return directionsData;
  }, [indicators]);

  const [sentimentFiltersCount, setSentimentFiltersCount] = useState<number>(1);
  const sentimentFilterValues = useRef<FilterValueType[]>([
    { key: nanoid(4), value: [] },
  ]);

  const onResetSentiments = useCallback(
    (index: number) => {
      if (
        sentimentFilterValues.current[index].value &&
        sentimentFilterValues.current[index].value.length
      ) {
        if (index !== 0) {
          sentimentFilterValues.current.splice(index, 1);
          setSentimentFiltersCount(sentimentFiltersCount - 1);
        } else {
          if (sentimentFiltersCount === 2) {
            setSentimentFiltersCount(1);
            sentimentFilterValues.current[0].value = [];
          } else {
            sentimentFilterValues.current.shift();
            setSentimentFiltersCount(sentimentFiltersCount - 1);
          }
        }
      }
    },
    [sentimentFiltersCount, setSentimentFiltersCount],
  );

  const onSelectSentiment = useCallback(
    (
      selection: SelectItemType | SelectItemType[] | null | undefined,
      index: number,
    ) => {
      if (selection && Array.isArray(selection) && selection?.length) {
        if (
          !sentimentFilterValues.current[index].value ||
          !sentimentFilterValues.current[index].value.length
        ) {
          sentimentFilterValues.current.push({ key: nanoid(4), value: [] });
          setSentimentFiltersCount(sentimentFiltersCount + 1);
        }
        sentimentFilterValues.current[index].value = selection?.map(
          (itm) => itm.value,
        );
      } else {
        onResetSentiments(index);
      }
    },
    [sentimentFiltersCount, setSentimentFiltersCount, onResetSentiments],
  );

  return (
    <div className={style.ListFilters}>
      <div className={style.SentimentsFiltersContainer}>
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
            classes={LayersFilterMenuClasses}
            className={cn(
              style.SentimentsFilters,
              sentimentFiltersCount !== 1 && index === sentimentFiltersCount - 1
                ? style.SentimentsAddButton
                : undefined,
            )}
            value={sentimentFilterValues.current[index].value}
            items={selectDirectionsData}
            multiselect="aggregate"
            disabled={loading}
          >
            {index === 0 ? (
              i18n.t('bivariate.color_manager.sentiments_combinations_filter')
            ) : (
              <Plus16 />
            )}
          </Select>
        ))}
      </div>

      <Select
        onChange={(item) => setLayersFilter(item.selectedItem || null)}
        classes={LayersFilterMenuClasses}
        className={style.LayersFilters}
        items={selectIndicatorsData}
        disabled={loading}
      >
        {i18n.t('bivariate.color_manager.layers_filter')}
      </Select>
    </div>
  );
};
