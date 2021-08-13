import { useCallback, useState } from 'react';
import clsx from 'clsx';
import ConnectedAxisControl from '@components/ConnectedAxisControl/ConnectedAxisControl';
import Collapse from '@components/shared/Collapse/Collapse';
import { useZoomEvent } from '@utils/events/useZoomEvent';
import styles from './BivariatePanel.module.css';

interface SideBarProps {
  className?: string;
}

const BivariatePanel = ({ className }: SideBarProps) => {
  const [reloading, setReloading] = useState<boolean>(false);

  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(
    null,
  );

  const onRefChange = useCallback((ref: HTMLDivElement | null) => {
    if (ref) {
      const recalculateDimensions = () => {
        const dim = ref.getClientRects()[0];
        // coeff 0.85 here is because of transform: scale(0.85) applied to matrix
        const baseDim =
          parseFloat(ref.getAttribute('base-dimension') || '0') * 0.85;
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

      const mo = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            recalculateDimensions();
          }
        });
      });

      mo.observe(ref, { attributes: true, childList: false, subtree: false });
      recalculateDimensions();
    }
  }, []);

  // hack to force refresh bivariate panel on browser zoom out
  const forceReloading = () => {
    setReloading(true);
    setTimeout(() => {
      setReloading(false);
    }, 0);
  };

  useZoomEvent(forceReloading, forceReloading);

  return (
    <Collapse location="right">
      <div
        className={clsx(styles.sidePanel, className)}
        style={
          dimensions ? { width: dimensions.w, height: dimensions.h } : undefined
        }
      >
        {!reloading && (
          <div className={styles.scrollMatrix}>
            <div className={styles.matrixContainer}>
              <ConnectedAxisControl ref={onRefChange} />
            </div>
            <div className={styles.topRightCorner} />
            <div className={styles.bottomRightCorner} />
          </div>
        )}
      </div>
    </Collapse>
  );
};

export default BivariatePanel;
