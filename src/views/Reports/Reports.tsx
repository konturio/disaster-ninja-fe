import { Suspense } from 'react';
import { Text } from '@konturio/ui-kit';
import { useHistory } from 'react-router';
import { useAtom } from '@reatom/react';
import { i18n } from '~core/localization';
import { ReportsList } from '~features/reports/components/ReportsList/ReportsList';
import config from '~core/app_config';
import { VisibleLogo } from '~components/KonturLogo/KonturLogo';
import { userResourceAtom } from '~core/auth';
import { AppFeature } from '~core/auth/types';
import {
  useAppFeature,
  useFeatureInitializer,
} from '~utils/hooks/useAppFeature';
import s from './Reports.module.css';
import type { History } from 'history';

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

export function Reports() {
  const history = useHistory();
  const [{ data: userModel }] = useAtom(userResourceAtom);
  const loadFeature = useFeatureInitializer(userModel);

  useAppFeature(loadFeature(AppFeature.INTERCOM, import('~features/intercom')));

  const notificationToast = useAppFeature(
    loadFeature(AppFeature.TOASTS, import('~features/toasts')),
  );

  const appHeader = useAppFeature(
    loadFeature(AppFeature.APP_LOGIN, import('~features/app_header')),
    { logo: VisibleLogo(), title: linkableTitle(history) },
    [],
    linkableTitle,
  );
  return (
    <div>
      <Suspense fallback={null}>{appHeader}</Suspense>
      <Suspense fallback={null}>{notificationToast}</Suspense>
      <ReportsList />
    </div>
  );
}
