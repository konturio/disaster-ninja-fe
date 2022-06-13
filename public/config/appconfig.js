window.konturAppConfig = {
  API_GATEWAY: 'https://test-apps-ninja02.konturlabs.com/active/api',
  FEATURES_API: 'https://test-apps02.konturlabs.com/userprofile/features',
  GRAPHQL_API: 'https://test-apps02.konturlabs.com/insights-api/graphql',
  BOUNDARIES_API: 'https://test-api02.konturlabs.com',
  REPORTS_API: 'https://test-apps-ninja02.konturlabs.com/active/reports',
  BIVARIATE_TILES_RELATIVE_URL: 'api/tiles/bivariate/v1/',
  // use param BIVARIATE_TILES_SERVER if you need to setup external server for bivariate tiles
  //BIVARIATE_TILES_SERVER: 'http://localhost:3000/',
  BIVARIATE_TILES_INDICATORS_CLASS: 'all',
  REFRESH_INTERVAL_SEC: 300,
  MAP_ACCESS_TOKEN: '',
  MAP_BASE_STYLE: 'https://zigzag.kontur.io/tiles/basemap/style_ninja.json',
  LAYERS_BY_DEFAULT: [
    'BIV__Kontur OpenStreetMap Quantity',
    'activeContributors',
    'eventShape',
    'focused-geometry',
  ],
  KEYCLOAK_URL: 'https://keycloak01.konturlabs.com',
  KEYCLOAK_REALM: 'dev',
  KEYCLOAK_CLIENT_ID: 'kontur_platform',
  AUTOFOCUS_PADDINGS: [16, 300, 16, 336],
  AUTOFOCUS_ZOOM: 13,
  INTERCOM_DEFAULT_NAME: null,
  INTERCOM_APP_ID: 'e59cl64z',
  INTERCOM_SELECTOR: '#kontur_header_chat_btn',
  FEATURES_BY_DEFAULT: [
    'events_list',
    'current_event',
    'reports',
    'current_episode',
    'episode_list',
    'osm_edit_link',
    'side_bar',
    'analytics_panel',
    'map_layers_panel',
    'focused_geometry_layer',
    'map_ruler',
    'boundary_selector',
    'draw_tools',
    'geometry_uploader',
    'legend_panel',
    'url_store',
    'feature_settings',
    'layers_in_area',
    'toasts',
    'interactive_map',
    'feed_selector',
    'header',
    'intercom',
    'geocoder',
    'communities',
    'tooltip',
  ],
  DEFAULT_FEED: 'kontur-public',
};
