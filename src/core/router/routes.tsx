import { lazily } from 'react-lazily';
import {
  Alarm24,
  Info24,
  Map24,
  Prefs24,
  User24,
  Reports16,
} from '@konturio/default-icons';
import { HeaderTitle } from '~components/HeaderTitle/HeaderTitle';
import { UserStateToComponents } from '~core/auth';
import { AppFeature } from '~core/app_features';
import type { AppRouterConfig } from './types';
import type { I18n } from '..';

const { MapPage } = lazily(() => import('~views/Map/Map'));
const { ReportsPage } = lazily(() => import('~views/Reports/Reports'));
const { ReportPage } = lazily(() => import('~views/Report/Report'));
const { ProfilePage } = lazily(() => import('~views/Profile/Profile'));
const { AboutPage } = lazily(() => import('~views/About/About'));
const { BivariateManagerPage } = lazily(
  () => import('~views/BivariateManager/BivariateManager'),
);

export const createRoutes = (i18n: I18n): AppRouterConfig => ({
  defaultRoute: 'map',
  routes: [
    {
      slug: 'about',
      title: i18n.t('modes.about'),
      icon: <Info24 />,
      view: <AboutPage />,
      showForNewUsers: true,
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
      requiredPermission: AppFeature.APP_LOGIN,
    },
    {
      slug: 'map',
      title: i18n.t('modes.map'),
      icon: <Map24 />,
      view: <MapPage />,
      cached: true,
    },
    {
      slug: 'reports',
      title: i18n.t('modes.reports'),
      icon: <Alarm24 />,
      view: <ReportsPage />,
      customHeader: <HeaderTitle>{i18n.t('sidebar.reports')}</HeaderTitle>,
      requiredPermission: AppFeature.REPORTS,
    },
    {
      slug: ':reportId',
      title: i18n.t('modes.report'),
      icon: <Reports16 />,
      view: <ReportPage />,
      customHeader: <HeaderTitle>{i18n.t('sidebar.reports')}</HeaderTitle>,
      requiredPermission: AppFeature.REPORTS,
      parentRoute: 'reports',
      hidden: true,
    },
    {
      slug: 'bivariate-manager',
      title: <HeaderTitle>{i18n.t('sidebar.biv_color_manager')}</HeaderTitle>,
      icon: <Prefs24 />,
      view: <BivariateManagerPage />,
      customHeader: <HeaderTitle>{i18n.t('bivariate.color_manager.title')}</HeaderTitle>,
      requiredPermission: AppFeature.BIVARIATE_COLOR_MANAGER,
    },
  ],
});
