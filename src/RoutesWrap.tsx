import { Suspense, useEffect } from 'react';
import { lazily } from 'react-lazily';
import { useLocation } from 'react-router-dom';
import { useAction } from '@reatom/react';
import { AppFeature } from '~core/auth/types';
import { initModes } from '~core/modes/initializeModes';
import { Row } from '~components/Layout/Layout';
import { findCurrentMode } from '~core/app_config/appRoutes';
import { currentModeAtom } from '~core/modes/currentMode';
import { initLanguageWatcher } from '~core/auth/atoms/languageWatcher';
import type { UserDataModel } from '~core/auth';

const { NotificationToast } = lazily(() => import('~features/toasts'));
const { PopupTooltip } = lazily(() => import('~features/tooltip'));
const { SideBar } = lazily(() => import('~features/side_bar'));

type CommonRoutesFeaturesProps = {
  userModel: UserDataModel | null;
  children?: JSX.Element | null | false;
};

export const CommonRoutesFeatures = ({
  userModel,
  children,
}: CommonRoutesFeaturesProps) => {
  const { pathname } = useLocation();
  const setApplicationMode = useAction(currentModeAtom.setCurrentMode);

  useEffect(() => {
    if (userModel?.hasFeature(AppFeature.INTERCOM)) {
      import('~features/intercom').then(({ initIntercom }) => {
        initIntercom();
      });
    }
  }, [userModel]);

  useEffect(() => {
    initLanguageWatcher();
  }, []);

  useEffect(() => {
    setApplicationMode(findCurrentMode(pathname));
  }, [pathname, setApplicationMode]);

  useEffect(() => {
    if (userModel) initModes(userModel);
  }, [userModel]);

  return (
    <>
      <Suspense fallback={null}>
        {userModel?.hasFeature(AppFeature.TOOLTIP) && <PopupTooltip />}
      </Suspense>

      <Row>
        <Suspense fallback={null}>
          {userModel?.hasFeature(AppFeature.SIDE_BAR) && <SideBar />}
        </Suspense>
        {children}
      </Row>

      <Suspense fallback={null}>
        {userModel?.hasFeature(AppFeature.TOASTS) && <NotificationToast />}
      </Suspense>
    </>
  );
};
