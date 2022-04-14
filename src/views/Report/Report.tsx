import { Suspense, useEffect } from 'react';
import { Text } from '@k2-packages/ui-kit';
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
import { History } from 'history';
import { AppFeature } from '~core/auth/types';
const { AppHeader } = lazily(() => import('@k2-packages/ui-kit'));
const { NotificationToast } = lazily(() => import('~features/toasts'));

function linkableTitle(history: History) {
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

export function ReportPage() {
  const history = useHistory();
  const [{ data: userModel }] = useAtom(userResourceAtom);

  useEffect(() => {
    if (!userModel) return;

    /* Lazy load module */
    if (userModel.hasFeature(AppFeature.INTERCOM)) {
      import('~features/intercom').then(({ initIntercom }) => {
        initIntercom();
      });
    }
  }, [userModel]);

  return (
    <div>
      <Suspense fallback={null}>
        {userModel?.hasFeature(AppFeature.HEADER) && (
          <div className={s.headerContainer}>
            <AppHeader title={linkableTitle(history)} logo={VisibleLogo()}>
              <Row>
                <div className={s.betaTag}>
                  <BetaLabel />
                </div>
              </Row>
            </AppHeader>
          </div>
        )}
      </Suspense>
      <Suspense fallback={null}>
        {userModel?.hasFeature(AppFeature.TOASTS) && <NotificationToast />}
      </Suspense>
      <ReportInfo />
    </div>
  );
}
