import { forceRun } from '~utils/atoms/forceRun';
import { autoClearAtom } from './atoms/autoClear';
import { mutualExcludedLayersDisablerAtom } from './atoms/mutualExcludedLayersDisabler';

export function init() {
  forceRun([autoClearAtom, mutualExcludedLayersDisablerAtom]);
}
