import { Heading } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { LLMAnalyticsContainer } from '../LLMAnalyticsContainer/LLMAnalyticsContainer';
import styles from './LLMPanelContent.module.css';

export function LLMPanelContent() {
  return (
    <div className={styles.panelBody}>
      <Heading type="heading-04" margins={false}>
        {i18n.t('llm_analytics.header')}
      </Heading>
      <LLMAnalyticsContainer />
    </div>
  );
}
