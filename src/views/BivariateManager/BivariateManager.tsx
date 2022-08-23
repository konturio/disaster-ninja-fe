import { useAtom } from '@reatom/react';
import { Select } from '@konturio/ui-kit';
import { useMemo } from 'react';
import { bivariateColorManagerResourceAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import { bivariateColorManagerAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManager';
import { i18n } from '~core/localization';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { SentimentsCombinationsList } from '~features/bivariate_color_manager/components';
import { LegendWithMap } from '~features/bivariate_color_manager/components/LegendWithMap/LegendWithMap';
import {
  CSSTransitionWrapper,
  fadeClassNames,
} from '~features/bivariate_color_manager/components/CssTransitionWrapper/CssTransitionWrapper';
import s from './BivariateManager.module.css';
import type { LayerSelectionFull } from '~features/bivariate_color_manager/components/LegendWithMap/LegendWithMap';
import type { SelectItemType } from '@konturio/ui-kit/tslib/Select/types';
import type { BivariateColorManagerData } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';

const LayersFilterMenuClasses = { menu: s.LayersFilterMenu };
function itemToString(item) {
  return item ? item.title : '';
}

export function BivariateManagerPage() {
  const [
    { filteredData: data, indicators, layersSelection, selectedRows, filters },
    { setLayersSelection, setLayersFilter, setSelectedRows },
  ] = useAtom(bivariateColorManagerAtom);
  const [{ loading }] = useAtom(bivariateColorManagerResourceAtom);
  const filteredDataNotEmpty = data && Object.keys(data).length > 0;
  const selectedData =
    filteredDataNotEmpty && layersSelection?.key
      ? (data as BivariateColorManagerData)[layersSelection.key]
      : null;
  const fullSelection =
    layersSelection?.horizontal && layersSelection?.vertical;
  const anyFilterActivated = Object.values(filters).filter(Boolean).length > 0;

  const selectIndicatorsData: SelectItemType[] = useMemo(() => {
    return (
      indicators?.map((indicator) => ({
        title: indicator.label,
        value: indicator.name,
      })) || []
    );
  }, [indicators]);

  return (
    <div className={s.pageContainer}>
      <div className={s.Nav}></div>

      <div className={s.List}>
        <div className={s.ListFilters}>
          <Select
            onChange={(item) => setLayersFilter(item.selectedItem || null)}
            classes={LayersFilterMenuClasses}
            items={selectIndicatorsData}
            itemToString={itemToString}
            disabled={loading}
          >
            {i18n.t('bivariate.color_manager.layers_filter')}
          </Select>
        </div>
        <div className={s.ListBody}>
          {loading ? (
            <KonturSpinner />
          ) : (
            <SentimentsCombinationsList
              anyFilterActivated={anyFilterActivated}
              data={data as BivariateColorManagerData}
              setLayersSelection={setLayersSelection}
              layersSelection={layersSelection}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          )}
        </div>
      </div>

      <div className={s.LegendMap}>
        <CSSTransitionWrapper
          in={Boolean(fullSelection)}
          timeout={300}
          unmountOnExit
          appear
          classNames={fadeClassNames}
        >
          {(ref) => (
            <div ref={ref}>
              {selectedData && fullSelection && (
                <LegendWithMap
                  layersSelection={layersSelection as LayerSelectionFull}
                  selectedData={selectedData}
                />
              )}
            </div>
          )}
        </CSSTransitionWrapper>
      </div>
    </div>
  );
}
