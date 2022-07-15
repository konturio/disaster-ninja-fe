import { StrictMode, Suspense, useEffect } from 'react';
import { Text } from '@konturio/ui-kit';
import { matchPath } from 'react-router';
import { lazily } from 'react-lazily';
import { useHistory } from 'react-router';
import { CacheRoute, CacheSwitch } from 'react-router-cache-route';
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';
import { useAtom } from '@reatom/react';
import { i18n } from '~core/localization';
import config from '~core/app_config';
import { OriginalLogo } from '~components/KonturLogo/KonturLogo';
import { VisibleLogo } from '~components/KonturLogo/KonturLogo';
import { userResourceAtom } from '~core/auth/atoms/userResource';
import { LoginForm } from '~features/user_profile';
import { AppFeature } from '~core/auth/types';
import { currentApplicationAtom } from '~core/shared_state';
import { initUrlStore } from '~core/url_store';
import s from './views/Main/Main.module.css';
import type { UserDataModel } from '~core/auth';
const { MainView } = lazily(() => import('~views/Main/Main'));
const { Reports } = lazily(() => import('~views/Reports/Reports'));
const { ReportPage } = lazily(() => import('~views/Report/Report'));
const { BivariateManagerPage } = lazily(
  () => import('~views/BivariateManager/BivariateManager'),
);

const ROUTES = {
  base: config.baseUrl,
  reports: config.baseUrl + 'reports',
  reportPage: config.baseUrl + 'reports/:reportId',
  bivariateManager: config.baseUrl + 'bivariate-manager',
};

export function RoutedApp() {
  const [{ data: userModel, loading }] = useAtom(userResourceAtom);
  return (
    <StrictMode>
      <OriginalLogo />

      <Router>
        <CommonRoutesFeatures userModel={userModel} />
        {userModel && !loading && (
          <CacheSwitch>
            <CacheRoute className={s.mainWrap} exact path={ROUTES.base}>
              <Suspense fallback={null}>
                <MainView userModel={userModel} />
              </Suspense>
            </CacheRoute>

            <Route exact path={ROUTES.reports}>
              <Suspense fallback={null}>
                <Reports />
              </Suspense>
            </Route>

            <Route path={ROUTES.reportPage}>
              <Suspense fallback={null}>
                <ReportPage />
              </Suspense>
            </Route>

            <Route path={ROUTES.bivariateManager}>
              <Suspense fallback={null}>
                <BivariateManagerPage />
              </Suspense>
            </Route>
          </CacheSwitch>
        )}
      </Router>
      <LoginForm />
    </StrictMode>
  );
}

const { UserProfile } = lazily(() => import('~features/user_profile'));
const { AppHeader } = lazily(() => import('@konturio/ui-kit'));
const { NotificationToast } = lazily(() => import('~features/toasts'));

const DEFAULT_HEADER_TITLE = 'Disaster Ninja';
const PAGE_TITLES_BY_ROUTE = {
  [ROUTES.base]: () => DEFAULT_HEADER_TITLE,
  [ROUTES.reports]: () => <LinkableTitle title={i18n.t('Reports')} />,
  [ROUTES.reportPage]: () => <LinkableTitle title={i18n.t('Reports')} />,
  [ROUTES.bivariateManager]: () => (
    <LinkableTitle title={i18n.t('Appearance administration')} />
  ),
};

type CommonRoutesFeaturesProps = {
  userModel?: UserDataModel | null;
};

const CommonRoutesFeatures = ({ userModel }: CommonRoutesFeaturesProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (userModel?.hasFeature(AppFeature.INTERCOM)) {
      import('~features/intercom').then(({ initIntercom }) => {
        initIntercom();
      });
    }
  }, [userModel]);

  // TODO: this is needed to get features from routes other than '/', as features need /apps/default_id
  // Remove currentApplicationAtom.init.dispatch(); right after we don't need /apps/default_id for features request
  useEffect(() => {
    if (
      matchPath(pathname, {
        path: ROUTES.base,
        exact: true,
      })
    ) {
      initUrlStore();
    } else {
      currentApplicationAtom.init.dispatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerTitle = getHeaderTitle(pathname);

  if (!userModel) return null;

  return (
    <>
      <Suspense fallback={null}>
        {userModel.hasFeature(AppFeature.HEADER) && (
          <AppHeader
            title={headerTitle}
            logo={VisibleLogo()}
            afterChatContent={
              userModel.hasFeature(AppFeature.APP_LOGIN) ? (
                <UserProfile />
              ) : undefined
            }
          />
        )}
      </Suspense>
      <Suspense fallback={null}>
        {userModel.hasFeature(AppFeature.TOASTS) && <NotificationToast />}
      </Suspense>
    </>
  );
};

const getHeaderTitle = (pathname: string): JSX.Element | string => {
  const activeRoute = Object.keys(PAGE_TITLES_BY_ROUTE).find((route) =>
    matchPath(pathname, {
      path: route,
      exact: true,
    }),
  );

  if (!activeRoute) return DEFAULT_HEADER_TITLE;

  return PAGE_TITLES_BY_ROUTE[activeRoute]();
};

const LinkableTitle = ({ title }: { title: string }) => {
  const history = useHistory();
  const goBase = () => history.push(config.baseUrl);

  return (
    <Text type="short-l">
      <div className={s.customAppTitle}>
        <span
          className={s.clickable}
          onClick={goBase}
          title={i18n.t('to main page')}
        >
          Disaster Ninja
        </span>{' '}
        <span>{title}</span>
      </div>
    </Text>
  );
};
