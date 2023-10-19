import { useAtom } from '@reatom/react';
import { ActionsBarBTN } from '@konturio/ui-kit';
import cn from 'clsx';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import { searchStringAtom } from '~core/url_store/atoms/urlStore';
import { SmallIconSlot } from '../SmallIconSlot/SmallIconSlot';
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

  const navButtonClassName = cn(
    s.sidebarItemContainer,
    route.parentRoute ? s.nestedRoute : s.topLevelRoute,
  );

  return (
    <Link className={navButtonClassName} to={to} tabIndex={-1}>
      <Tooltip placement="right" open={minified ? undefined : false} offset={8}>
        <TooltipTrigger>
          <div className={s.buttonWrap}>
            <ActionsBarBTN
              size={route.parentRoute ? 'tiny' : 'small'}
              active={currentRoute?.slug === route.slug}
              iconBefore={
                route.parentRoute ? (
                  <SmallIconSlot>{route.icon}</SmallIconSlot>
                ) : (
                  route.icon
                )
              }
              value={route.slug}
              className={s.controlButton}
            >
              {!minified ? <span className={s.modeName}>{route.title}</span> : null}
            </ActionsBarBTN>
          </div>
        </TooltipTrigger>
        <TooltipContent>{route.title}</TooltipContent>
      </Tooltip>
    </Link>
  );
}
