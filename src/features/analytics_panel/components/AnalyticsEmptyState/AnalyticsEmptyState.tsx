import { SelectArea24, DisastersListIcon, Poly24, Plus24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { userResourceAtom } from '~core/auth';
import { AppFeature } from '~core/auth/types';
import core from '~core/index';
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
          {core.i18n.t('advanced_analytics_empty.not_found')}
          <br />
        </>
      )}
      {core.i18n.t('advanced_analytics_empty.please_select')}
      <br />
      {core.i18n.t('advanced_analytics_empty.to_see_map')}
      <div className={s.iconsContainer}>
        {userModel?.hasFeature(AppFeature.EVENTS_LIST) && (
          <div className={s.iconRow}>
            <DisastersListIcon /> {core.i18n.t('advanced_analytics_empty.pickDisaster')}
          </div>
        )}

        {userModel?.hasFeature(AppFeature.FOCUSED_GEOMETRY_EDITOR) && (
          <div className={s.iconRow}>
            <Poly24 /> {core.i18n.t('advanced_analytics_empty.draw')}
          </div>
        )}

        {userModel?.hasFeature(AppFeature.BOUNDARY_SELECTOR) && (
          <div className={s.iconRow}>
            <SelectArea24 /> {core.i18n.t('advanced_analytics_empty.select')}
          </div>
        )}

        {userModel?.hasFeature(AppFeature.GEOMETRY_UPLOADER) && (
          <div className={s.iconRow}>
            <Plus24 /> {core.i18n.t('advanced_analytics_empty.upload')}
          </div>
        )}
      </div>
    </div>
  );
};
