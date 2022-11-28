import { useAction, useAtom } from '@reatom/react';
import { ActionsBar, ActionsBarBTN, Logo } from '@konturio/ui-kit';
import { nanoid } from 'nanoid';
import cn from 'clsx';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DoubleChevronLeft24, DoubleChevronRight24 } from '@konturio/default-icons';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { i18n } from '~core/localization';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { searchStringAtom } from '~core/url_store/atoms/urlStore';
import { SidebarAppIcon } from '../AppIcon/AppIcon';
import s from './SideBar.module.css';
import type { AvailableRoutesAtom, CurrentRouteAtom, AppRoute } from '~core/router';

const wasClosed = 'sidebarClosed';

/* We want to hide children routes if parent route and his children inactive */
function routeVisibilityChecker(routes: AppRoute[]) {
  type RoutesTree = { [key: string]: RoutesTree };
  const routesTree = routes.reduce((tree, route) => {
    if (route.parentRoute) {
      if (!tree[route.parentRoute]) tree[route.parentRoute] = {};
      tree[route.parentRoute][route.slug] = {};
      return tree;
    }
    tree[route.slug] = {};
    return tree;
  }, {} as RoutesTree);

  return (route: AppRoute, currentRoute: AppRoute | null): boolean => {
    if (route.hidden) return false;
    if (!route.parentRoute) return true; // always show top level routes
    if (currentRoute === null) return false; // hide nested routes if no selected routes
    const isActive = route.slug === currentRoute.slug;
    const haveActiveParentRoute = route.parentRoute
      ? currentRoute?.slug === route.parentRoute
      : false;
    const neighbors = route.parentRoute ? Object.keys(routesTree[route.parentRoute]) : [];
    const haveActiveNeighbor = neighbors.includes(currentRoute.slug);

    return isActive || haveActiveParentRoute || haveActiveNeighbor;
  };
}

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
  const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
  const resetTooltip = useAction(currentTooltipAtom.resetCurrentTooltip);
  const [searchString] = useAtom(searchStringAtom);
  const [availableRoutes] = useAtom(availableRoutesAtom);
  const [currentRoute] = useAtom(currentRouteAtom);

  const checkRouteVisibility = useMemo(
    () => (availableRoutes ? routeVisibilityChecker(availableRoutes.routes) : () => true),
    [availableRoutes],
  );

  function onMouseEnter(target: HTMLDivElement, title: string | JSX.Element) {
    // place tooltip right and vertically aligned to the element
    !isOpen &&
      setTooltip({
        popup: title,
        position: {
          x: target.offsetLeft + 50,
          y: target.offsetTop,
          predefinedPosition: 'bottom-right',
        },
        hoverBehavior: true,
      });
  }

  function onMouseLeave() {
    resetTooltip();
  }

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, setIsOpen]);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((prevState) => !prevState);
    resetTooltip();
  }, [setIsOpen]);

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
              <ActionsBarBTN
                active={false}
                iconBefore={<SidebarAppIcon />}
                className={cn(s.controlButton, s.logoButton)}
              >
                {isOpen ? (
                  <span className={s.modeName}>
                    Disaster <br /> Ninja
                  </span>
                ) : null}
              </ActionsBarBTN>
            </div>
          </div>
          {availableRoutes.routes.map((route) => {
            return checkRouteVisibility(route, currentRoute) ? (
              <Link
                key={nanoid(4)}
                className={s.sidebarItemContainer}
                to={getAbsoluteRoute(
                  route.parentRoute
                    ? `${route.parentRoute}/${route.slug}${searchString}`
                    : `${route.slug}${searchString}`,
                )}
                tabIndex={-1}
              >
                <div
                  className={s.buttonWrap}
                  onPointerLeave={onMouseLeave}
                  onPointerEnter={(e) =>
                    onMouseEnter(e.target as HTMLDivElement, route.title)
                  }
                >
                  <ActionsBarBTN
                    size={route.parentRoute ? 'small-xs' : 'small'}
                    active={currentRoute?.slug === route.slug}
                    iconBefore={route.icon}
                    value={route.slug}
                    className={s.controlButton}
                  >
                    {isOpen ? <span className={s.modeName}>{route.title}</span> : null}
                  </ActionsBarBTN>
                </div>
              </Link>
            ) : null;
          })}

          <div className={s.togglerContainer}>
            <div className={s.toggler}>
              {isOpen ? (
                <div className={s.buttonWrap} onClick={toggleIsOpen} tabIndex={-1}>
                  <ActionsBarBTN
                    iconBefore={<DoubleChevronLeft24 />}
                    className={s.controlButton}
                  >
                    <span className={s.modeName}>{i18n.t('sidebar.collapse')}</span>
                  </ActionsBarBTN>
                </div>
              ) : (
                <div
                  className={s.buttonWrap}
                  onClick={toggleIsOpen}
                  onPointerLeave={onMouseLeave}
                  onPointerEnter={(e) =>
                    onMouseEnter(e.target as HTMLDivElement, i18n.t('sidebar.expand'))
                  }
                >
                  <ActionsBarBTN
                    iconBefore={<DoubleChevronRight24 />}
                    className={s.controlButton}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={s.konturLogo}>
            <Logo compact={!isOpen} palette="grey" height={32} />
          </div>
        </ActionsBar>
      )}
    </div>
  );
}
