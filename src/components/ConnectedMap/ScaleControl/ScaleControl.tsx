import { useAtom } from '@reatom/react-v2';
import { useEffect, useRef } from 'react';
import { currentMapAtom, currentUserAtom } from '~core/shared_state';
import s from './ScaleControl.module.css';
import { updateScale } from './updateScale';

export function ScaleControl() {
  const [currentUserData] = useAtom(currentUserAtom);
  const [map] = useAtom(currentMapAtom);
  const ref = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (!ref.current) return;
    const useMetricUnits = currentUserData?.useMetricUnits;
    const options = {
      maxWidth: 100,
      unit: useMetricUnits ? ('metric' as const) : ('imperial' as const),
    };
    const updateCb = () => {
      if (ref.current) {
        updateScale(map, ref.current, options);
      }
    };
    map.on('move', updateCb);
    updateCb();
    return () => {
      map.off('move', updateCb);
    };
  }, [map, currentUserData?.useMetricUnits]);

  return <div ref={ref} className={s.scale}></div>;
}
