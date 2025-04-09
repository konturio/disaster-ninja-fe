import { useAtom } from '@reatom/npm-react';
import clsx from 'clsx';
import { copyrightsAtom } from '~widgets/Presentation/Coopyrights/CopyrightsAtom';
import s from './Copyrights.module.css';

export const Copyrights = () => {
  const [copyrights] = useAtom(copyrightsAtom);
  return (
    <div className={clsx(s.container)}>
      <p className={s.strokeText} data-text={copyrights}>
        {copyrights}
      </p>
    </div>
  );
};
