import { useAtom } from '@reatom/react';
import clsx from 'clsx';
import { bivariateColorManagerResourceAtom } from '~features/bivariate_manager/atoms/bivariateColorManagerResource';
import s from './BivariateManager.module.css';

export function BivariateManagerPage() {
  const [{ loading, data }] = useAtom(bivariateColorManagerResourceAtom);
  return (
    <div className={clsx(s.pageContainer)}>
      <span>{loading ? 'Loading...' : JSON.stringify(data, null, 4)}</span>
    </div>
  );
}
