import { forceRun } from '~utils/atoms/forceRun';
import { areaLayersControlsAtom } from './atoms/areaLayersControls';
import { areaLayersLegendsAndSources } from './atoms/areaLayersLegendsAndSources';

export function initLayersInArea() {
  forceRun(areaLayersControlsAtom);
  forceRun(areaLayersLegendsAndSources);
}
