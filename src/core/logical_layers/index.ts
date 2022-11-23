import { forceRun } from '~core/store/atoms/forceRun';
import { autoClearAtom } from './atoms/autoClear';

export function init() {
  forceRun([autoClearAtom]);
}
