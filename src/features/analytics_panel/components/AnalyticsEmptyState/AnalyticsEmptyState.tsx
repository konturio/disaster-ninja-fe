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
      {i18n.t('advanced_analytics_empty.analytics_for_selected')}
      <br />
      {i18n.t('advanced_analytics_empty.will_be_provided')}
    </div>
  );
};
