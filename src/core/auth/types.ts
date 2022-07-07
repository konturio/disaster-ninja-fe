export const UserStateStatus = {
  AUTHORIZED: 'authorized',
  UNAUTHORIZED: 'unauthorized',
  LOGGING_IN: 'logging_in',
  SIGNING_UP: 'signing_up',
  PASSWORD_RESET: 'password_reset',
} as const;

export type UserStateType =
  typeof UserStateStatus[keyof typeof UserStateStatus];

export const AppFeature = {
  APP_LOGIN: 'app_login',
  ANALYTICS_PANEL: 'analytics_panel',
  ADVANCED_ANALYTICS_PANEL: 'advanced_analytics_panel',
  EVENTS_LIST: 'events_list',
  MAP_LAYERS_PANEL: 'map_layers_panel',
  SIDE_BAR: 'side_bar',
  BIVARIATE_MANAGER: 'bivariate_manager',
  CURRENT_EVENT: 'current_event',
  FOCUSED_GEOMETRY_LAYER: 'focused_geometry_layer',
  LAYERS_IN_AREA: 'layers_in_area',
  MAP_RULER: 'map_ruler',
  TOASTS: 'toasts',
  BOUNDARY_SELECTOR: 'boundary_selector',
  DRAW_TOOLS: 'draw_tools',
  FOCUSED_GEOMETRY_EDITOR: 'focused_geometry_editor',
  GEOMETRY_UPLOADER: 'geometry_uploader',
  LEGEND_PANEL: 'legend_panel',
  REPORTS: 'reports',
  INTERACTIVE_MAP: 'interactive_map',
  CURRENT_EPISODE: 'current_episode',
  GEOCODER: 'geocoder',
  EPISODE_LIST: 'episode_list',
  COMMUNITIES: 'communities',
  FEATURE_SETTINGS: 'feature_settings',
  OSM_EDIT_LINK: 'osm_edit_link',
  TOOLTIP: 'tooltip',
  FEED_SELECTOR: 'feed_selector',
  CREATE_LAYER: 'create_layer',
  HEADER: 'header',
  INTERCOM: 'intercom',
  BIVARIATE_COLOR_MANAGER: 'bivariate_color_manager',
} as const;

export type AppFeatureType = typeof AppFeature[keyof typeof AppFeature];

export const BackendFeatureType = {
  UI_PANEL: 'UI_PANEL',
} as const;

export type BackendFeature = {
  name: string;
  description: string;
  type: typeof BackendFeatureType[keyof typeof BackendFeatureType];
};

export type BackendFeed = {
  feed: string;
  description: string;
  default: boolean;
};

export type UserFeed = { feed: string; isDefault?: boolean };
