import { SelectArea24, DisastersListIcon, Poly24, Plus24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { AppFeature } from '~core/app_features';
import core from '~core/index';
import s from './AdvancedAnalyticsEmptyState.module.css';

interface AdvancedAnalyticsEmptyStateProps {
  stateType?: 'initial' | 'not-found' | 'error';
}

export const AdvancedAnalyticsEmptyState = ({
  stateType = 'initial',
}: AdvancedAnalyticsEmptyStateProps) => {
  const [features] = useAtom(core.features.atom);
  return (
    <div className={s.stateContainer}>
      {stateType === 'not-found' && (
        <>
          {core.i18n.t('advanced_analytics_empty.not_found')}
          <br />
        </>
      )}
      {stateType === 'error' && (
        <>
          {core.i18n.t('advanced_analytics_empty.error')}
          <br />
        </>
      )}

      {core.i18n.t('advanced_analytics_empty.please_select')}
      <br />
      {core.i18n.t('advanced_analytics_empty.to_see_map')}

      <div className={s.iconsContainer}>
        {features.has(AppFeature.EVENTS_LIST) && (
          <div className={s.iconRow}>
            <DisastersListIcon /> {core.i18n.t('advanced_analytics_empty.pickDisaster')}
          </div>
        )}

        {features.has(AppFeature.FOCUSED_GEOMETRY_EDITOR) && (
          <div className={s.iconRow}>
            <Poly24 /> {core.i18n.t('advanced_analytics_empty.draw')}
          </div>
        )}

        {features.has(AppFeature.BOUNDARY_SELECTOR) && (
          <div className={s.iconRow}>
            <SelectArea24 /> {core.i18n.t('advanced_analytics_empty.select')}
          </div>
        )}

        {features.has(AppFeature.GEOMETRY_UPLOADER) && (
          <div className={s.iconRow}>
            <Plus24 /> {core.i18n.t('advanced_analytics_empty.upload')}
          </div>
        )}
      </div>
    </div>
  );
};
