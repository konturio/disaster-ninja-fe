import {
  EditGeometry16,
  Play24,
  Reference16,
  SelectArea16,
  Upload16,
  User24,
} from '@konturio/default-icons';
import { Text } from '@konturio/ui-kit';
import { Trans } from 'react-i18next';
import { goTo } from '~core/router/goTo';
import { i18n } from '~core/localization';
import styles from './LLMAnalyticsPlaceholder.module.css';

export function LLMAnalyticsPlaceholder() {
  return (
    <div className={styles.placeholderBody}>
      <div className={styles.mainText}>
        <Trans
          i18nKey="llm_analytics.placeholder.select_area"
          components={{
            icon1: <SelectArea16 />,
            icon2: <EditGeometry16 />,
            icon3: <Upload16 />,
          }}
        />
      </div>
      <Text type="long-m">{i18n.t('llm_analytics.placeholder.you_can_also')}</Text>
      <div>
        <Trans
          i18nKey="llm_analytics.placeholder.fill_bio"
          components={{
            icon: <User24 />,
            lnk: (
              <span
                className={styles.clickableText}
                onClick={() => goTo('/profile')}
              ></span>
            ),
          }}
        />
      </div>
      <div>
        <Trans
          i18nKey="llm_analytics.placeholder.select_and_save_as_reference_area"
          components={{
            icon: <Reference16 />,
          }}
        />
      </div>
      <div>
        <Trans
          i18nKey="llm_analytics.placeholder.learn_more"
          components={{
            icon: <Play24 />,
            lnk: (
              <span
                className={styles.clickableText}
                onClick={() => goTo('/about/user-guide')}
              ></span>
            ),
          }}
        />
      </div>
    </div>
  );
}
