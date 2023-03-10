import { useAtom } from '@reatom/react';
import { ActionsBarBTN, Tooltip } from '@konturio/ui-kit';
import cn from 'clsx';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { searchStringAtom } from '~core/url_store/atoms/urlStore';
import { SmallIconSlot } from '../SmallIconSlot/SmallIconSlot';
import s from './SideBar.module.css';
import type { AppRoute, CurrentRouteAtom } from '~core/router';

type NavButtonProps = {
  route: AppRoute;
  minified: boolean;
  checkRouteVisibility: (route: AppRoute, currentRoute: AppRoute | null) => boolean;
  showTooltip?: boolean;
  currentRouteAtom: CurrentRouteAtom;
  getAbsoluteRoute: (path: string) => string;
};

export function NavButton({
  route,
  minified,
  checkRouteVisibility,
  showTooltip,
  currentRouteAtom,

  getAbsoluteRoute,
}: NavButtonProps) {
  const [searchString] = useAtom(searchStringAtom);
  const [currentRoute] = useAtom(currentRouteAtom);

  const isVisible = checkRouteVisibility(route, currentRoute);

  const ref = useRef<HTMLDivElement>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  if (!isVisible) return null;

  const to = getAbsoluteRoute(
    route.parentRoute
      ? `${route.parentRoute}/${route.slug}${searchString}`
      : `${route.slug}${searchString}`,
  );

  const className = cn(
    s.sidebarItemContainer,
    route.parentRoute ? s.nestedRoute : s.topLevelRoute,
  );

  return (
    <Link className={className} to={to} tabIndex={-1}>
      <div
        ref={ref}
        className={s.buttonWrap}
        onPointerEnter={() => setIsTooltipOpen(true)}
        onPointerLeave={() => setIsTooltipOpen(false)}
      >
        <ActionsBarBTN
          size={route.parentRoute ? 'small-xs' : 'small'}
          active={currentRoute?.slug === route.slug}
          iconBefore={
            route.parentRoute ? <SmallIconSlot>{route.icon}</SmallIconSlot> : route.icon
          }
          value={route.slug}
          className={s.controlButton}
        >
          {!minified ? <span className={s.modeName}>{route.title}</span> : null}
        </ActionsBarBTN>
      </div>
      <Tooltip
        triggerRef={ref}
        offset={15}
        open={showTooltip && isTooltipOpen}
        placement="right"
        hoverBehavior
      >
        <div className={s.tooltip}>{route.title}</div>
      </Tooltip>
    </Link>
  );
}
