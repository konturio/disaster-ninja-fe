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
import { AppFeature } from '~core/app/types';
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
// TODO: make a proper ise of subTabs. Make sure to use uniform tab_id instead of tabName
const subTabs: { tabName: string; assetUrl: string }[] | undefined =
  configRepo?.get().features.about_page?.['subTabs'];
const hasUserGuide = subTabs?.find((v) => v.tabName === 'User Guide');

export const routerConfig: AppRouterConfig = {
  defaultRoute: '',
  routes: [
    {
      id: 'map',
      slug: 'map',
      title: i18n.t('modes.map'),
      icon: <Map24 />,
      view: <MapPage />,
      requiredFeature: AppFeature.MAP,
      cached: true,
    },
    {
      id: 'reports',
      slug: 'reports',
      title: i18n.t('modes.reports'),
      icon: <Alarm24 />,
      view: <ReportsPage goToReport={(id) => goTo(`reports/${id}`)} />,
      requiredFeature: AppFeature.REPORTS,
    },
    {
      id: 'report',
      slug: ':reportId',
      title: i18n.t('modes.report'),
      icon: <Reports16 />,
      view: <ReportPage />,
      requiredFeature: AppFeature.REPORTS,
      parentRouteId: 'reports',
      visibilityInNavigation: 'never',
    },
    {
      id: 'bivariate-manager',
      slug: 'bivariate-manager',
      title: i18n.t('sidebar.biv_color_manager'),
      icon: <Prefs24 />,
      view: <BivariateManagerPage />,
      requiredFeature: AppFeature.BIVARIATE_COLOR_MANAGER,
    },
    {
      id: 'profile',
      slug: 'profile',
      title: isAuthenticated ? i18n.t('modes.profile') : i18n.t('login.login_button'),
      icon: <User24 />,
      view: <ProfilePage />,
      requiredFeature: AppFeature.APP_LOGIN,
    },
    {
      id: 'pricing',
      slug: 'pricing',
      title: i18n.t('subscription.title'),
      icon: <Diamond24 />,
      view: <PricingPage />,
      requiredFeature: AppFeature.SUBSCRIPTION,
    },
    {
      id: 'about',
      slug: 'about',
      title: i18n.t('modes.about'),
      icon: <Info24 />,
      view: <AboutPage />,
      showForNewUsers: true,
      requiredFeature: AppFeature.ABOUT_PAGE,
    },
    {
      id: 'terms',
      slug: 'terms',
      title: i18n.t('modes.terms'),
      icon: <Reports16 />,
      view: <PagesDocument doc={[{ type: 'md', url: 'terms.md' }]} key="terms" />,
      parentRouteId: 'about',
      visibilityInNavigation: 'always',
      requiredFeature: AppFeature.ABOUT_PAGE,
    },
    {
      id: 'privacy',
      slug: 'privacy',
      title: i18n.t('modes.privacy'),
      icon: <Reports16 />,
      view: <PagesDocument doc={[{ type: 'md', url: 'privacy.md' }]} key="privacy" />,
      parentRouteId: 'about',
      visibilityInNavigation: 'always',
      requiredFeature: AppFeature.ABOUT_PAGE,
    },
    {
      id: 'user-guide',
      slug: 'user-guide',
      title: i18n.t('modes.user_guide'),
      icon: <Reports16 />,
      view: (
        <PagesDocument doc={[{ type: 'md', url: 'user_guide.md' }]} key="user_guide" />
      ),
      parentRouteId: 'about',
      disabled: !hasUserGuide,
      visibilityInNavigation: 'always',
      requiredFeature: AppFeature.ABOUT_PAGE,
    },
    {
      id: 'cookies',
      slug: 'cookies',
      title: i18n.t('modes.cookies'),
      icon: <Reports16 />,
      view: <PagesDocument doc={[{ type: 'md', url: 'cookies.md' }]} key="cookies" />,
      parentRouteId: 'about',
      visibilityInNavigation: 'never',
      requiredFeature: AppFeature.ABOUT_PAGE,
    },
  ],
};
