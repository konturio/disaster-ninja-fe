import { useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useZoomEvent = (
  zoomInCallback: () => void | null,
  zoomOutCallback: () => void | null,
) => {
  let pxRatio =
    window.devicePixelRatio ||
    window.screen.availWidth / document.documentElement.clientWidth;

  const onWindowResize = () => {
    // for zoom detection
    const newPxRatio =
      window.devicePixelRatio ||
      window.screen.availWidth / document.documentElement.clientWidth;
    if (newPxRatio !== pxRatio) {
      if (newPxRatio > pxRatio) {
        if (zoomInCallback !== null) zoomInCallback();
      } else if (zoomOutCallback !== null) zoomOutCallback();
      pxRatio = newPxRatio;
      return true;
    }
    return false;
  };

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);
};
