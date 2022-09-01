import { Suspense, useEffect } from 'react';
import { Text } from '@konturio/ui-kit';
import { matchPath } from 'react-router';
import { lazily } from 'react-lazily';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useAction } from '@reatom/react';
import { i18n } from '~core/localization';
import config from '~core/app_config';
import { VisibleLogo } from '~components/KonturLogo/KonturLogo';
import { AppFeature } from '~core/auth/types';
import { currentApplicationAtom } from '~core/shared_state';
import { initUrlStore } from '~core/url_store';
import { initModes } from '~core/modes/initializeModes';
import { Row } from '~components/Layout/Layout';
import { APP_ROUTES, findCurrentMode } from '~core/app_config/appRoutes';
import { urlStoreAtom } from '~core/url_store/atoms/urlStore';
import { currentModeAtom } from '~core/modes/currentMode';
import s from './views/Main/Main.module.css';
import type { UserDataModel } from '~core/auth';

const { UserProfile } = lazily(() => import('~features/user_profile'));
const { AppHeader } = lazily(() => import('@konturio/ui-kit'));
const { NotificationToast } = lazily(() => import('~features/toasts'));
const { PopupTooltip } = lazily(() => import('~features/tooltip'));
const { SideBar } = lazily(() => import('~features/side_bar'));

const DEFAULT_HEADER_TITLE = 'Disaster Ninja';
const PAGE_TITLES_BY_ROUTE = {
  [APP_ROUTES.map]: () => DEFAULT_HEADER_TITLE,
  [APP_ROUTES.reports]: () => <LinkableTitle title={i18n.t('sidebar.reports')} />,
  [APP_ROUTES.reportPage]: () => <LinkableTitle title={i18n.t('sidebar.reports')} />,
  [APP_ROUTES.bivariateManager]: () => (
    <LinkableTitle title={i18n.t('bivariate.color_manager.title')} />
  ),
};

type CommonRoutesFeaturesProps = {
  userModel?: UserDataModel | null;
  children?: JSX.Element | null | false;
};

const afterChatContent = (loginFeature: boolean) => {
  return (
    <div className={s.afterChatContentWrap}>
      <a
        href="https://www.kontur.io/portfolio/disaster-ninja/"
        target="_blank"
        className={s.link}
        rel="noreferrer"
      >
        <Text type="heading-m">{i18n.t('about')}</Text>
      </a>
      {loginFeature && <UserProfile />}
    </div>
  );
};

export const CommonRoutesFeatures = ({
  userModel,
  children,
}: CommonRoutesFeaturesProps) => {
  const { pathname } = useLocation();
  const refreshURL = useAction(urlStoreAtom.refreshUrl);
  const setApplicationMode = useAction(currentModeAtom.setCurrentMode);

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
        path: APP_ROUTES.map,
        exact: true,
      }) ||
      matchPath(pathname, {
        path: APP_ROUTES.eventExplorer,
        exact: true,
      })
    ) {
      initUrlStore();
      refreshURL();
    } else {
      currentApplicationAtom.init.dispatch();
    }
    setApplicationMode(findCurrentMode(pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, setApplicationMode, refreshURL]);

  const headerTitle = getHeaderTitle(pathname);

  useEffect(() => {
    initModes();
  }, []);

  if (!userModel) return null;

  return (
    <>
      <Suspense fallback={null}>
        {userModel?.hasFeature(AppFeature.TOOLTIP) && <PopupTooltip />}
      </Suspense>
      <Suspense fallback={null}>
        {userModel.hasFeature(AppFeature.HEADER) && (
          <AppHeader
            title={headerTitle}
            logo={VisibleLogo()}
            afterChatContent={afterChatContent(
              userModel.hasFeature(AppFeature.APP_LOGIN),
            )}
          />
        )}
      </Suspense>

      <Row>
        <Suspense fallback={null}>
          {userModel?.hasFeature(AppFeature.SIDE_BAR) && <SideBar />}
        </Suspense>
        {children}
      </Row>

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
        <span className={s.clickable} onClick={goBase} title={i18n.t('to_main_page')}>
          Disaster Ninja
        </span>{' '}
        <span>{title}</span>
      </div>
    </Text>
  );
};
