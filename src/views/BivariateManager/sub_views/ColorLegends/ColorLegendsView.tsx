import { Select } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import { useMemo } from 'react';
import { i18n } from '~core/localization';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { SentimentsCombinationsList } from '~features/bivariate_color_manager/components';
import { bivariateColorManagerResourceAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import {
  CSSTransitionWrapper,
  fadeClassNames,
} from '~features/bivariate_color_manager/components/CssTransitionWrapper/CssTransitionWrapper';
import { LegendWithMap } from '~features/bivariate_color_manager/components/LegendWithMap/LegendWithMap';
import { bivariateColorManagerAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManager';
import style from './ColorLegendsView.module.css';
import type { LayerSelectionInput } from '~features/bivariate_color_manager/atoms/bivariateColorManager';
import type { LayerSelectionFull } from '~features/bivariate_color_manager/components/LegendWithMap/LegendWithMap';
import type { BivariateColorManagerData } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import type { SelectItemType } from '@konturio/ui-kit/tslib/Select/types';

const LayersFilterMenuClasses = { menu: style.LayersFilterMenu };

function itemToString(item) {
  return item ? item.title : '';
}

function isFullSelection(
  selection: LayerSelectionInput | null,
): selection is LayerSelectionFull {
  return (
    selection?.horizontal !== undefined && selection?.vertical !== undefined
  );
}

export const ColorLegendsView = () => {
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
    <>
      <div className={style.List}>
        <div className={style.ListFilters}>
          <Select
            onChange={(item) => setLayersFilter(item.selectedItem || null)}
            classes={LayersFilterMenuClasses}
            items={selectIndicatorsData}
            itemToString={itemToString}
            disabled={loading}
          >
            {i18n.t('Layers')}
          </Select>
        </div>
        <div className={style.ListBody}>
          {loading ? (
            <KonturSpinner />
          ) : (
            <SentimentsCombinationsList
              anyFilterActivated={anyFilterActivated}
              data={data!}
              setLayersSelection={setLayersSelection}
              layersSelection={layersSelection}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          )}
        </div>
      </div>

      <div className={style.LegendMap}>
        <CSSTransitionWrapper
          in={isFullSelection(layersSelection)}
          timeout={300}
          unmountOnExit
          appear
          classNames={fadeClassNames}
        >
          {(ref) => (
            <div ref={ref}>
              {selectedData && isFullSelection(layersSelection) && (
                <LegendWithMap
                  layersSelection={layersSelection}
                  selectedData={selectedData}
                />
              )}
            </div>
          )}
        </CSSTransitionWrapper>
      </div>
    </>
  );
};
