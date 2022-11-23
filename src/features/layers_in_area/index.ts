import { forceRun } from '~core/store/atoms/forceRun';
import { areaLayersControlsAtom } from './atoms/areaLayersControls';
import { areaLayersLegendsAndSources } from './atoms/areaLayersLegendsAndSources';

export function initLayersInArea() {
  forceRun(areaLayersControlsAtom);
  forceRun(areaLayersLegendsAndSources);
}
