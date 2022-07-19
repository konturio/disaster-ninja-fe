import { useAtom } from '@reatom/react';
import clsx from 'clsx';
import { bivariateColorManagerResourceAtom } from '~features/bivariate_color_manager/atoms/bivariateColorManagerResource';
import { i18n } from '~core/localization';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { SentimentsCombinationsList } from '~features/bivariate_color_manager/components';
import s from './BivariateManager.module.css';

export function BivariateManagerPage() {
  const [{ loading, data }] = useAtom(bivariateColorManagerResourceAtom);
  return (
    <div className={clsx(s.pageContainer)}>
      <div className={clsx(s.Nav)}></div>

      <div className={clsx(s.List)}>
        <div className={clsx(s.ListFilters)}>Filters here: </div>
        <div className={clsx(s.ListBody)}>
          {loading ? (
            <KonturSpinner />
          ) : data ? (
            <SentimentsCombinationsList data={data} />
          ) : (
            i18n.t('No data received.')
          )}
        </div>
      </div>

      <div className={clsx(s.LegendMap)}></div>
    </div>
  );
}
