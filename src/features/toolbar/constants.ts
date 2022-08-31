import { BOUNDARY_SELECTOR_CONTROL_ID } from '~features/boundary_selector/constants';
import { MAP_RULER_CONTROL_ID } from '~features/map_ruler/constants';
import { FOCUSED_GEOMETRY_EDITOR_CONTROL_ID } from '~core/draw_tools/constants';
import { GEOMETRY_UPLOADER_CONTROL_ID } from '~features/geometry_uploader/constants';
import { EDIT_IN_OSM_CONTROL_ID } from '~features/osm_edit_link/constants';

export const controlsOrder = [
  EDIT_IN_OSM_CONTROL_ID,
  MAP_RULER_CONTROL_ID,
  BOUNDARY_SELECTOR_CONTROL_ID,
  GEOMETRY_UPLOADER_CONTROL_ID,
  FOCUSED_GEOMETRY_EDITOR_CONTROL_ID,
];
