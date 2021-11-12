import { BOUNDARY_SELECTOR_CONTROL_ID } from '~features/boundary_selector/constants';
import { MAP_RULER_CONTROL_ID } from '~features/map_ruler/constants';
import { REPORTS_CONROL_ID } from '~features/reports/constants';
// todo: Make mode ids as constants
export const controlsOrder = [
  'UploadFile',
  MAP_RULER_CONTROL_ID,
  BOUNDARY_SELECTOR_CONTROL_ID,
  REPORTS_CONROL_ID,
];
