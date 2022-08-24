import {
  SelectArea24,
  DisastersListIcon,
  Poly24,
  Plus24,
} from '@konturio/default-icons';
import { i18n } from '~core/localization';
import s from './AnalyticsEmptyState.module.css';

interface AnalyticsEmptyStateProps {
  stateType?: 'initial' | 'not-found';
}

export const AnalyticsEmptyState = ({
  stateType = 'initial',
}: AnalyticsEmptyStateProps) => {
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
        <div className={s.iconRow}>
          <DisastersListIcon /> {i18n.t('advanced_analytics_empty.pick')}
        </div>
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
