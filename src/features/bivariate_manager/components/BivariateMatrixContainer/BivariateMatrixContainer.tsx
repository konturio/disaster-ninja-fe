import { useCallback, useEffect, useRef } from 'react';
import ConnectedBivariateMatrix from '~features/bivariate_manager/components/ConnectedBivariateMatrix/ConnectedBivariateMatrix';
import clsx from 'clsx';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { useAtom } from '@reatom/react';
import { bivariateStatisticsResourceAtom } from '~features/bivariate_manager/atoms/bivariateStatisticsResource';
import { createStateMap } from '~utils/atoms';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import s from './BivariateMatrixContainer.module.css';

interface BivariateMatrixContainerProps {
  className?: string;
}

const BivariateMatrixContainer = ({
  className,
}: BivariateMatrixContainerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(
    null,
  );
  const dimensions = useRef<{ w: number, h: number } | null>(null)

  const statesToComponents = createStateMap(
    useAtom(bivariateStatisticsResourceAtom)[0],
  );

  const onRefChange = useCallback(
    (ref: HTMLDivElement | null) => {
      if (!ref) return;

      const dim = ref.getClientRects()[0];
      // coeff 0.7 here is because of transform: scale(0.7) applied to matrix
      const baseDim = parseFloat(ref.getAttribute('base-dimension') || '0') * 0.7;
      const newWidth = baseDim + dim.width + 18;
      const newHeight = dim.height + 105;
      if (
        !dimensions.current ||
        Math.abs(dimensions.current.w - newWidth) > 3 ||
        Math.abs(dimensions.current.h - newHeight) > 3
      ) {
        dimensions.current = { w: newWidth, h: newHeight };
      }
    },
    [],
  );

  useEffect(() => {
    if (!containerRef.current || !dimensions.current) return;
    containerRef.current.style.width = `${dimensions.current.w}px`;
    containerRef.current.style.height = `${dimensions.current.h}px`;
  }, [containerRef, dimensions]);

  return (
    <div
      id="bivariate-matrix-container"
      className={clsx(s.bivariatecContainer, className)}
      ref={containerRef}
    >
      <div>
        {statesToComponents({
          loading: (
            <div className={s.loadingContainer}>
              <LoadingSpinner />
            </div>
          ),
          error: () => (
            <div className={s.errorContainer}>
              <ErrorMessage message="Unfortunately, we cannot display the matrix. Try refreshing the page or come back later." />
            </div>
          ),
          ready: () => (
            <div className={s.matrixContainer}>
              <ConnectedBivariateMatrix ref={onRefChange} />
            </div>
          ),
        })}
        <div className={s.topRightCorner} />
        <div className={s.bottomRightCorner} />
      </div>
    </div>
  );
};

export default BivariateMatrixContainer;
