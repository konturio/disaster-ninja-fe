import { useAtom } from '@reatom/react';
import clsx from 'clsx';
import { bivariateColorManagerResourceAtom } from '~features/bivariate_manager/atoms/bivariateColorManagerResource';
import s from './BivariateManager.module.css';

export function BivariateManagerPage() {
  const [{ loading }] = useAtom(bivariateColorManagerResourceAtom);
  return loading ? null : (
    <div className={clsx(s.pageContainer)}>
      <div className={clsx(s.Nav)}></div>

      <div className={clsx(s.List)}>
        <div className={clsx(s.ListFilters)}>Filters here: </div>
        <div className={clsx(s.ListBody)}></div>
      </div>

      <div className={clsx(s.LegendMap)}></div>
    </div>
  );
}
