import { Suspense } from 'react';
import { AppHeader, Text } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { ReportInfo } from '~features/reports/components/ReportInfo/ReportInfo';
import { Row } from '~components/Layout/Layout';
import { BetaLabel } from '~components/BetaLabel/BetaLabel';
import s from './Report.module.css';
import { useHistory } from 'react-router';
import config from '~core/app_config';
import { VisibleLogo } from '~components/KonturLogo/KonturLogo';
import { useAtom } from '@reatom/react';
import { lazily } from 'react-lazily';
import { userResourceAtom } from '~core/auth';

const { NotificationToast } = lazily(() => import('~features/toasts'));

export function ReportPage() {
  const history = useHistory();
  const [{ data }] = useAtom(userResourceAtom);
  const userFeatures = data?.features;

  function linkableTitle() {
    return (
      <Text type="short-l">
        <div className={s.customAppTitle}>
          <span
            className={s.clickable}
            onClick={() => history.push(config.baseUrl)}
            title={i18n.t('to main page')}
          >
            Disaster Ninja
          </span>{' '}
          <span>{i18n.t('Reports')}</span>
        </div>
      </Text>
    );
  }
  return (
    <div>
      <div className={s.headerContainer}>
        <AppHeader title={linkableTitle()} logo={VisibleLogo()}>
          <Row>
            <div className={s.betaTag}>
              <BetaLabel />
            </div>
          </Row>
        </AppHeader>
      </div>
      <Suspense fallback={null}>
        {userFeatures?.toasts === true && <NotificationToast />}
      </Suspense>
      <ReportInfo />
    </div>
  );
}
