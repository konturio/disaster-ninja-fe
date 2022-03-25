import { forceRun } from '~utils/atoms/forceRun';
import { autoClearAtom } from './atoms/autoClear';

export function init() {
  forceRun([autoClearAtom]);
}
