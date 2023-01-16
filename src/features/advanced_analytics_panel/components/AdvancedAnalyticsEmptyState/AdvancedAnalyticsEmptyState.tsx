import { i18n } from '~core/localization';
import s from './AdvancedAnalyticsEmptyState.module.css';

interface AdvancedAnalyticsEmptyStateProps {
  stateType?: 'initial' | 'not-found' | 'error';
}

export const AdvancedAnalyticsEmptyState = ({
  stateType = 'initial',
}: AdvancedAnalyticsEmptyStateProps) => {
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

      {i18n.t('advanced_analytics_empty.analytics_for_selected')}
      <br />
      {i18n.t('advanced_analytics_empty.will_be_provided')}
    </div>
  );
};
