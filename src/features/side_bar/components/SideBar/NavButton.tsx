import { useAtom } from '@reatom/react';
import { ActionsBarBTN } from '@konturio/ui-kit';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import { searchStringAtom } from '~core/url_store/atoms/urlStore';
import s from './SideBar.module.css';
import type { AppRoute, CurrentRouteAtom } from '~core/router';

type NavButtonProps = {
  route: AppRoute;
  isVisible: boolean;
  minified: boolean;
  checkRouteVisibility: (route: AppRoute, currentRoute: AppRoute | null) => boolean;
  currentRouteAtom: CurrentRouteAtom;
  getAbsoluteRoute: (path: string | AppRoute) => string;
};

export function NavButton({
  route,
  isVisible,
  minified,
  currentRouteAtom,
  getAbsoluteRoute,
}: NavButtonProps) {
  const [searchString] = useAtom(searchStringAtom);
  const [currentRoute] = useAtom(currentRouteAtom);

  if (!isVisible) return null;

  const to = `${getAbsoluteRoute(route)}${searchString}`;

  const navLinkClassName = clsx(route.parentRoute ? s.nestedRoute : s.topLevelRoute);

  return (
    <Link className={navLinkClassName} to={to} tabIndex={-1}>
      <Tooltip placement="right" open={minified ? undefined : false} offset={6}>
        <TooltipTrigger>
          <ActionsBarBTN
            size={route.parentRoute ? 'tiny' : 'small'}
            active={currentRoute?.slug === route.slug}
            iconBefore={route.icon}
            value={route.slug}
            className={clsx(s.navButton, s.sidebarButton)}
          >
            {!minified ? route.title : null}
          </ActionsBarBTN>
        </TooltipTrigger>
        <TooltipContent>{route.title}</TooltipContent>
      </Tooltip>
    </Link>
  );
}
