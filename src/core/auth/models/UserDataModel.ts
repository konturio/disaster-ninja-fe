export type AppFeature =
  | 'app_login'
  | 'analytics_panel'
  | 'events_list'
  | 'map_layers_panel'
  | 'side_bar'
  | 'bivariate_manager'
  | 'current_event'
  | 'focused_geometry_layer'
  | 'layers_in_area'
  | 'map_ruler'
  | 'toasts'
  | 'boundary_selector'
  | 'draw_tools'
  | 'geometry_uploader'
  | 'legend_panel'
  | 'reports'
  | 'url_store'
  | 'interactive_map'
  | 'current_episode'
  | 'geocoder'
  | 'episode_list'
  | 'communities'
  | 'feature_settings'
  | 'osm_edit_link'
  | 'tooltip';

export class UserDataModel {
  public features: { [T in AppFeature]?: boolean } = {};
  public feeds: string[] = [];
}
