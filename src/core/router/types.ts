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
  /** What features must be enabled to show this route */
  requiredFeature?: AppFeatureType;
  /** Nest routes to each other */
  parentRoute?: string;
  /**
   * Visibility in navigation sidebar
   * - auto (default) - show when route or it's parent is active
   * - never - never show it in navigation
   * - always - always show it in navigation
   * */
  visibilityInNavigation?: 'always' | 'never' | 'auto';
}

export interface AppRouterConfig {
  routes: AppRoute[];
  /** Used as home page and in fallback redirects */
  defaultRoute: AppRoute['slug'];
}
