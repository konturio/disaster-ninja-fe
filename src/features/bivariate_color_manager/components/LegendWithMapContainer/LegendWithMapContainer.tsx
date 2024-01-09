import { useAtom } from '@reatom/react-v2';
import {
  CSSTransitionWrapper,
  fadeClassNames,
} from '~components/CssTransitionWrapper/CssTransitionWrapper';
import { LegendWithMap } from '~features/bivariate_color_manager/components/LegendWithMap/LegendWithMap';
import { bivariateColorManagerDataAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerData';
import style from './LegendWithMapContainer.module.css';
import type { LayerSelectionInput } from '~features/bivariate_color_manager/atoms/bivariateColorManagerData';
import type { LayerSelectionFull } from '~features/bivariate_color_manager/components/LegendWithMap/LegendWithMap';

function isFullSelection(
  selection: LayerSelectionInput | null,
): selection is LayerSelectionFull {
  return selection?.horizontal !== undefined && selection?.vertical !== undefined;
}

export const LegendWithMapContainer = () => {
  const [{ filteredData, layersSelection }] = useAtom(
    bivariateColorManagerDataAtom,
    (state) => ({
      filteredData: state.filteredData,
      layersSelection: state.layersSelection,
    }),
  );

  const selectedData =
    filteredData && Object.keys(filteredData).length > 0 && layersSelection?.key
      ? filteredData[layersSelection.key]
      : null;

  return (
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
  );
};
