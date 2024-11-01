import { i18n } from '~core/localization';
import { PagesDocument } from '~core/pages';
import { MarkdownWrapper } from '../MarkdownWrapper/MarkdownWrapper';
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
      <PagesDocument
        doc={[
          {
            type: 'md',
            data: i18n.t('llm_analytics.header_info'),
          },
        ]}
        wrapperComponent={MarkdownWrapper}
        id="llm_analytics"
      />
    </div>
  );
};
