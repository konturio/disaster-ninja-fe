import { Select } from '@konturio/ui-kit';
import { useMemo } from 'react';
import { useAtom } from '@reatom/react';
import { i18n } from '~core/localization';
import { bivariateColorManagerAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManager';
import { bivariateColorManagerResourceAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import style from './ColorLegendFilters.module.css';
import type { SelectItemType } from '@konturio/ui-kit/tslib/Select/types';

const LayersFilterMenuClasses = { menu: style.LayersFilterMenu };

export const ColorLegendFilters = () => {
  const [{ indicators }, { setLayersFilter }] = useAtom(
    bivariateColorManagerAtom,
  );

  const [{ loading }] = useAtom(bivariateColorManagerResourceAtom);

  const selectIndicatorsData: SelectItemType[] = useMemo(() => {
    return (
      indicators?.map((indicator) => ({
        title: indicator.label,
        value: indicator.name,
      })) || []
    );
  }, [indicators]);

  return (
    <div className={style.ListFilters}>
      <Select
        onChange={(item) => setLayersFilter(item.selectedItem || null)}
        classes={LayersFilterMenuClasses}
        items={selectIndicatorsData}
        disabled={loading}
      >
        {i18n.t('bivariate.color_manager.layers_filter')}
      </Select>
    </div>
  );
};
