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
import type { AppRoute, AppRouterConfig } from './types';
const { PricingPage } = lazily(() => import('~views/Pricing/Pricing'));
const { MapPage } = lazily(() => import('~views/Map/Map'));
const { ReportsPage } = lazily(() => import('~views/Reports/Reports'));
const { ReportPage } = lazily(() => import('~views/Report/Report'));
const { ProfilePage } = lazily(() => import('~views/Profile/Profile'));
const { AboutPage } = lazily(() => import('~views/About/About'));
const { BivariateManagerPage } = lazily(
  () => import('~views/BivariateManager/BivariateManager'),
);

export const isAuthenticated = !!configRepo.get().user;
export const isMapFeatureEnabled = configRepo.get().features[AppFeature.MAP];

const ABOUT_SUB_TABS: Record<string, Omit<AppRoute, 'view'>> = {
  terms: {
    id: 'terms',
    slug: 'terms',
    title: i18n.t('modes.terms'),
    icon: <Reports16 />,
    parentRouteId: 'about',
    visibilityInNavigation: 'always',
    requiredFeature: AppFeature.ABOUT_PAGE,
  },
  privacy: {
    id: 'privacy',
    slug: 'privacy',
    title: i18n.t('modes.privacy'),
    icon: <Reports16 />,
    parentRouteId: 'about',
    visibilityInNavigation: 'always',
    requiredFeature: AppFeature.ABOUT_PAGE,
  },
  'user-guide': {
    id: 'user-guide',
    slug: 'user-guide',
    title: i18n.t('modes.user_guide'),
    icon: <Reports16 />,
    parentRouteId: 'about',
    visibilityInNavigation: 'always',
    requiredFeature: AppFeature.ABOUT_PAGE,
  },
};

function getVisibleAboutSubTabs() {
  const subTabs: { tabId: string; assetUrl: string }[] | undefined =
    configRepo?.get().features.about_page?.['subTabs'];
  if (Array.isArray(subTabs)) {
    return subTabs
      .filter((v) => ABOUT_SUB_TABS[v.tabId] && v.assetUrl)
      .map((tabValue) => {
        return {
          ...ABOUT_SUB_TABS[tabValue.tabId],
          view: (
            <PagesDocument
              doc={[{ type: 'md', url: tabValue.assetUrl }]}
              key={tabValue.tabId}
            />
          ),
        };
      });
  }
  return [];
}

export const routerConfig: AppRouterConfig = {
  defaultRoute: isAuthenticated && !isMapFeatureEnabled ? 'pricing' : 'map',
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
    ...getVisibleAboutSubTabs(),
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
