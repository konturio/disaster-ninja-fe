import { lazily } from 'react-lazily';
import {
  Alarm24,
  Info24,
  Map24,
  Prefs24,
  User24,
  Reports16,
} from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { AppFeature } from '~core/auth/types';
import { UserStateToComponents } from '~core/auth';
import { goTo } from './goTo';
import type { AppRouterConfig } from './types';
const { MapPage } = lazily(() => import('~views/Map/Map'));
const { ReportsPage } = lazily(() => import('~views/Reports/Reports'));
const { ReportPage } = lazily(() => import('~views/Report/Report'));
const { ProfilePage } = lazily(() => import('~views/Profile/Profile'));
const { AboutPage } = lazily(() => import('~views/About/About'));
const { PrivacyPage } = lazily(() => import('~views/Privacy/Privacy'));
const { CookiesPage } = lazily(() => import('~views/Cookies/Cookies'));
const { BivariateManagerPage } = lazily(
  () => import('~views/BivariateManager/BivariateManager'),
);

export const routerConfig: AppRouterConfig = {
  defaultRoute: '',
  routes: [
    {
      slug: 'about',
      title: i18n.t('modes.about'),
      icon: <Info24 />,
      view: <AboutPage toHomePage={() => goTo('')} />,
      showForNewUsers: true,
    },
    {
      slug: 'privacy',
      title: i18n.t('modes.privacy'),
      icon: <Reports16 />,
      view: <PrivacyPage />,
      parentRoute: 'about',
      visibilityInNavigation: 'always',
    },
    {
      slug: 'cookies',
      title: 'modes.cookies',
      icon: <Reports16 />,
      view: <CookiesPage />,
      parentRoute: 'about',
      visibilityInNavigation: 'never',
    },
    {
      slug: 'profile',
      title: (
        <UserStateToComponents
          authorized={i18n.t('modes.profile')}
          other={i18n.t('login.login_button')}
        />
      ),
      icon: <User24 />,
      view: <ProfilePage />,
      requiredFeature: AppFeature.APP_LOGIN,
    },
    {
      slug: '',
      title: i18n.t('modes.map'),
      icon: <Map24 />,
      view: <MapPage />,
      cached: true,
    },
    {
      slug: 'reports',
      title: i18n.t('modes.reports'),
      icon: <Alarm24 />,
      view: <ReportsPage goToReport={(id) => goTo(`reports/${id}`)} />,
      requiredFeature: AppFeature.REPORTS,
    },
    {
      slug: ':reportId',
      title: 'modes.report',
      icon: <Reports16 />,
      view: <ReportPage />,
      requiredFeature: AppFeature.REPORTS,
      parentRoute: 'reports',
      visibilityInNavigation: 'never',
    },
    {
      slug: 'bivariate-manager',
      title: i18n.t('sidebar.biv_color_manager'),
      icon: <Prefs24 />,
      view: <BivariateManagerPage />,
      requiredFeature: AppFeature.BIVARIATE_COLOR_MANAGER,
    },
  ],
};
