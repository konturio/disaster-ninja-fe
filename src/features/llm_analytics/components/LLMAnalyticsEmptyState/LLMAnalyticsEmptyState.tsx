import { i18n } from '~core/localization';
import { LLMAnalyticsPlaceholder } from '../LLMAnalyticsPlaceholder/LLMAnalyticsPlaceholder';
import s from './LLMAnalyticsEmptyState.module.css';

interface AnalyticsEmptyStateProps {
  stateType?: 'initial' | 'not-found';
}

export const LLMAnalyticsEmptyState = ({
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
      <LLMAnalyticsPlaceholder />
    </div>
  );
};
