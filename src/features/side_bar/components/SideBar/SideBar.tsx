import { useAtom } from '@reatom/react';
import { ActionsBar, Logo } from '@konturio/ui-kit';
import cn from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { AppNameAndIcon } from '../AppNameAndIcon/AppNameAndIcon';
import { routeVisibilityChecker } from './routeVisibilityChecker';
import s from './SideBar.module.css';
import { ToggleButton } from './ToggleButton';
import { NavButton } from './NavButton';
import type { AvailableRoutesAtom, CurrentRouteAtom } from '~core/router';

const wasClosed = 'sidebarClosed';

export function SideBar({
  currentRouteAtom,
  availableRoutesAtom,
  getAbsoluteRoute,
}: {
  currentRouteAtom: CurrentRouteAtom;
  availableRoutesAtom: AvailableRoutesAtom;
  getAbsoluteRoute: (path: string) => string;
}) {
  const [isOpen, setIsOpen] = useState(localStorage.getItem(wasClosed) ? false : true);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const [availableRoutes] = useAtom(availableRoutesAtom);

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
    <div className={cn(s.sidebar, isOpen && s.open)}>
      {availableRoutes && (
        <ActionsBar>
          <div className={cn(s.logoWrap, s.sidebarItemContainer)} tabIndex={-1}>
            <div className={s.buttonWrap}>
              <AppNameAndIcon
                isOpen={isOpen}
                wrapClassName={cn(s.controlButton, s.logoButton)}
                appNameClassName={s.modeName}
              />
            </div>
          </div>
          {availableRoutes.routes.map((route) => (
            <NavButton
              key={route.slug}
              minified={!isOpen}
              showTooltip={!isOpen}
              checkRouteVisibility={checkRouteVisibility}
              route={route}
              currentRouteAtom={currentRouteAtom}
              getAbsoluteRoute={getAbsoluteRoute}
            />
          ))}

          <div className={s.togglerContainer}>
            <ToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>

          <div className={s.konturLogo}>
            <Logo compact={!isOpen} palette="grey" height={32} />
          </div>
        </ActionsBar>
      )}
    </div>
  );
}
