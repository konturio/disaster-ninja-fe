import type { AppFeatureType } from '~core/auth/types';

export interface AppRoute {
  slug: string;
  view: JSX.Element;
  icon: JSX.Element;
  /** How to name this route in navigation */
  title: string | JSX.Element;
  /** Redirect to this route users that see it first time */
  showForNewUsers?: boolean;
  /** Should we unmount (false) or just hide (true) route when it deactivated */
  cached?: boolean;
  /** Replace default content of application header */
  customHeader?: JSX.Element;
  /** What features must be enabled to show this route */
  requiredPermission?: AppFeatureType;
  /** Nest routes to each other */
  parentRoute?: string;
}

export interface AppRouterConfig {
  routes: AppRoute[];
  /** Used as home page and in fallback redirects */
  defaultRoute: AppRoute['slug'];
}
