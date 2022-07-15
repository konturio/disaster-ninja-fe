import { StrictMode, Suspense, useCallback, useEffect } from 'react';
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
import {
  useAppFeature,
  useFeatureInitializer,
} from '~utils/hooks/useAppFeature';
import s from './views/Main/Main.module.css';
import type {
  FeatureInterface,
  FeatureModule} from '~utils/hooks/useAppFeature';
import type { AppFeatureType } from '~core/auth/types';
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
  const [{ data: userModel }] = useAtom(userResourceAtom);

  // Load features
  const loadFeature = useCallback(useFeatureInitializer(userModel), [
    userModel,
  ]);

  return (
    <StrictMode>
      <OriginalLogo />

      <Router>
        <CommonRoutesFeatures userModel={userModel} loadFeature={loadFeature} />

        <CacheSwitch>
          <CacheRoute className={s.mainWrap} exact path={ROUTES.base}>
            <Suspense fallback={null}>
              <MainView userModel={userModel} loadFeature={loadFeature} />
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
      </Router>

      <LoginForm />
    </StrictMode>
  );
}

const DEFAULT_HEADER_TITLE = 'Disaster Ninja';
const PAGE_TITLES_BY_ROUTE = {
  [ROUTES.base]: () => DEFAULT_HEADER_TITLE,
  [ROUTES.reports]: () => <LinkableTitle title={i18n.t('Reports')} />,
  [ROUTES.reportPage]: () => <LinkableTitle title={i18n.t('Reports')} />,
  [ROUTES.bivariateManager]: () => (
    <LinkableTitle title={i18n.t('Bivariate Color Manager')} />
  ),
};

type CommonRoutesFeaturesProps = {
  userModel?: UserDataModel | null;
  loadFeature: (
    featureId: AppFeatureType,
    importAction: Promise<FeatureModule>,
  ) => Promise<FeatureInterface | null>;
};

const CommonRoutesFeatures = ({
  userModel,
  loadFeature,
}: CommonRoutesFeaturesProps) => {
  const { pathname } = useLocation();
  const headerTitle = getHeaderTitle(pathname);

  const userProfile = useAppFeature(
    loadFeature(AppFeature.APP_LOGIN, import('~features/user_profile')),
  );
  const appHeader = useAppFeature(
    loadFeature(AppFeature.APP_LOGIN, import('~features/app_header')),
    { logo: VisibleLogo(), title: headerTitle, content: userProfile },
    [],
    userProfile,
  );

  const notificationToast = useAppFeature(
    loadFeature(AppFeature.TOASTS, import('~features/toasts')),
  );

  useAppFeature(loadFeature(AppFeature.INTERCOM, import('~features/intercom')));

  // TODO: this is needed to get features from routes other than '/', as features need /apps/default_id
  // Remove this useEffect right after we don't need /apps/default_id for features request
  useEffect(() => {
    if (
      !matchPath(pathname, {
        path: ROUTES.base,
        exact: true,
      })
    ) {
      currentApplicationAtom.init.dispatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!userModel) return null;

  return (
    <>
      <Suspense fallback={null}>
        {userModel.hasFeature(AppFeature.HEADER) && appHeader}
      </Suspense>
      <Suspense fallback={null}>
        {userModel.hasFeature(AppFeature.TOASTS) && notificationToast}
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
