import clsx from 'clsx';
import { useAtom } from '@reatom/react';
import { ActionsBar, Logo } from '@konturio/ui-kit';
import { useEffect, useMemo, useState } from 'react';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { localStorage } from '~utils/storage';
import { AppLogo } from '../AppLogo/AppLogo';
import { routeVisibilityChecker } from './routeVisibilityChecker';
import s from './SideBar.module.css';
import { ToggleButton } from './ToggleButton';
import { NavButton } from './NavButton';
import type { AppRoute, AvailableRoutesAtom, CurrentRouteAtom } from '~core/router';

const wasClosed = 'sidebarClosed';

export function SideBar({
  currentRouteAtom,
  availableRoutesAtom,
  getAbsoluteRoute,
}: {
  currentRouteAtom: CurrentRouteAtom;
  availableRoutesAtom: AvailableRoutesAtom;
  getAbsoluteRoute: (path: string | AppRoute) => string;
}) {
  const [isOpen, setIsOpen] = useState(localStorage.getItem(wasClosed) ? false : true);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const [availableRoutes] = useAtom(availableRoutesAtom);
  const [currentRoute] = useAtom(currentRouteAtom);

  const checkRouteVisibility = useMemo(
    () => (availableRoutes ? routeVisibilityChecker(availableRoutes.routes) : () => true),
    [availableRoutes],
  );

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, setIsOpen]);

  // store locally user preferation to close sidebar
  useEffect(() => {
    if (!isOpen) {
      localStorage.setItem(wasClosed, 'true');
    } else {
      localStorage.removeItem(wasClosed);
    }
  }, [isOpen]);

  return (
    <div className={clsx(s.sidebar, isOpen ? s.open : s.collapsed)}>
      {availableRoutes && (
        <ActionsBar>
          <div tabIndex={-1}>
            <AppLogo isOpen={isOpen} className={clsx(s.navButton)} />
          </div>
          <div className={s.logoDivider}></div>
          {availableRoutes.routes.map((route) => (
            <NavButton
              key={route.slug}
              minified={!isOpen}
              isVisible={checkRouteVisibility(route, currentRoute)}
              checkRouteVisibility={checkRouteVisibility}
              route={route}
              currentRouteAtom={currentRouteAtom}
              getAbsoluteRoute={getAbsoluteRoute}
            />
          ))}

          <div className={s.toggleContainer}>
            <ToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>

          <div className={s.bottomLogoContainer}>
            <Logo compact={!isOpen} palette="grey" height={32} />
          </div>
        </ActionsBar>
      )}
    </div>
  );
}
