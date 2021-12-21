import { useCallback, useState } from 'react';
import { useZoomEvent } from '~utils/events/useZoomEvent';
import s from './BivariateMatrixContainer.module.css';
import ConnectedBivariateMatrix
  from '~features/bivariate_manager/components/ConnectedBivariateMatrix/ConnectedBivariateMatrix';

interface BivariateMatrixContainerProps {
  className?: string;
}

const BivariateMatrixContainer = ({ className }: BivariateMatrixContainerProps) => {
  const [reloading, setReloading] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(
    null,
  );

  const [scale, setScale] = useState(1);

  const onRefChange = useCallback(
    (ref: HTMLDivElement | null) => {
      if (ref) {
        const recalculateDimensions = () => {
          const dim = ref.getClientRects()[0];
          const dynamicScale = 1;
          setScale(dynamicScale);
          // coeff 0.85 here is because of transform: scale(0.85) applied to matrix
          const baseDim =
            parseFloat(ref.getAttribute('base-dimension') || '0') *
            dynamicScale;
          const newWidth = baseDim + dim.width + 18;
          const newHeight = dim.height + 2;
          if (
            !dimensions ||
            Math.abs(dimensions.w - newWidth) > 3 ||
            Math.abs(dimensions.h - newHeight) > 3
          ) {
            setDimensions({ w: newWidth, h: newHeight });
          }
        };

        const observer = new MutationObserver((mutationsList) => {
          mutationsList.forEach((mutation) => {
            if (mutation.type === 'attributes') {
              recalculateDimensions();
            }
          });
        });

        observer.observe(ref, {
          attributes: true,
          childList: false,
          subtree: false,
        });
        recalculateDimensions();
      }
    },
    [dimensions],
  );

  // hack to force refresh bivariate panel on browser zoom out
  const forceReloading = () => {
    setReloading(true);
    setTimeout(() => {
      setReloading(false);
    }, 0);
  };

  useZoomEvent(forceReloading, forceReloading);

  return (
    <div
      className={className}
      style={
        dimensions
          ? { width: dimensions.w, height: dimensions.h }
          : undefined
      }
    >
      {!reloading && (
        <div className={s.scrollMatrix}>
          <div
            className={s.matrixContainer}
            style={{ transform: `scale(${scale}) translateX(140px)` }}
          >
            <ConnectedBivariateMatrix ref={onRefChange} />
          </div>
          <div className={s.topRightCorner} />
          <div className={s.bottomRightCorner} />
        </div>
      )}
    </div>
  );
};

export default BivariateMatrixContainer;
