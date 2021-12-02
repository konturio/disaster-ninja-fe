import { BOUNDARY_SELECTOR_CONTROL_ID } from '~features/boundary_selector/constants';
import { EVENTLIST_CONROL_ID } from '~features/events_list/constants';
import { MAP_RULER_CONTROL_ID } from '~features/map_ruler/constants';
import { REPORTS_CONROL_ID } from '~features/reports/constants';
import { DRAW_TOOLS_CONTROL_ID } from '~features/draw_tools/constants';
import { GEOMETRY_UPLOADER_CONTROL_ID } from '~features/geometry_uploader/constants';

export const controlsOrder = [
  EVENTLIST_CONROL_ID,
  DRAW_TOOLS_CONTROL_ID,
  GEOMETRY_UPLOADER_CONTROL_ID,
  MAP_RULER_CONTROL_ID,
  BOUNDARY_SELECTOR_CONTROL_ID,
  REPORTS_CONROL_ID,
];
