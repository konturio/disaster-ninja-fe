import { useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { useAtom } from '@reatom/react-v2';
import { Heading } from '@konturio/ui-kit';
import { ConnectedBivariateMatrix } from '~features/bivariate_manager/components/ConnectedBivariateMatrix/ConnectedBivariateMatrix';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { createStateMap } from '~utils/atoms';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { BivariateGreetingsContainer } from '~features/bivariate_manager/components/BivariateGreetings/BivariateGreetingsContainer';
import { i18n } from '~core/localization';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { bivariateStatisticsResourceAtom } from '~core/resources/bivariateStatisticsResource';
import { isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import { AXIS_CAPTIONS_WIDTH, MATRIX_SCALE } from '../BivariateMatrixControl/constants';
import s from './BivariateMatrixContainer.module.css';
import { BivariateMatrixContext } from './bivariateMatrixContext';
import type { BivariateMatrixContextInterface } from './bivariateMatrixContext';

interface BivariateMatrixContainerProps {
  className?: string;
}

const BivariateMatrixContainer = ({ className }: BivariateMatrixContainerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useRef<{ w: number; h: number } | null>(null);

  const statesToComponents = createStateMap(useAtom(bivariateStatisticsResourceAtom)[0]);

  function updateDimensions() {
    if (!containerRef.current || !dimensions.current) return;
    containerRef.current.style.width = `${dimensions.current.w}px`;
    containerRef.current.style.height = `${dimensions.current.h}px`;
  }

  const contextValues = useMemo<BivariateMatrixContextInterface>(
    () => ({
      onMatrixPositionRecalculated: (baseDimension, matrixSize) => {
        const baseDim = baseDimension * MATRIX_SCALE;
        const newWidth = baseDim + matrixSize + AXIS_CAPTIONS_WIDTH;
        const newHeight = matrixSize;
        if (
          !dimensions.current ||
          Math.abs(dimensions.current.w - newWidth) > 3 ||
          Math.abs(dimensions.current.h - newHeight) > 3
        ) {
          dimensions.current = { w: newWidth, h: newHeight };
          updateDimensions();
        }
      },
    }),
    [],
  );

  useEffect(updateDimensions, [containerRef]);

  return (
    <>
      <PanelHeader />
      <div
        id="bivariate-matrix-container"
        className={clsx(s.bivariateContainer, className)}
        ref={containerRef}
      >
        {statesToComponents({
          loading: (
            <div className={s.loadingContainer}>
              <LoadingSpinner />
            </div>
          ),
          error: (
            <ErrorMessage
              message={i18n.t('bivariate.matrix.loading_error')}
              containerClass={s.errorContainer}
            />
          ),
          ready: () => (
            <>
              <BivariateMatrixContext.Provider value={contextValues}>
                <ConnectedBivariateMatrix />
              </BivariateMatrixContext.Provider>
              <BivariateGreetingsContainer className={s.greetings} />
            </>
          ),
        })}
      </div>
    </>
  );
};

const PanelHeader = () => {
  const [focusedGeometry] = useAtom(focusedGeometryAtom);
  const haveGeometry = !isGeoJSONEmpty(focusedGeometry?.geometry);

  return (
    <div className={s.header}>
      <Heading type="heading-04">{i18n.t('bivariate.matrix.header.title')}</Heading>
      {haveGeometry && (
        <div className={s.hint}>{i18n.t('bivariate.matrix.header.hint')}</div>
      )}
    </div>
  );
};

export default BivariateMatrixContainer;
