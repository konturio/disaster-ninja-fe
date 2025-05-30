import { useAtom } from '@reatom/react-v2';
import { Button } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useCallback } from 'react';
import { SimpleTooltip } from '@konturio/floating';
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

  const navLinkClassName = clsx(route.parentRouteId ? s.nestedRoute : s.topLevelRoute);
  const onClick = useCallback(() => {
    dispatchMetricsEvent(`side_${route.id}`);
    goTo(getAbsoluteRoute(route));
  }, [route, getAbsoluteRoute]);

  if (!isVisible) return null;

  return (
    <SimpleTooltip
      content={route.title}
      placement="right"
      offset={6}
      open={minified ? undefined : false}
    >
      <Button
        size={route.parentRouteId ? 'tiny' : 'small'}
        active={currentRoute?.slug === route.slug}
        disabled={route.disabled ?? false}
        iconBefore={route.icon}
        value={route.slug}
        className={clsx(s.navButton, s.sidebarButton, navLinkClassName)}
        onClick={onClick}
        dark
        variant="invert"
      >
        {!minified ? route.title : null}
      </Button>
    </SimpleTooltip>
  );
}
