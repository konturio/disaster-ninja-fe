import { Button, Select } from '@konturio/ui-kit';
import { useMemo } from 'react';
import { useAtom } from '@reatom/react';
import { i18n } from '~core/localization';
import { bivariateColorManagerAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManager';
import { bivariateColorManagerResourceAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import { capitalize } from '~utils/common';
import style from './ColorLegendFilters.module.css';
import type { SelectItemType } from '@konturio/ui-kit/tslib/Select/types';

const LayersFilterMenuClasses = { menu: style.LayersFilterMenu };

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

  return (
    <div className={style.ListFilters}>
      <Select
        //onChange={(item) => setLayersFilter(item.selectedItem || null)}
        classes={LayersFilterMenuClasses}
        className={style.SentimentsFilters}
        items={selectDirectionsData}
        multiselect="aggregate"
        disabled={loading}
      >
        {i18n.t('bivariate.color_manager.sentiments_combinations_filter')}
      </Select>
      <Button>Test</Button>
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
