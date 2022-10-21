import { SelectArea24, DisastersListIcon, Poly24, Plus24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { userResourceAtom } from '~core/auth';
import { AppFeature } from '~core/auth/types';
import { i18n } from '~core/localization';
import s from './AnalyticsEmptyState.module.css';

interface AnalyticsEmptyStateProps {
  stateType?: 'initial' | 'not-found';
}

export const AnalyticsEmptyState = ({
  stateType = 'initial',
}: AnalyticsEmptyStateProps) => {
  const [{ data: userModel }] = useAtom(userResourceAtom);
  return (
    <div className={s.stateContainer}>
      {stateType === 'not-found' && (
        <>
          {i18n.t('advanced_analytics_empty.not_found')}
          <br />
        </>
      )}
      {i18n.t('advanced_analytics_empty.please_select')}
      <br />
      {i18n.t('advanced_analytics_empty.to_see_map')}
      <div className={s.iconsContainer}>
        {userModel?.hasFeature(AppFeature.EVENTS_LIST) && (
          <div className={s.iconRow}>
            <DisastersListIcon /> {i18n.t('advanced_analytics_empty.pickDisaster')}
          </div>
        )}
        <div className={s.iconRow}>
          <Poly24 /> {i18n.t('advanced_analytics_empty.draw')}
        </div>
        <div className={s.iconRow}>
          <SelectArea24 /> {i18n.t('advanced_analytics_empty.select')}
        </div>
        <div className={s.iconRow}>
          <Plus24 /> {i18n.t('advanced_analytics_empty.upload')}
        </div>
      </div>
    </div>
  );
};
