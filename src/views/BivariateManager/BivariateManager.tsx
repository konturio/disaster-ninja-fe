import { useAtom } from '@reatom/react';
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

export function BivariateManagerPage() {
  const [{ data, layersSelection }, { setLayersSelection }] = useAtom(
    bivariateColorManagerAtom,
  );
  const [{ loading }] = useAtom(bivariateColorManagerResourceAtom);
  const selectedData =
    data && layersSelection?.key ? data[layersSelection.key] : null;
  const fullSelection =
    layersSelection?.horizontal && layersSelection?.vertical && data;

  return (
    <div className={s.pageContainer}>
      <div className={s.Nav}></div>

      <div className={s.List}>
        <div className={s.ListFilters}>Filters here: </div>
        <div className={s.ListBody}>
          {loading ? (
            <KonturSpinner />
          ) : data ? (
            <SentimentsCombinationsList
              data={data}
              setLayersSelection={setLayersSelection}
              layersSelection={layersSelection}
            />
          ) : (
            i18n.t('No data received.')
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
              {layersSelection && selectedData && fullSelection && (
                <LegendWithMap
                  layersSelection={layersSelection}
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
