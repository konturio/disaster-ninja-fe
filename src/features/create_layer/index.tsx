import { forceRun } from '~utils/atoms/forceRun';
import { createLayerSideBarButtonControllerAtom } from '~features/create_layer/atoms/createLayerSideBarButtonController';

export function initCreateLayer() {
  forceRun(createLayerSideBarButtonControllerAtom);
  // TODO: disable all other modes when edit feature enabled
}
