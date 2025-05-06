import { useAtom } from '@reatom/npm-react';
import clsx from 'clsx';
import { layersCopyrightsAtom } from '~features/presentation_mode/LayersCoopyrights/LayersCopyrightsAtom';
import s from './LayersCopyrights.module.css';

export const LayersCopyrights = () => {
  const [copyrights] = useAtom(layersCopyrightsAtom);

  return (
    <div className={clsx(s.container)}>
      <div className={s.strokeText} data-text={copyrights}>
        {copyrights}
      </div>
    </div>
  );
};
