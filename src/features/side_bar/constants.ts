import { BOUNDARY_SELECTOR_CONTROL_ID } from '~features/boundary_selector/constants';
import { EVENT_LIST_CONTROL_ID } from '~features/events_list/constants';
import { MAP_RULER_CONTROL_ID } from '~features/map_ruler/constants';
import { REPORTS_CONTROL_ID } from '~features/reports/constants';
import {
  DOWNLOAD_GEOMETRY_CONTROL_ID,
  FOCUSED_GEOMETRY_CONTROL_ID,
} from '~core/draw_tools/constants';
import { GEOMETRY_UPLOADER_CONTROL_ID } from '~features/geometry_uploader/constants';
import { EDIT_IN_OSM_CONTROL_ID } from '~features/osm_edit_link/constants';
import { CREATE_LAYER_CONTROL_ID } from '~features/create_layer/constants';

export const controlsOrder = [
  EVENT_LIST_CONTROL_ID,
  FOCUSED_GEOMETRY_CONTROL_ID,
  GEOMETRY_UPLOADER_CONTROL_ID,
  BOUNDARY_SELECTOR_CONTROL_ID,
  DOWNLOAD_GEOMETRY_CONTROL_ID,
  MAP_RULER_CONTROL_ID,
  EDIT_IN_OSM_CONTROL_ID,
  REPORTS_CONTROL_ID,
  CREATE_LAYER_CONTROL_ID,
];
