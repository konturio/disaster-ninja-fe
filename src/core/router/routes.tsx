import { lazily } from 'react-lazily';
import {
  Alarm24,
  Info24,
  Map24,
  Prefs24,
  User24,
  Reports16,
  Diamond24,
  BookOpen24,
  Image24,
  Upload24,
} from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { AppFeature } from '~core/app/types';
import { configRepo } from '~core/config';
import { PagesDocument } from '~core/pages';
import { EmbeddedPage } from '~views/EmbeddedPage/EmbeddedPage';
import { OAMAuthWrapper } from '~features/oam-auth/components/OAMAuthWrapper';
import { goTo } from './goTo';
import type {
  AboutFeatureConfig,
  CustomRoutesConfig,
  OAMAuthFeatureConfig,
} from '~core/config/types';
import type { AppRoute, AppRouterConfig } from './types';
const { PricingPage } = lazily(() => import('~views/Pricing/Pricing'));
const { MapPage } = lazily(() => import('~views/Map/Map'));
const { ReportsPage } = lazily(() => import('~views/Reports/Reports'));
const { ReportPage } = lazily(() => import('~views/Report/Report'));
const { ProfilePage } = lazily(() => import('~views/Profile/Profile'));
const { BivariateManagerPage } = lazily(
  () => import('~views/BivariateManager/BivariateManager'),
);

export const isAuthenticated = !!configRepo.get().user;
export const isMapFeatureEnabled = configRepo.get().features[AppFeature.MAP];

const ROUTE_ID_COOKIES = 'cookies';

const shouldShowCookiesPageInSidebar = !!(
  configRepo?.get().features[AppFeature.ABOUT_PAGE]?.['subTabs'] as
    | AboutFeatureConfig['subTabs']
    | undefined
)?.find((subTab) => subTab.tabId === ROUTE_ID_COOKIES);

const ABOUT_SUBTABS: Record<string, Omit<AppRoute, 'view' | 'parentRouteId'>> = {
  terms: {
    id: 'terms',
    slug: 'terms',
    title: i18n.t('modes.terms'),
    icon: <Reports16 />,
    visibilityInNavigation: 'always',
    requiredFeature: AppFeature.ABOUT_PAGE,
  },
  privacy: {
    id: 'privacy',
    slug: 'privacy',
    title: i18n.t('modes.privacy'),
    icon: <Reports16 />,
    visibilityInNavigation: 'always',
    requiredFeature: AppFeature.ABOUT_PAGE,
  },
  'user-guide': {
    id: 'user-guide',
    slug: 'user-guide',
    title: i18n.t('modes.user_guide'),
    icon: <BookOpen24 />,
    visibilityInNavigation: 'always',
    requiredFeature: AppFeature.ABOUT_PAGE,
  },
};

const EMBEDDED_PAGE_ROUTES: Record<string, Omit<AppRoute, 'view'>> = {
  'profile-external': {
    id: 'profile-external',
    slug: 'profile-external',
    title: i18n.t('modes.profile'),
    icon: <User24 />,
    visibilityInNavigation: 'always',
  },
  'upload-imagery': {
    id: 'upload-imagery',
    slug: 'upload',
    title: i18n.t('modes.external.upload_imagery'),
    icon: <Upload24 />,
    visibilityInNavigation: 'always',
  },
  'imagery-catalog': {
    id: 'imagery-catalog',
    slug: 'imagery',
    title: i18n.t('modes.external.imagery_catalog'),
    icon: <Image24 />,
    visibilityInNavigation: 'always',
  },
};

function getAboutSubTabs() {
  const subTabsConfig = configRepo?.get().features[AppFeature.ABOUT_PAGE]?.['subTabs'] as
    | AboutFeatureConfig['subTabs']
    | undefined;
  if (Array.isArray(subTabsConfig)) {
    return subTabsConfig
      .filter((subTab) => ABOUT_SUBTABS[subTab.tabId] && subTab.assetUrl)
      .map((subTabConfig) => ({
        ...ABOUT_SUBTABS[subTabConfig.tabId],
        parentRouteId: 'about',
        view: (
          <PagesDocument
            doc={[{ type: 'md', url: subTabConfig.assetUrl }]}
            key={subTabConfig.tabId}
            id={subTabConfig.tabId}
          />
        ),
      }));
  }
  return [];
}

function getOAMAuthRequiredRoutes(): string[] {
  const oamAuthConfig = configRepo.get().features[AppFeature.OAM_AUTH] as
    | OAMAuthFeatureConfig
    | undefined;
  return oamAuthConfig?.requiredRoutes ?? ['profile-external', 'upload-imagery'];
}

function getCustomRoutes(): AppRoute[] {
  const customRoutesConfig = configRepo?.get().features[AppFeature.CUSTOM_ROUTES]?.[
    'routes'
  ] as CustomRoutesConfig['routes'] | undefined;
  if (Array.isArray(customRoutesConfig)) {
    return customRoutesConfig
      .map((customRoute) => {
        if (
          customRoute.type === 'embedded' &&
          EMBEDDED_PAGE_ROUTES[customRoute.id] &&
          customRoute.url
        ) {
          let view = (
            <EmbeddedPage
              url={customRoute.url}
              title={EMBEDDED_PAGE_ROUTES[customRoute.id].title}
            />
          );

          if (getOAMAuthRequiredRoutes().includes(customRoute.id)) {
            view = <OAMAuthWrapper>{view}</OAMAuthWrapper>;
          }

          return { ...EMBEDDED_PAGE_ROUTES[customRoute.id], view };
        }
        return null;
      })
      .filter((route) => !!route);
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
    ...getCustomRoutes(),
    {
      id: 'about',
      slug: 'about',
      title: i18n.t('modes.about'),
      icon: <Info24 />,
      view: (
        <PagesDocument
          doc={[
            {
              type: 'md',
              url:
                /* @ts-expect-error assetUrl might be undefined but PagesDocument handles this case */ configRepo.get()
                  .features[AppFeature.ABOUT_PAGE]?.assetUrl ?? 'about.md',
            },
          ]}
          key="about"
          id="about"
        />
      ),
      showForNewUsers: true,
      requiredFeature: AppFeature.ABOUT_PAGE,
    },
    ...getAboutSubTabs(),
    {
      id: ROUTE_ID_COOKIES,
      slug: 'cookies',
      title: i18n.t('modes.cookies'),
      icon: <Reports16 />,
      view: (
        <PagesDocument
          doc={[{ type: 'md', url: 'cookies.md' }]}
          key="cookies"
          id="cookies"
        />
      ),
      parentRouteId: 'about',
      visibilityInNavigation: shouldShowCookiesPageInSidebar ? 'always' : 'never',
      requiredFeature: AppFeature.ABOUT_PAGE,
    },
  ],
};
