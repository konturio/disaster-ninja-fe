import { SelectArea24, DisastersListIcon, Poly24, Plus24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { userResourceAtom } from '~core/auth';
import { AppFeature } from '~core/auth/types';
import { i18n } from '~core/localization';
import s from './AdvancedAnalyticsEmptyState.module.css';

interface AdvancedAnalyticsEmptyStateProps {
  stateType?: 'initial' | 'not-found' | 'error';
}

export const AdvancedAnalyticsEmptyState = ({
  stateType = 'initial',
}: AdvancedAnalyticsEmptyStateProps) => {
  const [{ data: userModel }] = useAtom(userResourceAtom);
  return (
    <div className={s.stateContainer}>
      {stateType === 'not-found' && (
        <>
          {i18n.t('advanced_analytics_empty.not_found')}
          <br />
        </>
      )}
      {stateType === 'error' && (
        <>
          {i18n.t('advanced_analytics_empty.error')}
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

        {userModel?.hasFeature(AppFeature.FOCUSED_GEOMETRY_EDITOR) && (
          <div className={s.iconRow}>
            <Poly24 /> {i18n.t('advanced_analytics_empty.draw')}
          </div>
        )}

        {userModel?.hasFeature(AppFeature.BOUNDARY_SELECTOR) && (
          <div className={s.iconRow}>
            <SelectArea24 /> {i18n.t('advanced_analytics_empty.select')}
          </div>
        )}

        {userModel?.hasFeature(AppFeature.GEOMETRY_UPLOADER) && (
          <div className={s.iconRow}>
            <Plus24 /> {i18n.t('advanced_analytics_empty.upload')}
          </div>
        )}
      </div>
    </div>
  );
};
