import { forceRun } from '~utils/atoms/forceRun';
import { areaLayers } from './atoms/areaLayers';
import { areaLayersDetails } from './atoms/areaLayersDetails';

export function initLayersInArea() {
  forceRun(areaLayersDetails);
  forceRun(areaLayers);
}
