export const AppFeature = {
  ABOUT_PAGE: 'about_page',
  APP_LOGIN: 'app_login',
  ANALYTICS_PANEL: 'analytics_panel',
  ADVANCED_ANALYTICS_PANEL: 'advanced_analytics_panel',
  EVENTS_LIST: 'events_list',
  /**
   * @deprecated Use EVENTS_LIST__FEED_SELECTOR instead
   */
  FEED_SELECTOR: 'feed_selector',
  EVENTS_LIST__FEED_SELECTOR: 'events_list__feed_selector',
  EVENTS_LIST__BBOX_FILTER: 'events_list__bbox_filter',
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
  CREATE_LAYER: 'create_layer',
  HEADER: 'header',
  INTERCOM: 'intercom',
  BIVARIATE_COLOR_MANAGER: 'bivariate_color_manager',
  EPISODES_TIMELINE: 'episodes_timeline',
  LOCATE_ME: 'locate_me',
  USE_3RDPARTY_ANALYTICS: 'use_3rdparty_analytics',
  LIVE_SENSOR: 'live_sensor',
  MCDA: 'mcda',
  TOOLBAR: 'toolbar',
  LAYER_FEATURES_PANEL: 'layer_features_panel',
  REFERENCE_AREA: 'reference_area',
  LLM_ANALYTICS: 'llm_analytics',
  MAP: 'map',
  SUBSCRIPTION: 'subscription',
  ADMIN_BOUNDARY_BREADCRUMBS: 'admin_boundary_breadcrumbs',
} as const;

export type AppFeatureType = (typeof AppFeature)[keyof typeof AppFeature];

export const BackendFeatureType = {
  UI_PANEL: 'UI_PANEL',
} as const;

export type BackendFeature = {
  name: string;
  description: string;
  type: (typeof BackendFeatureType)[keyof typeof BackendFeatureType];
};
