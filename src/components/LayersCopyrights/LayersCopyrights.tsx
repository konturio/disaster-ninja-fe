import clsx from 'clsx';
import { useLayersCopyrights } from '~components/LayersCopyrights/useLayersCopyrights';
import s from './LayersCopyrights.module.css';

export const LayersCopyrights = () => {
  const copyrights = useLayersCopyrights();

  return (
    <div className={clsx(s.container)}>
      <div className={s.strokeText} data-text={copyrights}>
        {copyrights}
      </div>
    </div>
  );
};
