import { useAtom } from '@reatom/react-v2';
import { ActionsBarBTN } from '@konturio/ui-kit';
import clsx from 'clsx';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import { goTo } from '~core/router/goTo';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
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
  const [currentRoute] = useAtom(currentRouteAtom);

  if (!isVisible) return null;

  const navLinkClassName = clsx(route.parentRouteId ? s.nestedRoute : s.topLevelRoute);
  const onClick = () => {
    dispatchMetricsEvent(`side_${route.slug}`);
    goTo(getAbsoluteRoute(route));
  };

  return (
    <Tooltip placement="right" open={minified ? undefined : false} offset={6}>
      <TooltipTrigger>
        <ActionsBarBTN
          size={route.parentRouteId ? 'tiny' : 'small'}
          active={currentRoute?.slug === route.slug}
          disabled={route.disabled ?? false}
          iconBefore={route.icon}
          value={route.slug}
          className={clsx(s.navButton, s.sidebarButton, navLinkClassName)}
          onClick={onClick}
        >
          {!minified ? route.title : null}
        </ActionsBarBTN>
      </TooltipTrigger>
      <TooltipContent>{route.title}</TooltipContent>
    </Tooltip>
  );
}
