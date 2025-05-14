import clsx from 'clsx';
import s from './LayersCopyrights.module.css';

export const LayersCopyrights = ({ copyrights }: { copyrights: string }) => {
  return (
    <div className={clsx(s.container)}>
      <div className={s.strokeText} data-text={copyrights}>
        {copyrights}
      </div>
    </div>
  );
};
