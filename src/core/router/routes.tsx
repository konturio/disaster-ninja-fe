import { lazily } from 'react-lazily';
import {
  Alarm24,
  Info24,
  Map24,
  Prefs24,
  User24,
  Reports16,
  Diamond24,
} from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { AppFeature } from '~core/auth/types';
import { configRepo } from '~core/config';
import { PagesDocument } from '~core/pages';
import { goTo } from './goTo';
import type { AppRouterConfig } from './types';
const { PricingPage } = lazily(() => import('~views/Pricing/Pricing'));
const { MapPage } = lazily(() => import('~views/Map/Map'));
const { ReportsPage } = lazily(() => import('~views/Reports/Reports'));
const { ReportPage } = lazily(() => import('~views/Report/Report'));
const { ProfilePage } = lazily(() => import('~views/Profile/Profile'));
const { AboutPage } = lazily(() => import('~views/About/About'));
const { BivariateManagerPage } = lazily(
  () => import('~views/BivariateManager/BivariateManager'),
);

const isAuthenticated = !!configRepo.get().user;

export const routerConfig: AppRouterConfig = {
  defaultRoute: '',
  routes: [
    {
      slug: '',
      title: i18n.t('modes.map'),
      icon: <Map24 />,
      view: <MapPage />,
      requiredFeature: AppFeature.MAP,
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
    {
      slug: 'profile',
      title: isAuthenticated ? i18n.t('modes.profile') : i18n.t('login.login_button'),
      icon: <User24 />,
      view: <ProfilePage />,
      requiredFeature: AppFeature.APP_LOGIN,
    },
    {
      slug: 'pricing',
      title: i18n.t('subscription.title'),
      icon: <Diamond24 />,
      view: <PricingPage />,
      requiredFeature: AppFeature.SUBSCRIPTION,
    },
    {
      slug: 'about',
      title: i18n.t('modes.about'),
      icon: <Info24 />,
      view: <AboutPage />,
      showForNewUsers: true,
      requiredFeature: AppFeature.ABOUT_PAGE,
    },
    {
      slug: 'privacy',
      title: i18n.t('modes.privacy'),
      icon: <Reports16 />,
      view: <PagesDocument doc={[{ type: 'md', url: 'privacy.md' }]} />,
      parentRoute: 'about',
      visibilityInNavigation: 'always',
      requiredFeature: AppFeature.ABOUT_PAGE,
    },
    {
      slug: 'cookies',
      title: 'modes.cookies',
      icon: <Reports16 />,
      view: <PagesDocument doc={[{ type: 'md', url: 'cookies.md' }]} />,
      parentRoute: 'about',
      visibilityInNavigation: 'never',
      requiredFeature: AppFeature.ABOUT_PAGE,
    },
  ],
};
