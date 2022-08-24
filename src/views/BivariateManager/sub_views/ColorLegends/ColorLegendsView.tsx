import { useAtom } from '@reatom/react';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { SentimentsCombinationsList } from '~features/bivariate_color_manager/components';
import { bivariateColorManagerResourceAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import {
  CSSTransitionWrapper,
  fadeClassNames,
} from '~features/bivariate_color_manager/components/CssTransitionWrapper/CssTransitionWrapper';
import { LegendWithMap } from '~features/bivariate_color_manager/components/LegendWithMap/LegendWithMap';
import { bivariateColorManagerAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManager';
import { ColorLegendFilters } from '~features/bivariate_color_manager/components/ColorLegendFilters/ColorLegendFilters';
import style from './ColorLegendsView.module.css';
import type { LayerSelectionInput } from '~features/bivariate_color_manager/atoms/bivariateColorManager';
import type { LayerSelectionFull } from '~features/bivariate_color_manager/components/LegendWithMap/LegendWithMap';
import type { BivariateColorManagerData } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';

function isFullSelection(
  selection: LayerSelectionInput | null,
): selection is LayerSelectionFull {
  return (
    selection?.horizontal !== undefined && selection?.vertical !== undefined
  );
}

export const ColorLegendsView = () => {
  const [
    { filteredData: data, layersSelection, selectedRows, filters },
    { setLayersSelection, setSelectedRows },
  ] = useAtom(bivariateColorManagerAtom);
  const [{ loading }] = useAtom(bivariateColorManagerResourceAtom);
  const filteredDataNotEmpty = data && Object.keys(data).length > 0;
  const selectedData =
    filteredDataNotEmpty && layersSelection?.key
      ? (data as BivariateColorManagerData)[layersSelection.key]
      : null;
  const anyFilterActivated = Object.values(filters).filter(Boolean).length > 0;

  return (
    <>
      <div className={style.List}>
        <ColorLegendFilters />

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
