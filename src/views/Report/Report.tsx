import { Suspense, useEffect } from 'react';
import { Text } from '@konturio/ui-kit';
import { useHistory } from 'react-router';
import { useAtom } from '@reatom/react';
import { lazily } from 'react-lazily';
import { i18n } from '~core/localization';
import { ReportInfo } from '~features/reports/components/ReportInfo/ReportInfo';
import { Row } from '~components/Layout/Layout';
import config from '~core/app_config';
import { VisibleLogo } from '~components/KonturLogo/KonturLogo';
import { userResourceAtom } from '~core/auth';
import { AppFeature } from '~core/auth/types';
import s from './Report.module.css';
import type { History } from 'history';
const { AppHeader } = lazily(() => import('@konturio/ui-kit'));
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
            <AppHeader
              title={linkableTitle(history)}
              logo={VisibleLogo()}
            ></AppHeader>
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
