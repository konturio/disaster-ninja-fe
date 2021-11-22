import { AppHeader } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { Text } from '@k2-packages/ui-kit';
import { ReportInfo } from '~features/reports/components/ReportInfo/ReportInfo';
import { Row } from '~components/Layout/Layout';
import { BetaLabel } from '~components/BetaLabel/BetaLabel';
import s from './Report.module.css';
import { useHistory } from 'react-router';
import config from '~core/app_config';

export function ReportPage() {
  const history = useHistory();
  return (
    <div>
      <div className={s.headerContainer}>
        <AppHeader title="">
          <Row>
            <Text type="short-l">
              <div className={s.customAppTitle}>
                <span
                  className={s.clickable}
                  onClick={() => history.push(config.baseUrl)}
                >
                  {i18n.t('Disaster Ninja')}
                </span>{' '}
                <span>{i18n.t('Reports')}</span>
              </div>
            </Text>
            <div className={s.betaTag}>
              <BetaLabel />
            </div>
          </Row>
        </AppHeader>
      </div>
      <ReportInfo />
    </div>
  );
}
